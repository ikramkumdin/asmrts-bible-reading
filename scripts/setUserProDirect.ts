/**
 * Script to manually set a user to Pro status using Firebase Admin SDK
 * Run with: npx tsx scripts/setUserProDirect.ts
 */

import * as admin from "firebase-admin";

// Initialize Firebase Admin
if (!admin.apps.length) {
  // Try to use service account from environment variable or default credentials
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // Use default credentials (if running on GCP or with gcloud auth)
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    console.log("\nTrying with project ID only...");
    // Fallback: initialize with just project ID
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
}

const db = admin.firestore();

async function setUserPro(email: string) {
  try {
    console.log(`Looking for user with email: ${email}`);
    
    // Query users by email
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();
    
    if (snapshot.empty) {
      console.error(`❌ No user found with email: ${email}`);
      return;
    }
    
    // Update all matching users (should only be one)
    const proSubscriptionEnd = new Date();
    proSubscriptionEnd.setFullYear(proSubscriptionEnd.getFullYear() + 1);
    
    const batch = db.batch();
    snapshot.forEach((userDoc) => {
      const userRef = usersRef.doc(userDoc.id);
      batch.update(userRef, {
        isPremium: true,
        isPro: true,
        proSubscriptionEnd: proSubscriptionEnd.toISOString(),
      });
      console.log(`✅ Will update user ${userDoc.id} (${email}) to Pro status`);
    });
    
    await batch.commit();
    
    console.log(`\n✅ Successfully set user ${email} to Pro status`);
    console.log(`   Pro subscription ends: ${proSubscriptionEnd.toISOString()}`);
    console.log(`   Users updated: ${snapshot.size}`);
    
  } catch (error) {
    console.error("Error setting user to Pro:", error);
    process.exit(1);
  }
}

// Get email from command line argument or use default
const email = process.argv[2] || "bintkumdin@gmail.com";

setUserPro(email).then(() => {
  console.log("\nDone!");
  process.exit(0);
}).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

