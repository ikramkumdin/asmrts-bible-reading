/**
 * Complete user update - add all missing fields to the main user document
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

async function completeUserUpdate() {
  try {
    const docId = "0CptmYruDBfDWLaY9bOg1xvGLJb2";
    const userRef = db.collection("users").doc(docId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      console.error("Document not found");
      return;
    }
    
    const currentData = userDoc.data() || {};
    
    // Update with all fields, preserving existing and adding missing ones
    const proSubscriptionEnd = new Date();
    proSubscriptionEnd.setFullYear(proSubscriptionEnd.getFullYear() + 1);
    
    await userRef.set({
      ...currentData,
      uid: docId,
      email: "bintkumdin@gmail.com",
      displayName: currentData.displayName || "Ekram",
      photoURL: currentData.photoURL || "https://lh3.googleusercontent.com/a/ACg8ocIZvYtsNyS9hmWrk-AXgObaj5WLJsgi3tZXyi6Efm7WYB5Sh2A=s96-c",
      tokenCount: currentData.tokenCount || 100,
      createdAt: currentData.createdAt || "2025-10-30T09:00:08.061Z",
      lastLoginAt: new Date().toISOString(),
      isPremium: true,
      isPro: true,
      proSubscriptionEnd: proSubscriptionEnd.toISOString(),
    }, { merge: true });
    
    console.log("✅ User document fully updated with all fields and Pro status");
    
    // Verify
    const verify = await userRef.get();
    const verifyData = verify.data();
    console.log("\n✅ Final document state:");
    console.log(JSON.stringify(verifyData, null, 2));
    
  } catch (error: any) {
    console.error("Error:", error);
  }
}

completeUserUpdate().then(() => {
  console.log("\n✅ Done!");
  process.exit(0);
});

