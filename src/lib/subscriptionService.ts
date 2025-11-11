import { db } from '@/lib/firebaseConfig';
import { collection, doc, setDoc, getDoc, deleteDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';

export interface BookSubscriptionData {
  email: string;
  bookId: string;
  bookTitle: string;
  asmrModel: 'aria' | 'heartsease';
  deliveryType: 'unfinished' | 'whole';
  frequency: 'daily' | 'weekly';
  subscribedAt: string;
  lastSentAt?: string;
  id?: string;
}

// Save book subscription to Firestore
export async function saveBookSubscriptionToFirestore(data: Omit<BookSubscriptionData, 'id' | 'subscribedAt'>): Promise<string> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  const subscriptionId = `${data.email}-${data.bookId}`;
  const subscriptionRef = doc(db, 'book_subscriptions', subscriptionId);
  
  const subscriptionData: BookSubscriptionData = {
    ...data,
    id: subscriptionId,
    subscribedAt: new Date().toISOString(),
  };

  await setDoc(subscriptionRef, subscriptionData, { merge: true });
  return subscriptionId;
}

// Get all book subscriptions from Firestore
export async function getAllBookSubscriptionsFromFirestore(): Promise<BookSubscriptionData[]> {
  if (!db) {
    return [];
  }

  try {
    const subscriptionsRef = collection(db, 'book_subscriptions');
    const snapshot = await getDocs(subscriptionsRef);
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as BookSubscriptionData[];
  } catch (error) {
    console.error('Error fetching subscriptions from Firestore:', error);
    return [];
  }
}

// Get subscriptions by email
export async function getBookSubscriptionsByEmailFromFirestore(email: string): Promise<BookSubscriptionData[]> {
  if (!db) {
    return [];
  }

  try {
    const subscriptionsRef = collection(db, 'book_subscriptions');
    const q = query(subscriptionsRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as BookSubscriptionData[];
  } catch (error) {
    console.error('Error fetching subscriptions by email:', error);
    return [];
  }
}

// Get subscriptions by frequency (for cron job)
export async function getBookSubscriptionsByFrequencyFromFirestore(frequency: 'daily' | 'weekly'): Promise<BookSubscriptionData[]> {
  if (!db) {
    return [];
  }

  try {
    const subscriptionsRef = collection(db, 'book_subscriptions');
    const q = query(subscriptionsRef, where('frequency', '==', frequency));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as BookSubscriptionData[];
  } catch (error) {
    console.error('Error fetching subscriptions by frequency:', error);
    return [];
  }
}

// Remove book subscription from Firestore
export async function removeBookSubscriptionFromFirestore(email: string, bookId: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  const subscriptionId = `${email}-${bookId}`;
  const subscriptionRef = doc(db, 'book_subscriptions', subscriptionId);
  await deleteDoc(subscriptionRef);
}

// Update last sent timestamp
export async function updateSubscriptionLastSent(email: string, bookId: string): Promise<void> {
  if (!db) {
    return;
  }

  const subscriptionId = `${email}-${bookId}`;
  const subscriptionRef = doc(db, 'book_subscriptions', subscriptionId);
  await setDoc(subscriptionRef, {
    lastSentAt: new Date().toISOString(),
  }, { merge: true });
}

// Check if subscription exists
export async function isBookSubscribedInFirestore(email: string, bookId: string): Promise<boolean> {
  if (!db) {
    return false;
  }

  try {
    const subscriptionId = `${email}-${bookId}`;
    const subscriptionRef = doc(db, 'book_subscriptions', subscriptionId);
    const subscriptionDoc = await getDoc(subscriptionRef);
    return subscriptionDoc.exists();
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

