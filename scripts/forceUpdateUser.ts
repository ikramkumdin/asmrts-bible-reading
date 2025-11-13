/**
 * Force update user by document ID - uses set() instead of update() to ensure fields are added
 * Run with: npx tsx scripts/forceUpdateUser.ts <documentId>
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
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bible-app-4a0de",
    });
  }
}

const db = admin.firestore();

async function forceUpdateUser(docId: string) {
  try {
    console.log(`Force updating user document with ID: ${docId}`);
    console.log(`Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bible-app-4a0de"}`);
    
    const userRef = db.collection("users").doc(docId);
    
    // Try to get the document
    let userDoc = await userRef.get();
    let userData = userDoc.exists ? userDoc.data() : null;
    
    if (!userData) {
      console.log(`Document ${docId} doesn't exist. Creating it with Pro status...`);
      userData = {
        uid: docId,
        email: "bintkumdin@gmail.com",
        isPremium: true,
        isPro: true,
        proSubscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      };
      await userRef.set(userData);
      console.log("✅ Created new document with Pro status");
    } else {
      console.log("Current user data:", JSON.stringify(userData, null, 2));
      
      // Use update() instead of set() to preserve all existing fields
      const proSubscriptionEnd = new Date();
      proSubscriptionEnd.setFullYear(proSubscriptionEnd.getFullYear() + 1);
      
      console.log("\nUpdating document with Pro fields...");
      await userRef.update({
        isPremium: true,
        isPro: true,
        proSubscriptionEnd: proSubscriptionEnd.toISOString(),
      });
      
      console.log(`\n✅ Successfully updated document ${docId} with Pro status`);
    }
    
    // Verify
    const verifyDoc = await userRef.get();
    const verifyData = verifyDoc.data();
    console.log("\n✅ Verified document data:");
    console.log(JSON.stringify(verifyData, null, 2));
    
  } catch (error: any) {
    console.error("Error:", error);
    if (error.code) console.error("Error code:", error.code);
    process.exit(1);
  }
}

const docId = process.argv[2] || "0CptmYruDBfDWLaY9bOg1xvGLJb2";
forceUpdateUser(docId).then(() => {
  console.log("\nDone!");
  process.exit(0);
});

