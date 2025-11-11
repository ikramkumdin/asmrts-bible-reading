import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, User as FirebaseUser } from "firebase/auth";
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

// Firebase configuration - reads from .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase config initialized

// Initialize Firebase only if we have valid config and we're on the client side
let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let analytics: Analytics | null = null;

// Validate Firebase config before initialization
if (typeof window !== 'undefined') {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('❌ Firebase configuration is missing!');
    console.error('Missing values:', {
      apiKey: !firebaseConfig.apiKey,
      projectId: !firebaseConfig.projectId,
      authDomain: !firebaseConfig.authDomain,
      appId: !firebaseConfig.appId,
    });
    console.error('Please check your .env.local file and ensure all NEXT_PUBLIC_FIREBASE_* variables are set.');
  } else {
    try {
      // Check if Firebase is already initialized with a different project
      const existingApps = getApps();
      if (existingApps.length > 0) {
        const existingApp = existingApps[0];
        const existingProjectId = (existingApp.options as { projectId?: string })?.projectId;
        if (existingProjectId && existingProjectId !== firebaseConfig.projectId) {
          // Firebase already initialized with different project - reinitializing
          try {
            app = initializeApp(firebaseConfig, 'NEW_INSTANCE');
            auth = getAuth(app);
            db = getFirestore(app);
          } catch (reinitError) {
            console.error('Failed to re-initialize Firebase:', reinitError);
            // Fall back to existing app
            app = existingApp;
            auth = getAuth(app);
            db = getFirestore(app);
          }
        } else {
          app = existingApp;
          auth = getAuth(app);
          db = getFirestore(app);
        }
      } else {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
      }
      
      // Only initialize Analytics if measurementId is available and valid
      if (firebaseConfig.measurementId && 
          firebaseConfig.measurementId !== 'your_measurement_id' && 
          firebaseConfig.measurementId.startsWith('G-') &&
          firebaseConfig.measurementId.length > 10) {
        try {
          analytics = getAnalytics(app);
        } catch (analyticsError) {
          analytics = null;
        }
      }
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
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
 * Uses popup by default, falls back to redirect if COOP policy blocks popup
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
    // 1. Try popup first (preferred UX)
    let result;
    let firebaseUser: FirebaseUser;
    
    try {
      result = await signInWithPopup(auth, provider);
      firebaseUser = result.user;
    } catch (popupError: any) {
      // Suppress COOP warnings - they're just warnings, popup still works
      // The warning appears because browser can't check if popup was closed due to COOP policy
      // But the authentication still succeeds
      if (popupError?.message?.includes('Cross-Origin-Opener-Policy') ||
          popupError?.message?.includes('window.closed')) {
        // This is just a warning, not an actual error
        // The popup authentication should still work
        // If we have a result, use it; otherwise it's a real error
        if (result?.user) {
          firebaseUser = result.user;
        } else {
          // Popup was actually blocked, fall back to redirect
          await signInWithRedirect(auth, provider);
          throw new Error('Redirecting to Google sign-in...');
        }
      } else if (popupError?.code === 'auth/popup-blocked') {
        // Popup was blocked by browser, use redirect
        await signInWithRedirect(auth, provider);
        throw new Error('Redirecting to Google sign-in...');
      } else {
        // Re-throw other errors
        throw popupError;
      }
    }

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
    // Don't throw error if it's a redirect (that's expected)
    if (error instanceof Error && error.message === 'Redirecting to Google sign-in...') {
      throw error; // Let the redirect happen
    }
    console.error("Google Sign-In Error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to sign in with Google");
  }
};

/**
 * Handle redirect result after Google sign-in redirect
 * Call this on page load to check if user just returned from redirect
 */
export const handleRedirectResult = async (): Promise<{
  token: string;
  user: User;
  userTokens: number;
} | null> => {
  if (!auth || !db) {
    return null;
  }
  
  try {
    const result = await getRedirectResult(auth);
    if (!result) {
      return null; // No redirect result
    }
    
    const firebaseUser = result.user;
    const token = await firebaseUser.getIdToken();
    
    // Check for user in Firestore
    const userRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userRef);
    
    let userTokens = 100; // Default tokens for new users
    let userData: User;
    
    // Create new user if they don't exist
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
      
      trackSignup('google', firebaseUser.email || undefined);
    } else {
      const existingData = userDoc.data();
      userTokens = existingData.tokenCount || 0;
      
      userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        tokenCount: userTokens,
      };
      
      await setDoc(userRef, {
        lastLoginAt: new Date().toISOString(),
      }, { merge: true });
    }
    
    return { token, user: userData, userTokens };
  } catch (error: unknown) {
    console.error("Redirect result error:", error);
    return null;
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
    return;
  }
  
  try {
    logEvent(analytics, eventName, parameters);
  } catch (error) {
    // Silently fail analytics tracking
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

// Track book subscription events
export const trackBookSubscription = (bookId: string, bookTitle: string, frequency: 'daily' | 'weekly', asmrModel: string) => {
  safeLogEvent('bible_book_subscribe', {
    bible_book_id: bookId,
    bible_book_title: bookTitle,
    bible_frequency: frequency,
    bible_asmr_model: asmrModel,
    content_category: 'subscription'
  });
};

// Track book unsubscription events
export const trackBookUnsubscription = (bookId: string, bookTitle: string) => {
  safeLogEvent('bible_book_unsubscribe', {
    bible_book_id: bookId,
    bible_book_title: bookTitle,
    content_category: 'subscription'
  });
};

