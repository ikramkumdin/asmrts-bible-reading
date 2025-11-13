/**
 * Verify and fix user document - reads and updates in one go
 */

import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bible-app-4a0de",
    });
  }
}

const db = admin.firestore();

async function verifyAndFixUser(docId: string) {
  try {
    console.log(`\n🔍 Verifying user document: ${docId}`);
    console.log(`Project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bible-app-4a0de"}\n`);
    
    const userRef = db.collection("users").doc(docId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      console.error("❌ Document does not exist!");
      return;
    }
    
    const currentData = userDoc.data();
    console.log("📄 Current document data:");
    console.log(JSON.stringify(currentData, null, 2));
    
    // Check if Pro fields exist
    const hasProFields = currentData?.isPremium === true && currentData?.isPro === true;
    console.log(`\n✅ Has Pro fields: ${hasProFields}`);
    console.log(`   isPremium: ${currentData?.isPremium}`);
    console.log(`   isPro: ${currentData?.isPro}`);
    console.log(`   proSubscriptionEnd: ${currentData?.proSubscriptionEnd}`);
    
    if (!hasProFields) {
      console.log("\n🔧 Adding Pro fields...");
      const proSubscriptionEnd = new Date();
      proSubscriptionEnd.setFullYear(proSubscriptionEnd.getFullYear() + 1);
      
      await userRef.update({
        isPremium: true,
        isPro: true,
        proSubscriptionEnd: proSubscriptionEnd.toISOString(),
      });
      
      console.log("✅ Pro fields added!");
      
      // Verify again
      const verifyDoc = await userRef.get();
      const verifyData = verifyDoc.data();
      console.log("\n✅ Final document state:");
      console.log(JSON.stringify(verifyData, null, 2));
    } else {
      console.log("\n✅ User already has Pro fields!");
    }
    
  } catch (error: any) {
    console.error("❌ Error:", error);
    if (error.code) console.error("Error code:", error.code);
  }
}

const docId = process.argv[2] || "0CptmYruDBfDWLaY9bOg1xvGLJb2";
verifyAndFixUser(docId).then(() => {
  console.log("\n✅ Done!");
  process.exit(0);
});

