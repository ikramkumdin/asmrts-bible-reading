/**
 * Script to manually set a user to Pro status
 * Run with: npx tsx scripts/setUserPro.ts
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);

async function setUserPro(email: string) {
  try {
    console.log(`Looking for user with email: ${email}`);
    
    // Query users by email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error(`❌ No user found with email: ${email}`);
      return;
    }
    
    // Update all matching users (should only be one)
    const proSubscriptionEnd = new Date();
    proSubscriptionEnd.setFullYear(proSubscriptionEnd.getFullYear() + 1);
    
    querySnapshot.forEach(async (userDoc) => {
      const userRef = doc(db, "users", userDoc.id);
      await updateDoc(userRef, {
        isPremium: true,
        isPro: true,
        proSubscriptionEnd: proSubscriptionEnd.toISOString(),
      });
      
      console.log(`✅ Successfully set user ${userDoc.id} (${email}) to Pro status`);
      console.log(`   Pro subscription ends: ${proSubscriptionEnd.toISOString()}`);
    });
    
  } catch (error) {
    console.error("Error setting user to Pro:", error);
    process.exit(1);
  }
}

// Get email from command line argument or use default
const email = process.argv[2] || "bintkumdin@gmail.com";

setUserPro(email).then(() => {
  console.log("Done!");
  process.exit(0);
});

