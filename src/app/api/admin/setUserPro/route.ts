import { NextRequest, NextResponse } from "next/server";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
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

// Simple admin secret check (for development only)
const ADMIN_SECRET = process.env.ADMIN_SECRET || "dev-secret-key-change-in-production";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Check for admin secret in header or body
    const authHeader = req.headers.get("authorization");
    const { email, adminSecret } = await req.json();
    
    // Verify admin secret
    const providedSecret = authHeader?.replace("Bearer ", "") || adminSecret;
    if (providedSecret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log(`Setting user with email: ${email} to Pro status`);
    
    // Query users by email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: `No user found with email: ${email}` },
        { status: 404 }
      );
    }
    
    // Update all matching users (should only be one)
    const proSubscriptionEnd = new Date();
    proSubscriptionEnd.setFullYear(proSubscriptionEnd.getFullYear() + 1);
    
    const updates = [];
    querySnapshot.forEach((userDoc) => {
      const userRef = doc(db, "users", userDoc.id);
      updates.push(
        updateDoc(userRef, {
          isPremium: true,
          isPro: true,
          proSubscriptionEnd: proSubscriptionEnd.toISOString(),
        })
      );
    });
    
    await Promise.all(updates);
    
    return NextResponse.json({
      success: true,
      message: `Successfully set user ${email} to Pro status`,
      proSubscriptionEnd: proSubscriptionEnd.toISOString(),
      usersUpdated: querySnapshot.size,
    });
    
  } catch (error: any) {
    console.error("Error setting user to Pro:", error);
    return NextResponse.json(
      { error: "Failed to set user to Pro", details: error.message },
      { status: 500 }
    );
  }
}

