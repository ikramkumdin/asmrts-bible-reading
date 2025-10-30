import { db } from '@/lib/firebaseConfig';
import { collection, doc, setDoc, getDocs, getDoc, deleteDoc, query, where } from 'firebase/firestore';

export interface UserProgressRecord {
  bookId: string;
  chapterId: number;
  verseId: number | null;
  preset: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'error';
  progress: number;
  currentTime: number;
  totalDuration: number;
  lastPlayedAt: string;
}

export async function saveUserProgress(uid: string, record: UserProgressRecord): Promise<void> {
  if (!db) return;
  const key = `${record.bookId}-${record.chapterId}-${record.verseId ?? 'chapter'}-${record.preset}`;
  const ref = doc(db, 'users', uid, 'progress', key);
  await setDoc(ref, record, { merge: true });
}

export async function loadUserProgress(uid: string): Promise<UserProgressRecord[]> {
  if (!db) return [];
  const ref = collection(db, 'users', uid, 'progress');
  const snap = await getDocs(ref);
  return snap.docs.map(d => d.data() as UserProgressRecord);
}

export interface UserNoteRecord {
  id: string; // timestamp or uuid
  bookId: string;
  chapterId: number;
  text: string;
  createdAt: string;
}

export async function saveUserNote(uid: string, bookId: string, chapterId: number, noteId: string, text: string): Promise<void> {
  if (!db) return;
  const ref = doc(db, 'users', uid, 'notes', noteId);
  await setDoc(ref, {
    id: noteId,
    bookId,
    chapterId,
    text,
    createdAt: new Date().toISOString()
  }, { merge: true });
}

export async function deleteUserNote(uid: string, noteId: string): Promise<void> {
  if (!db) return;
  const ref = doc(db, 'users', uid, 'notes', noteId);
  await deleteDoc(ref);
}

export async function loadUserNotes(uid: string, bookId?: string, chapterId?: number): Promise<UserNoteRecord[]> {
  if (!db) return [];
  const ref = collection(db, 'users', uid, 'notes');
  let q = query(ref);
  
  if (bookId) {
    q = query(ref, where('bookId', '==', bookId));
  }
  if (chapterId !== undefined) {
    q = query(ref, where('bookId', '==', bookId), where('chapterId', '==', chapterId));
  }
  
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as UserNoteRecord).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}


