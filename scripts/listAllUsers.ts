/**
 * List all users in Firestore to help debug console visibility
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

async function listAllUsers() {
  try {
    console.log("📋 Listing all users in Firestore...\n");
    console.log(`Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bible-app-4a0de"}\n`);
    
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    
    if (snapshot.empty) {
      console.log("❌ No users found in the 'users' collection");
      return;
    }
    
    console.log(`✅ Found ${snapshot.size} user(s):\n`);
    
    snapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. Document ID: ${doc.id}`);
      console.log(`   Email: ${data.email || 'N/A'}`);
      console.log(`   UID: ${data.uid || 'N/A'}`);
      console.log(`   Display Name: ${data.displayName || 'N/A'}`);
      console.log(`   isPro: ${data.isPro || false}`);
      console.log(`   isPremium: ${data.isPremium || false}`);
      console.log(`   Created: ${data.createdAt || 'N/A'}`);
      console.log('');
    });
    
    console.log(`\n💡 If you can't see these users in Firebase Console, check:`);
    console.log(`   1. You're viewing the correct project (${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bible-app-4a0de"})`);
    console.log(`   2. You're viewing the correct database (default vs. other databases)`);
    console.log(`   3. Firestore security rules allow you to read the collection`);
    console.log(`   4. Try refreshing the Firebase Console page`);
    console.log(`   5. Check if there are multiple Firestore databases in your project`);
    
  } catch (error: any) {
    console.error("Error listing users:", error);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
  }
}

listAllUsers().then(() => {
  process.exit(0);
});

