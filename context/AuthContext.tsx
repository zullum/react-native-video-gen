import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../config/firebase';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle user state changes
    const unsubscribe = auth().onAuthStateChanged((user) => {
      console.log(
        '[Auth] User state changed:',
        user ? 'User logged in' : 'User logged out'
      );
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[Auth] Attempting sign in for email:', email);
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      console.log(
        '[Auth] Sign in successful for user:',
        userCredential.user.uid
      );
    } catch (error) {
      console.error('[Auth] Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('[Auth] Attempting sign up for email:', email);
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      console.log(
        '[Auth] Sign up successful for user:',
        userCredential.user.uid
      );
    } catch (error) {
      console.error('[Auth] Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('[Auth] Attempting sign out');
      await auth().signOut();
      console.log('[Auth] Sign out successful');
    } catch (error) {
      console.error('[Auth] Sign out error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('[Auth] Attempting password reset for email:', email);
      await auth().sendPasswordResetEmail(email);
      console.log('[Auth] Password reset email sent successfully');
    } catch (error) {
      console.error('[Auth] Password reset error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
