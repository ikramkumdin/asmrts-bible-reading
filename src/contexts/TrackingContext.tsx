'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { trackingService, type AudioProgress, type BookProgress } from '@/lib/trackingService';

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

  const triggerProgressUpdate = () => {
    setProgressUpdated(prev => !prev);
  };

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
      triggerProgressUpdate();
    },
    markInProgress: (bookId, chapterId, verseId, preset) => {
      trackingService.markInProgress(bookId, chapterId, verseId, preset);
      triggerProgressUpdate();
    },
    updatePlaybackProgress: (bookId, chapterId, verseId, preset, currentTime, totalDuration) => {
      trackingService.updatePlaybackProgress(bookId, chapterId, verseId, preset, currentTime, totalDuration);
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
