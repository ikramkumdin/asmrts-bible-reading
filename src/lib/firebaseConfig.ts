import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Custom User type for our application
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  tokenCount: number;
}

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Configure Google Auth Provider
provider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Sign in with Google and handle user creation/retrieval
 */
export const signInWithGoogle = async (): Promise<{
  token: string;
  user: User;
  userTokens: number;
}> => {
  try {
    // 1. Trigger Google Sign-In popup
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // 2. Get Firebase ID token
    const token = await firebaseUser.getIdToken();

    // 3. Check for user in Firestore
    const userRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    let userTokens = 100; // Default tokens for new users
    let userData: User;

    // 4. Create new user if they don't exist
    if (!userDoc.exists()) {
      userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        tokenCount: userTokens,
      };

      await setDoc(userRef, {
        ...userData,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      });
    } else {
      // 5. Get existing user's data and update last login
      const existingData = userDoc.data();
      userTokens = existingData.tokenCount || 0;
      
      userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        tokenCount: userTokens,
      };

      // Update last login time
      await setDoc(userRef, {
        lastLoginAt: new Date().toISOString(),
      }, { merge: true });
    }

    return { token, user: userData, userTokens };
  } catch (error: unknown) {
    console.error("Google Sign-In Error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to sign in with Google");
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    console.error("Sign Out Error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to sign out");
  }
};

/**
 * Convert Firebase User to our custom User type
 */
export const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userDoc = await getDoc(userRef);
  
  const tokenCount = userDoc.exists() ? userDoc.data().tokenCount || 0 : 100;
  
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    tokenCount,
  };
};

