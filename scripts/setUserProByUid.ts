/**
 * Script to manually set a user to Pro status by UID
 * Run with: npx tsx scripts/setUserProByUid.ts <uid>
 */

import * as admin from "firebase-admin";

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  } catch (error) {
    console.log("Trying with project ID only...");
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
}

const db = admin.firestore();

async function setUserProByUid(uid: string) {
  try {
    console.log(`Setting user with UID: ${uid} to Pro status`);
    
    // First try to find by document ID
    let userRef = db.collection("users").doc(uid);
    let userDoc = await userRef.get();
    
    // If not found by document ID, try to find by uid field
    if (!userDoc.exists) {
      console.log(`Document with ID ${uid} not found, searching by uid field...`);
      const snapshot = await db.collection("users").where("uid", "==", uid).get();
      
      if (snapshot.empty) {
        console.error(`❌ No user found with UID: ${uid}`);
        return;
      }
      
      // Use the first matching document
      userDoc = snapshot.docs[0];
      userRef = db.collection("users").doc(userDoc.id);
      console.log(`Found user with document ID: ${userDoc.id}`);
    }
    
    const userData = userDoc.data();
    console.log("Current user data:", userData);
    
    const proSubscriptionEnd = new Date();
    proSubscriptionEnd.setFullYear(proSubscriptionEnd.getFullYear() + 1);
    
    await userRef.update({
      isPremium: true,
      isPro: true,
      proSubscriptionEnd: proSubscriptionEnd.toISOString(),
    });
    
    console.log(`\n✅ Successfully set user ${uid} to Pro status`);
    console.log(`   Email: ${userData?.email || 'N/A'}`);
    console.log(`   Pro subscription ends: ${proSubscriptionEnd.toISOString()}`);
    
    // Verify the update
    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data();
    console.log("\n✅ Verified updated user data:");
    console.log("   isPremium:", updatedData?.isPremium);
    console.log("   isPro:", updatedData?.isPro);
    console.log("   proSubscriptionEnd:", updatedData?.proSubscriptionEnd);
    
  } catch (error) {
    console.error("Error setting user to Pro:", error);
    process.exit(1);
  }
}

// Get UID from command line argument
const uid = process.argv[2] || "0CptmYruDBfDWLaY9bOg1xvGLJb2";

setUserProByUid(uid).then(() => {
  console.log("\nDone!");
  process.exit(0);
}).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

