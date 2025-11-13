import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";

// Initialize Firebase for server-side use
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app for server-side
let app: ReturnType<typeof initializeApp>;
let db: ReturnType<typeof getFirestore>;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  app = getApp();
  db = getFirestore(app);
}

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Get event type and clone request for text-based signature check
    const eventType = req.headers.get("x-event-name");
    
    console.log("🔔 Webhook received! Event type:", eventType);
    
    // Get raw body for signature verification
    const rawBody = await req.text();
    
    // Parse body for data
    const body = JSON.parse(rawBody);
    
    console.log("📦 Webhook body structure:", {
      meta: body.meta,
      dataAttributes: body.data?.attributes,
      customData: body.meta?.custom_data,
    });

    // Signature verification
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SIGNATURE;
    if (!secret) {
      console.error("❌ Webhook secret not configured");
      throw new Error("Webhook secret not configured");
    }

    const signature = req.headers.get("x-signature") || "";
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(rawBody).digest("hex");

    // Ensure the signature is compared safely
    if (digest.length !== signature.length) {
      console.error("❌ Invalid signature length");
      throw new Error("Invalid signature length.");
    }

    if (
      !crypto.timingSafeEqual(
        Buffer.from(digest, "utf8"),
        Buffer.from(signature, "utf8")
      )
    ) {
      console.error("❌ Invalid signature");
      throw new Error("Invalid signature.");
    }

    // Event handling logic
    if (eventType === "order_created") {
      // Try multiple possible locations for user_id
      const userId = body.meta?.custom_data?.user_id 
        || body.data?.attributes?.checkout_data?.custom?.user_id
        || body.data?.attributes?.user_id;
      
      console.log("👤 Extracted user ID:", userId);
      console.log("🔍 Looking in paths:", {
        path1: body.meta?.custom_data?.user_id,
        path2: body.data?.attributes?.checkout_data?.custom?.user_id,
        path3: body.data?.attributes?.user_id,
      });
      
      // Check both product_id and variant_id from the order item
      const productId = body.data?.attributes?.first_order_item?.product_id;
      const variantId = body.data?.attributes?.first_order_item?.variant_id;
      const isSuccessful = body.data?.attributes?.status === "paid";
      
      console.log("💰 Order details:", {
        productId,
        variantId,
        status: body.data?.attributes?.status,
        isSuccessful,
      });

      if (!userId) {
        console.error("❌ User ID not found in webhook! Full body:", JSON.stringify(body, null, 2));
        throw new Error("User ID not found in webhook data");
      }

      if (isSuccessful) {
        // Fetch the user in Firestore
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          throw new Error("User not found");
        }

        // Logic for handling product purchase
        // Check both product_id and variant_id to match the Pro plan
        const proPlanProductId = process.env.LEMON_SQUEEZY_PRO_PLAN_PRODUCT_ID;
        const refillProductId = process.env.LEMON_SQUEEZY_REFILL_PRODUCT_ID;
        
        // Convert to strings for comparison (Lemon Squeezy might send as string or number)
        const proPlanIdStr = String(proPlanProductId);
        const refillIdStr = String(refillProductId);
        const receivedProductIdStr = productId ? String(productId) : null;
        const receivedVariantIdStr = variantId ? String(variantId) : null;
        
        console.log("🔢 ID Comparison:", {
          proPlanIdStr,
          refillIdStr,
          receivedProductIdStr,
          receivedVariantIdStr,
          productMatch: receivedProductIdStr === proPlanIdStr || receivedVariantIdStr === proPlanIdStr,
          refillMatch: receivedProductIdStr === refillIdStr || receivedVariantIdStr === refillIdStr,
        });
        
        if (receivedProductIdStr === refillIdStr || receivedVariantIdStr === refillIdStr) {
          // Refill logic: Add 100 credits
          const currentTokens = userDoc.data().tokenCount || 0;
          await updateDoc(userRef, { tokenCount: currentTokens + 100 });
        } else if (
          receivedProductIdStr === proPlanIdStr || receivedVariantIdStr === proPlanIdStr
        ) {
          // Subscription logic: Activate pro plan for 1 year
          const proSubscriptionEnd = new Date();
          proSubscriptionEnd.setFullYear(proSubscriptionEnd.getFullYear() + 1);

          await updateDoc(userRef, {
            isPremium: true,
            isPro: true,
            proSubscriptionEnd: proSubscriptionEnd.toISOString(),
          });
          
          console.log("✅ Pro plan activated successfully for user:", userId);
        } else {
          console.error("❌ No matching product ID found!", {
            receivedProductIdStr,
            receivedVariantIdStr,
            expectedProPlanId: proPlanIdStr,
            expectedRefillId: refillIdStr,
          });
        }

        return NextResponse.json({ success: true }, { status: 200 });
      }
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

