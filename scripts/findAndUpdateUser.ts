/**
 * Find user by email and update with Pro status, preserving all existing data
 */

import * as admin from "firebase-admin";

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

async function findAndUpdateUser(email: string) {
  try {
    console.log(`Finding and updating user with email: ${email}`);
    
    // Find by email
    const snapshot = await db.collection("users").where("email", "==", email).get();
    
    if (snapshot.empty) {
      console.error(`❌ No user found with email: ${email}`);
      return;
    }
    
    console.log(`Found ${snapshot.size} user(s) with email ${email}`);
    
    snapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();
      console.log(`\n📄 Document ID: ${userDoc.id}`);
      console.log(`   Current data:`, {
        email: userData.email,
        uid: userData.uid,
        displayName: userData.displayName,
        isPremium: userData.isPremium,
        isPro: userData.isPro,
      });
      
      const proSubscriptionEnd = new Date();
      proSubscriptionEnd.setFullYear(proSubscriptionEnd.getFullYear() + 1);
      
      // Update with merge to preserve all existing fields
      await db.collection("users").doc(userDoc.id).set({
        ...userData,
        isPremium: true,
        isPro: true,
        proSubscriptionEnd: proSubscriptionEnd.toISOString(),
      }, { merge: true });
      
      console.log(`✅ Updated document ${userDoc.id} with Pro status`);
    });
    
    // Wait a bit for updates to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify all updates
    console.log("\n🔍 Verifying updates...");
    const verifySnapshot = await db.collection("users").where("email", "==", email).get();
    verifySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\n✅ Document ${doc.id}:`);
      console.log(`   isPremium: ${data.isPremium}`);
      console.log(`   isPro: ${data.isPro}`);
      console.log(`   proSubscriptionEnd: ${data.proSubscriptionEnd}`);
    });
    
  } catch (error: any) {
    console.error("Error:", error);
    process.exit(1);
  }
}

const email = process.argv[2] || "bintkumdin@gmail.com";
findAndUpdateUser(email).then(() => {
  console.log("\n✅ Done! User should now have Pro status.");
  console.log("Please refresh your browser or sign out and sign back in.");
  process.exit(0);
});

