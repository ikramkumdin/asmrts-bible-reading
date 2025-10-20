import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAnalytics, logEvent, Analytics } from "firebase/analytics";

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
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if we have valid config and we're on the client side
let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let analytics: Analytics | null = null;

if (typeof window !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Only initialize Analytics if measurementId is available and valid
    if (firebaseConfig.measurementId && 
        firebaseConfig.measurementId !== 'your_measurement_id' && 
        firebaseConfig.measurementId.startsWith('G-') &&
        firebaseConfig.measurementId.length > 10) {
      try {
        analytics = getAnalytics(app);
        console.log('Firebase Analytics initialized successfully');
      } catch (analyticsError) {
        console.warn('Firebase Analytics initialization failed:', analyticsError);
        analytics = null;
      }
    } else {
      console.warn('Firebase Analytics not initialized: No valid measurementId (should start with G- and be longer than 10 chars)');
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { auth, db, analytics };
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
  if (!auth || !db) {
    throw new Error('Firebase not initialized');
  }
  
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

      // Track signup event for new users
      trackSignup('google', firebaseUser.email || undefined);
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
  if (!auth) {
    throw new Error('Firebase not initialized');
  }
  
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
  if (!db) {
    throw new Error('Firebase not initialized');
  }
  
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

/**
 * Analytics Event Tracking Functions
 */

// Helper function to safely log events
const safeLogEvent = (eventName: string, parameters: Record<string, unknown>) => {
  if (!analytics) {
    console.warn(`Analytics not available for event: ${eventName}`);
    return;
  }
  
  try {
    logEvent(analytics, eventName, parameters);
  } catch (error) {
    console.warn(`Failed to track event ${eventName}:`, error);
  }
};

// Track user signup
export const trackSignup = (method: 'google' | 'email', userEmail?: string) => {
  safeLogEvent('bible_user_signup', {
    method: method,
    user_email: userEmail || 'anonymous'
  });
};

// Track user login
export const trackLogin = (method: 'google' | 'email') => {
  safeLogEvent('bible_user_login', {
    method: method
  });
};

// Track audio play events
export const trackAudioPlay = (bookId: string, chapterId: number, preset: string, audioType: 'chapter' | 'verse', verseId?: number) => {
  safeLogEvent('bible_audio_play', {
    bible_book_id: bookId,
    bible_chapter_id: chapterId,
    bible_preset: preset,
    bible_audio_type: audioType,
    bible_verse_id: verseId || null,
    content_category: 'bible_audio'
  });
};

// Track audio completion
export const trackAudioComplete = (bookId: string, chapterId: number, preset: string, audioType: 'chapter' | 'verse', duration: number) => {
  safeLogEvent('bible_audio_complete', {
    bible_book_id: bookId,
    bible_chapter_id: chapterId,
    bible_preset: preset,
    bible_audio_type: audioType,
    bible_duration: Math.round(duration),
    content_category: 'bible_audio'
  });
};

// Track chapter completion (manual mark as complete)
export const trackChapterComplete = (bookId: string, chapterId: number, preset: string) => {
  safeLogEvent('bible_chapter_complete', {
    bible_book_id: bookId,
    bible_chapter_id: chapterId,
    bible_preset: preset,
    content_category: 'bible_reading'
  });
};

// Track email subscription
export const trackEmailSubscription = (asmrModel: string, deliveryType: string, frequency: string) => {
  safeLogEvent('bible_email_subscribe', {
    bible_asmr_model: asmrModel,
    bible_delivery_type: deliveryType,
    bible_frequency: frequency,
    content_category: 'subscription'
  });
};

// Track page views
export const trackPageView = (pageName: string, pageTitle?: string) => {
  safeLogEvent('bible_page_view', {
    bible_page_name: pageName,
    bible_page_title: pageTitle || pageName,
    content_category: 'navigation'
  });
};

// Track book selection
export const trackBookSelect = (bookId: string, bookTitle: string) => {
  safeLogEvent('bible_book_select', {
    bible_book_id: bookId,
    bible_book_title: bookTitle,
    content_category: 'bible_navigation'
  });
};

// Track preset selection
export const trackPresetSelect = (preset: string) => {
  safeLogEvent('bible_voice_select', {
    bible_preset: preset,
    content_category: 'user_preference'
  });
};

// Track search events
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  safeLogEvent('bible_search', {
    bible_search_term: searchTerm,
    bible_results_count: resultsCount,
    content_category: 'search'
  });
};

// Track error events
export const trackError = (errorType: string, errorMessage: string, context?: string) => {
  safeLogEvent('bible_error', {
    bible_error_type: errorType,
    bible_error_message: errorMessage,
    bible_context: context || 'unknown',
    content_category: 'error'
  });
};

