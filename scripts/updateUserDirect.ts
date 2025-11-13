/**
 * Script to update user directly by document ID
 * Run with: npx tsx scripts/updateUserDirect.ts <documentId>
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

async function updateUserByDocId(docId: string) {
  try {
    console.log(`Updating user document with ID: ${docId}`);
    
    const userRef = db.collection("users").doc(docId);
    
    // First, try to read the document
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      console.error(`❌ Document with ID ${docId} does not exist`);
      console.log("Trying to list all users to find the correct document...");
      
      // List all users
      const allUsers = await db.collection("users").limit(10).get();
      console.log(`Found ${allUsers.size} users:`);
      allUsers.forEach((doc) => {
        const data = doc.data();
        console.log(`  - Document ID: ${doc.id}, Email: ${data.email}, UID: ${data.uid}`);
      });
      return;
    }
    
    const userData = userDoc.data();
    console.log("Current user data:", userData);
    
    const proSubscriptionEnd = new Date();
    proSubscriptionEnd.setFullYear(proSubscriptionEnd.getFullYear() + 1);
    
    console.log("\nUpdating document...");
    await userRef.update({
      isPremium: true,
      isPro: true,
      proSubscriptionEnd: proSubscriptionEnd.toISOString(),
    });
    
    console.log(`\n✅ Successfully updated document ${docId}`);
    console.log(`   Email: ${userData?.email || 'N/A'}`);
    console.log(`   Pro subscription ends: ${proSubscriptionEnd.toISOString()}`);
    
    // Verify the update
    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data();
    console.log("\n✅ Verified updated user data:");
    console.log("   isPremium:", updatedData?.isPremium);
    console.log("   isPro:", updatedData?.isPro);
    console.log("   proSubscriptionEnd:", updatedData?.proSubscriptionEnd);
    
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error.code) {
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
    }
    process.exit(1);
  }
}

// Get document ID from command line argument
const docId = process.argv[2] || "0CptmYruDBfDWLaY9bOg1xvGLJb2";

updateUserByDocId(docId).then(() => {
  console.log("\nDone!");
  process.exit(0);
}).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

