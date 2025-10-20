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
  text: string;
  createdAt: string;
}

export async function saveUserNote(uid: string, bookId: string, noteId: string, text: string): Promise<void> {
  if (!db) return;
  const ref = doc(db, 'users', uid, 'books', bookId, 'notes', noteId);
  await setDoc(ref, {
    id: noteId,
    bookId,
    text,
    createdAt: new Date().toISOString()
  }, { merge: true });
}

export async function deleteUserNote(uid: string, bookId: string, noteId: string): Promise<void> {
  if (!db) return;
  const ref = doc(db, 'users', uid, 'books', bookId, 'notes', noteId);
  await deleteDoc(ref);
}

export async function loadUserNotes(uid: string, bookId: string): Promise<UserNoteRecord[]> {
  if (!db) return [];
  const ref = collection(db, 'users', uid, 'books', bookId, 'notes');
  const snap = await getDocs(ref);
  return snap.docs.map(d => d.data() as UserNoteRecord);
}


