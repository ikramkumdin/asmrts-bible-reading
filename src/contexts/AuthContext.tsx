'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, convertFirebaseUser, signInWithGoogle, signOutUser, handleRedirectResult, User, trackSignup, trackLogin } from '@/lib/firebaseConfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    // Check for redirect result first (if user just returned from redirect auth)
    handleRedirectResult().then((redirectResult) => {
      if (redirectResult) {
        setUser(redirectResult.user);
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Error handling redirect result:', error);
    });
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // Convert Firebase user to our custom User type
          const customUser = await convertFirebaseUser(firebaseUser);
          setUser(customUser);
          
          // Track login event
          trackLogin('google');
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error converting Firebase user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    if (!auth) {
      throw new Error('Firebase not initialized');
    }
    
    try {
      setLoading(true);
      const { user: signedInUser } = await signInWithGoogle();
      setUser(signedInUser);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) {
      throw new Error('Firebase not initialized');
    }
    
    try {
      setLoading(true);
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};