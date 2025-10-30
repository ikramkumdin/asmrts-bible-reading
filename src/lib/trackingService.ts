// Audio tracking service for monitoring listening progress
export interface AudioProgress {
  bookId: string;
  chapterId: number;
  verseId?: number;
  preset: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'error';
  progress: number; // 0-100 percentage
  lastPlayedAt: string;
  totalDuration: number; // in seconds
  currentTime: number; // in seconds
}

export interface BookProgress {
  bookId: string;
  totalChapters: number;
  completedChapters: number;
  inProgressChapters: number;
  overallProgress: number; // 0-100 percentage
  lastUpdated: string;
}

class TrackingService {
  private storageKey = 'asmrts_audio_progress';
  private bookProgressKey = 'asmrts_book_progress';

  // Get all progress data
  getProgress(): AudioProgress[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading progress:', error);
      return [];
    }
  }

  // Get progress for specific audio
  getAudioProgress(bookId: string, chapterId: number, verseId: number | undefined, preset: string): AudioProgress | null {
    const progress = this.getProgress();
    return progress.find(p => 
      p.bookId === bookId && 
      p.chapterId === chapterId && 
      p.verseId === verseId && 
      p.preset === preset
    ) || null;
  }

  // Update progress for specific audio
  updateProgress(
    bookId: string, 
    chapterId: number, 
    verseId: number | undefined, 
    preset: string, 
    updates: Partial<AudioProgress>
  ): void {
    const progress = this.getProgress();
    const existingIndex = progress.findIndex(p => 
      p.bookId === bookId && 
      p.chapterId === chapterId && 
      p.verseId === verseId && 
      p.preset === preset
    );

    const progressData: AudioProgress = {
      bookId,
      chapterId,
      verseId,
      preset,
      status: 'not-started',
      progress: 0,
      lastPlayedAt: new Date().toISOString(),
      totalDuration: 0,
      currentTime: 0,
      ...updates
    };

    if (existingIndex >= 0) {
      progress[existingIndex] = { ...progress[existingIndex], ...progressData };
    } else {
      progress.push(progressData);
    }

    this.saveProgress(progress);
    this.updateBookProgress(bookId);
  }

  // Mark audio as completed
  markCompleted(bookId: string, chapterId: number, verseId: number | undefined, preset: string): void {
    this.updateProgress(bookId, chapterId, verseId, preset, {
      status: 'completed',
      progress: 100,
      lastPlayedAt: new Date().toISOString()
    });
  }

  // Mark audio as in progress
  markInProgress(bookId: string, chapterId: number, verseId: number | undefined, preset: string): void {
    this.updateProgress(bookId, chapterId, verseId, preset, {
      status: 'in-progress',
      lastPlayedAt: new Date().toISOString()
    });
  }

  // Update playback progress
  updatePlaybackProgress(
    bookId: string, 
    chapterId: number, 
    verseId: number | undefined, 
    preset: string, 
    currentTime: number, 
    totalDuration: number
  ): void {
    const progress = Math.min(100, (currentTime / totalDuration) * 100);
    const existingProgress = this.getAudioProgress(bookId, chapterId, verseId, preset);
    
    // Only update progress, never automatically mark as completed
    // User must manually click "Mark as Complete" button
    const newStatus = existingProgress?.status === 'completed' 
      ? 'completed' 
      : 'in-progress';
    
    this.updateProgress(bookId, chapterId, verseId, preset, {
      currentTime,
      totalDuration,
      progress,
      status: newStatus
    });
  }

  // Get book progress
  getBookProgress(bookId: string): BookProgress | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(this.bookProgressKey);
      const bookProgress: BookProgress[] = stored ? JSON.parse(stored) : [];
      const progress = bookProgress.find(bp => bp.bookId === bookId);
      
      // If no progress exists, create one with correct total chapters
      if (!progress) {
        const bookChapterCounts: Record<string, number> = {
          'genesis': 50,
          'exodus': 40,
          'leviticus': 27,
          'numbers': 36,
          'deuteronomy': 34,
          'joshua': 24,
          'judges': 21,
          'ruth': 4,
          '1-samuel': 31,
          '2-samuel': 24,
          '1-kings': 22,
          '2-kings': 25,
          '1-chronicles': 29,
          '2-chronicles': 36,
          'ezra': 10,
          'nehemiah': 13,
          'esther': 10,
          'job': 42,
          'psalms': 150,
          'proverbs': 31,
          'ecclesiastes': 12,
          'song-of-solomon': 8,
          'isaiah': 66,
          'jeremiah': 52,
          'lamentations': 5,
          'ezekiel': 48,
          'daniel': 12,
          'hosea': 14,
          'joel': 3,
          'amos': 9,
          'obadiah': 1,
          'jonah': 4,
          'micah': 7,
          'nahum': 3,
          'habakkuk': 3,
          'zephaniah': 3,
          'haggai': 2,
          'zechariah': 14,
          'malachi': 4,
          'matthew': 28,
          'mark': 16,
          'luke': 24,
          'john': 21,
          'acts': 28,
          'romans': 16,
          '1-corinthians': 16,
          '2-corinthians': 13,
          'galatians': 6,
          'ephesians': 6,
          'philippians': 4,
          'colossians': 4,
          '1-thessalonians': 5,
          '2-thessalonians': 3,
          '1-timothy': 6,
          '2-timothy': 4,
          'titus': 3,
          'philemon': 1,
          'hebrews': 13,
          'james': 5,
          '1-peter': 5,
          '2-peter': 3,
          '1-john': 5,
          '2-john': 1,
          '3-john': 1,
          'jude': 1,
          'revelation': 22
        };
        
        const totalChapters = bookChapterCounts[bookId] || 1;
        return {
          bookId,
          totalChapters,
          completedChapters: 0,
          inProgressChapters: 0,
          overallProgress: 0,
          lastUpdated: new Date().toISOString()
        };
      }
      
      return progress;
    } catch (error) {
      console.error('Error loading book progress:', error);
      return null;
    }
  }

  // Update book progress
  private updateBookProgress(bookId: string): void {
    const progress = this.getProgress();
    const bookProgress = progress.filter(p => p.bookId === bookId);
    
    // Get the actual total chapters for this book from the book data
    // For now, we'll use a mapping of known book chapter counts
    const bookChapterCounts: Record<string, number> = {
      'genesis': 50,
      'exodus': 40,
      'leviticus': 27,
      'numbers': 36,
      'deuteronomy': 34,
      'joshua': 24,
      'judges': 21,
      'ruth': 4,
      '1-samuel': 31,
      '2-samuel': 24,
      '1-kings': 22,
      '2-kings': 25,
      '1-chronicles': 29,
      '2-chronicles': 36,
      'ezra': 10,
      'nehemiah': 13,
      'esther': 10,
      'job': 42,
      'psalms': 150,
      'proverbs': 31,
      'ecclesiastes': 12,
      'song-of-solomon': 8,
      'isaiah': 66,
      'jeremiah': 52,
      'lamentations': 5,
      'ezekiel': 48,
      'daniel': 12,
      'hosea': 14,
      'joel': 3,
      'amos': 9,
      'obadiah': 1,
      'jonah': 4,
      'micah': 7,
      'nahum': 3,
      'habakkuk': 3,
      'zephaniah': 3,
      'haggai': 2,
      'zechariah': 14,
      'malachi': 4,
      'matthew': 28,
      'mark': 16,
      'luke': 24,
      'john': 21,
      'acts': 28,
      'romans': 16,
      '1-corinthians': 16,
      '2-corinthians': 13,
      'galatians': 6,
      'ephesians': 6,
      'philippians': 4,
      'colossians': 4,
      '1-thessalonians': 5,
      '2-thessalonians': 3,
      '1-timothy': 6,
      '2-timothy': 4,
      'titus': 3,
      'philemon': 1,
      'hebrews': 13,
      'james': 5,
      '1-peter': 5,
      '2-peter': 3,
      '1-john': 5,
      '2-john': 1,
      '3-john': 1,
      'jude': 1,
      'revelation': 22
    };
    
    const totalChapters = bookChapterCounts[bookId] || 1;
    const completedChapters = bookProgress.filter(p => p.status === 'completed' && p.verseId === undefined).length;
    const inProgressChapters = bookProgress.filter(p => p.status === 'in-progress' && p.verseId === undefined).length;
    const overallProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

    const bookProgressData: BookProgress = {
      bookId,
      totalChapters,
      completedChapters,
      inProgressChapters,
      overallProgress,
      lastUpdated: new Date().toISOString()
    };

    this.saveBookProgress(bookProgressData);
  }

  // Save book progress
  private saveBookProgress(bookProgress: BookProgress): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.bookProgressKey);
      const bookProgressList: BookProgress[] = stored ? JSON.parse(stored) : [];
      const existingIndex = bookProgressList.findIndex(bp => bp.bookId === bookProgress.bookId);
      
      if (existingIndex >= 0) {
        bookProgressList[existingIndex] = bookProgress;
      } else {
        bookProgressList.push(bookProgress);
      }
      
      localStorage.setItem(this.bookProgressKey, JSON.stringify(bookProgressList));
    } catch (error) {
      console.error('Error saving book progress:', error);
    }
  }

  // Save progress
  private saveProgress(progress: AudioProgress[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  // Clear all progress
  clearProgress(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.bookProgressKey);
  }

  // Reset book progress with correct total chapters
  resetBookProgress(bookId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.bookProgressKey);
      const bookProgress: BookProgress[] = stored ? JSON.parse(stored) : [];
      const filteredProgress = bookProgress.filter(bp => bp.bookId !== bookId);
      localStorage.setItem(this.bookProgressKey, JSON.stringify(filteredProgress));
    } catch (error) {
      console.error('Error resetting book progress:', error);
    }
  }

  // Get completion status for UI
  getCompletionStatus(bookId: string, chapterId: number, preset: string): {
    status: 'not-started' | 'in-progress' | 'completed' | 'error';
    progress: number;
  } {
    const chapterProgress = this.getAudioProgress(bookId, chapterId, undefined, preset);
    
    if (!chapterProgress) {
      return { status: 'not-started', progress: 0 };
    }

    return {
      status: chapterProgress.status,
      progress: chapterProgress.progress
    };
  }

  // Check if audio is available based on file structure
  isAudioAvailable(bookId: string, chapterId: number, preset: string): boolean {
    // Genesis chapters 1-50 are now available for both presets (aria and heartsease) in GCP bucket
    if (bookId === 'genesis' && chapterId >= 1 && chapterId <= 50) {
      console.log(`Audio check: ${bookId} Chapter ${chapterId} with ${preset} = Available`);
      return true;
    }
    
    // Fallback: mark others as unavailable for now
    const hasAudio = false;
    
    console.log(`Audio check: ${bookId} Chapter ${chapterId} with ${preset} = ${hasAudio ? 'Available' : 'Not Available'}`);
    
    return hasAudio;
  }
}

export const trackingService = new TrackingService();
