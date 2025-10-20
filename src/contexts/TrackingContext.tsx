'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { trackingService, type AudioProgress, type BookProgress } from '@/lib/trackingService';
import { useAuth } from '@/contexts/AuthContext';
import { saveUserProgress, loadUserProgress } from '@/lib/userData';

interface TrackingContextType {
  // Progress tracking
  getProgress: () => AudioProgress[];
  getAudioProgress: (bookId: string, chapterId: number, verseId: number | undefined, preset: string) => AudioProgress | null;
  updateProgress: (bookId: string, chapterId: number, verseId: number | undefined, preset: string, updates: Partial<AudioProgress>) => void;
  markCompleted: (bookId: string, chapterId: number, verseId: number | undefined, preset: string) => void;
  markInProgress: (bookId: string, chapterId: number, verseId: number | undefined, preset: string) => void;
  updatePlaybackProgress: (bookId: string, chapterId: number, verseId: number | undefined, preset: string, currentTime: number, totalDuration: number) => void;
  
  // Book progress
  getBookProgress: (bookId: string) => BookProgress | null;
  
  // Status helpers
  getCompletionStatus: (bookId: string, chapterId: number, preset: string) => { status: 'not-started' | 'in-progress' | 'completed' | 'error'; progress: number };
  isAudioAvailable: (bookId: string, chapterId: number, preset: string) => boolean;
  
  // Utility
  clearProgress: () => void;
  resetBookProgress: (bookId: string) => void;
  
  // State for real-time updates
  progressUpdated: boolean;
  triggerProgressUpdate: () => void;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

interface TrackingProviderProps {
  children: ReactNode;
}

export function TrackingProvider({ children }: TrackingProviderProps) {
  const [progressUpdated, setProgressUpdated] = useState(false);
  const { user } = useAuth();

  const triggerProgressUpdate = () => {
    setProgressUpdated(prev => !prev);
  };

  // Load Firestore progress into local tracking on sign-in
  useEffect(() => {
    const syncFromFirestore = async () => {
      if (!user) return;
      try {
        const records = await loadUserProgress(user.uid);
        for (const r of records) {
          trackingService.updateProgress(r.bookId, r.chapterId, r.verseId ?? undefined, r.preset, {
            status: r.status,
            progress: r.progress,
            currentTime: r.currentTime,
            totalDuration: r.totalDuration,
            lastPlayedAt: r.lastPlayedAt
          });
        }
        triggerProgressUpdate();
      } catch (e) {
        console.warn('Failed to load user progress from Firestore:', e);
      }
    };
    syncFromFirestore();
  }, [user?.uid]);

  const contextValue: TrackingContextType = {
    // Progress tracking
    getProgress: trackingService.getProgress.bind(trackingService),
    getAudioProgress: trackingService.getAudioProgress.bind(trackingService),
    updateProgress: (bookId, chapterId, verseId, preset, updates) => {
      trackingService.updateProgress(bookId, chapterId, verseId, preset, updates);
      triggerProgressUpdate();
    },
    markCompleted: (bookId, chapterId, verseId, preset) => {
      trackingService.markCompleted(bookId, chapterId, verseId, preset);
      if (user) {
        const progress = trackingService.getAudioProgress(bookId, chapterId, verseId, preset);
        if (progress) {
          saveUserProgress(user.uid, {
            bookId,
            chapterId,
            verseId: verseId ?? null,
            preset,
            status: progress.status,
            progress: progress.progress,
            currentTime: progress.currentTime,
            totalDuration: progress.totalDuration,
            lastPlayedAt: progress.lastPlayedAt
          }).catch(() => {});
        }
      }
      triggerProgressUpdate();
    },
    markInProgress: (bookId, chapterId, verseId, preset) => {
      trackingService.markInProgress(bookId, chapterId, verseId, preset);
      if (user) {
        const progress = trackingService.getAudioProgress(bookId, chapterId, verseId, preset);
        if (progress) {
          saveUserProgress(user.uid, {
            bookId,
            chapterId,
            verseId: verseId ?? null,
            preset,
            status: progress.status,
            progress: progress.progress,
            currentTime: progress.currentTime,
            totalDuration: progress.totalDuration,
            lastPlayedAt: progress.lastPlayedAt
          }).catch(() => {});
        }
      }
      triggerProgressUpdate();
    },
    updatePlaybackProgress: (bookId, chapterId, verseId, preset, currentTime, totalDuration) => {
      trackingService.updatePlaybackProgress(bookId, chapterId, verseId, preset, currentTime, totalDuration);
      if (user) {
        const progress = trackingService.getAudioProgress(bookId, chapterId, verseId, preset);
        if (progress) {
          saveUserProgress(user.uid, {
            bookId,
            chapterId,
            verseId: verseId ?? null,
            preset,
            status: progress.status,
            progress: progress.progress,
            currentTime: progress.currentTime,
            totalDuration: progress.totalDuration,
            lastPlayedAt: progress.lastPlayedAt
          }).catch(() => {});
        }
      }
      triggerProgressUpdate();
    },
    
    // Book progress
    getBookProgress: trackingService.getBookProgress.bind(trackingService),
    
    // Status helpers
    getCompletionStatus: trackingService.getCompletionStatus.bind(trackingService),
    isAudioAvailable: trackingService.isAudioAvailable.bind(trackingService),
    
    // Utility
    clearProgress: () => {
      trackingService.clearProgress();
      triggerProgressUpdate();
    },
    resetBookProgress: (bookId: string) => {
      trackingService.resetBookProgress(bookId);
      triggerProgressUpdate();
    },
    
    // State for real-time updates
    progressUpdated,
    triggerProgressUpdate
  };

  return (
    <TrackingContext.Provider value={contextValue}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
}
