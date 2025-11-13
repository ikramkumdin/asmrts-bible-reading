import { NextRequest, NextResponse } from "next/server";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
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

// Admin endpoint to manually set Pro status (for testing/troubleshooting)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, adminSecret } = body;

    // Security check - require admin secret
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    // Set Pro status for 1 year
    const proSubscriptionEnd = new Date();
    proSubscriptionEnd.setFullYear(proSubscriptionEnd.getFullYear() + 1);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      isPremium: true,
      isPro: true,
      proSubscriptionEnd: proSubscriptionEnd.toISOString(),
    });

    console.log("✅ Manually set Pro status for user:", userId);

    return NextResponse.json({
      message: "Pro status updated successfully",
      userId,
      proSubscriptionEnd: proSubscriptionEnd.toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Error setting Pro status:", error);
    return NextResponse.json(
      { message: "Failed to set Pro status", error: error.message },
      { status: 500 }
    );
  }
}

