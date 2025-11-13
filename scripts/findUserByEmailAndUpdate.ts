/**
 * Find user by email, check UID, and update Pro status
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

async function findAndUpdateByEmail(email: string) {
  try {
    console.log(`\n🔍 Finding user with email: ${email}\n`);
    
    // Find by email
    const snapshot = await db.collection("users").where("email", "==", email).get();
    
    if (snapshot.empty) {
      console.error(`❌ No user found with email: ${email}`);
      return;
    }
    
    console.log(`Found ${snapshot.size} document(s) with email ${email}:\n`);
    
    snapshot.forEach(async (doc) => {
      const data = doc.data();
      console.log(`📄 Document ID: ${doc.id}`);
      console.log(`   UID field: ${data.uid || 'N/A'}`);
      console.log(`   Email: ${data.email}`);
      console.log(`   isPremium: ${data.isPremium}`);
      console.log(`   isPro: ${data.isPro}`);
      console.log(`   proSubscriptionEnd: ${data.proSubscriptionEnd || 'N/A'}`);
      
      // Update Pro status
      const proSubscriptionEnd = new Date();
      proSubscriptionEnd.setFullYear(proSubscriptionEnd.getFullYear() + 1);
      
      await db.collection("users").doc(doc.id).update({
        isPremium: true,
        isPro: true,
        proSubscriptionEnd: proSubscriptionEnd.toISOString(),
      });
      
      console.log(`   ✅ Updated to Pro status\n`);
    });
    
    // Wait for updates
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify
    console.log("🔍 Verifying updates...\n");
    const verifySnapshot = await db.collection("users").where("email", "==", email).get();
    verifySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`✅ Document ${doc.id}:`);
      console.log(`   isPremium: ${data.isPremium}`);
      console.log(`   isPro: ${data.isPro}`);
      console.log(`   proSubscriptionEnd: ${data.proSubscriptionEnd}\n`);
    });
    
  } catch (error: any) {
    console.error("Error:", error);
  }
}

const email = process.argv[2] || "bintkumdin@gmail.com";
findAndUpdateByEmail(email).then(() => {
  console.log("✅ Done!");
  process.exit(0);
});

