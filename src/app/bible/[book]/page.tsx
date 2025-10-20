'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { getBookById, getAllBooks, type BibleBook } from '@/lib/bibleData';
import { type VoicePreset } from '@/lib/audioUtils';
import { getAudioBaseUrl } from '@/lib/audioConfig';
import { useTracking } from '@/contexts/TrackingContext';
import { useToastContext } from '@/components/ToastProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getAudioDuration, type AudioDuration } from '@/lib/audioDuration';
import { trackAudioPlay, trackAudioComplete, trackChapterComplete, trackBookSelect, trackPresetSelect } from '@/lib/firebaseConfig';
import { useAuth } from '@/contexts/AuthContext';
import { saveUserNote, deleteUserNote, loadUserNotes } from '@/lib/userData';
import SimplePlayButton from '@/components/SimplePlayButton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BibleStudyPageProps {
  params: Promise<{
    book: string;
  }>;
}

export default function BibleStudyPage({ params }: BibleStudyPageProps) {
  const [book, setBook] = useState<BibleBook | null>(null);
  const [selectedReader, setSelectedReader] = useState<VoicePreset>('aria');
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  const [playingChapter, setPlayingChapter] = useState<string | null>(null);
  const [playingVerse, setPlayingVerse] = useState<string | null>(null);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());
  const [audioLoading, setAudioLoading] = useState(false);
  const [chapterFilter, setChapterFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [audioFinishedChapters, setAudioFinishedChapters] = useState<Set<string>>(new Set());
  const [exactDurations, setExactDurations] = useState<Map<string, string>>(new Map());

  // Tracking and toast hooks
  const { 
    getCompletionStatus, 
    markInProgress, 
    markCompleted, 
    updatePlaybackProgress,
    progressUpdated,
    getBookProgress,
    resetBookProgress
  } = useTracking();
  const { showSuccess, showError, showWarning, showInfo } = useToastContext();
  const { user } = useAuth();

  // Load saved notes from Firestore on book/user change; fallback to localStorage if not signed in
  useEffect(() => {
    const loadNotes = async () => {
      if (!book) return;
      if (user) {
        const notes = await loadUserNotes(user.uid, book.id);
        const mapped: Record<string, string> = {};
        notes.forEach(n => { mapped[n.id] = n.text; });
        setSavedNotes(mapped);
      } else if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`asmrts_notes_${book.id}`);
        if (saved) setSavedNotes(JSON.parse(saved));
      }
    };
    loadNotes();
  }, [book?.id, user?.uid]);

  // Force re-render when progress updates
  useEffect(() => {
    // This will trigger a re-render when progress is updated
  }, [progressUpdated]);

  // Load exact durations when book or preset changes
  useEffect(() => {
    if (book && selectedReader) {
      loadExactDurations(book.id, selectedReader);
    }
  }, [book?.id, selectedReader]);


  // Handle async params
  useEffect(() => {
    setIsLoading(true);
    params.then(({ book: bookName }) => {
      const bookData = getBookById(bookName);
      setBook(bookData || null);
      
      // Track book selection
      if (bookData) {
        trackBookSelect(bookData.id, bookData.title);
      }
      
      // Find current book index for navigation
      const allBooks = getAllBooks();
      const index = allBooks.findIndex(b => b.id === bookName);
      setCurrentBookIndex(index >= 0 ? index : 0);
      setIsLoading(false);
    });
  }, [params]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Stop audio when preset changes
  useEffect(() => {
    if (currentAudio) {
      console.log(`🎵 Preset changed to ${selectedReader}, stopping current audio`);
      stopAudio();
    }
  }, [selectedReader]);

  // Navigation functions
  const navigateToBook = (direction: 'prev' | 'next') => {
    const allBooks = getAllBooks();
    let newIndex = currentBookIndex;
    
    if (direction === 'prev' && currentBookIndex > 0) {
      newIndex = currentBookIndex - 1;
    } else if (direction === 'next' && currentBookIndex < allBooks.length - 1) {
      newIndex = currentBookIndex + 1;
    }
    
    if (newIndex !== currentBookIndex) {
      const newBook = allBooks[newIndex];
      // Use router.push for better navigation without full page reload
      window.location.href = `/bible/${newBook.id}`;
    }
  };

  // Stop current audio
  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setPlayingChapter(null);
      setPlayingVerse(null);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  };

  // Function to get the correct audio path based on preset and audio type
  const getAudioPath = (preset: VoicePreset, bookId: string, chapterId: number, audioType: 'chapter' | 'verse', verseNumber?: number) => {
    const baseUrl = getAudioBaseUrl();
    
    if (audioType === 'chapter') {
      return `${baseUrl}/audio/${preset}/${bookId}/chapter${chapterId}/chapter${chapterId}.mp3`;
    } else {
      return `${baseUrl}/audio/${preset}/${bookId}/chapter${chapterId}/${verseNumber}.mp3`;
    }
  };

  // Ensure the URL exists before attempting to play; if verse is missing, fall back to chapter audio
  const ensureAndPlay = async (
    preset: VoicePreset,
    bookId: string,
    chapterId: number,
    type: 'chapter' | 'verse',
    verseNumber?: number
  ) => {
    const primaryPath = getAudioPath(preset, bookId, chapterId, type, verseNumber);
    try {
      const headResp = await fetch(primaryPath, { method: 'HEAD' });
      if (headResp.ok) {
        const key = type === 'chapter' ? `${bookId}-${chapterId}` : `${bookId}-${chapterId}-${verseNumber}`;
        playAudio(primaryPath, key);
        return;
      }
    } catch (_) {
      // ignore and try fallback below
    }

    if (type === 'verse') {
      const chapterPath = getAudioPath(preset, bookId, chapterId, 'chapter');
      try {
        const headChapter = await fetch(chapterPath, { method: 'HEAD' });
        if (headChapter.ok) {
          playAudio(chapterPath, `${bookId}-${chapterId}`);
          showInfo('Verse audio unavailable', 'Playing full chapter audio instead.');
          return;
        }
      } catch (_) {
        // fall through to warning
      }
    }

    showWarning('Audio Not Available', `Audio for ${bookId} Chapter ${chapterId}${type === 'verse' && verseNumber ? ` Verse ${verseNumber}` : ''} is not available yet.`);
  };

  // Audio playback functions
  const playAudio = (audioPath: string, audioKey: string) => {
    
    // Check if audio is available
    const [bookId, chapterId, verseId] = audioKey.split('-');
    const isAvailable = bookId === 'genesis' && parseInt(chapterId) >= 1 && parseInt(chapterId) <= 24;
    
    if (!isAvailable) {
      showWarning(
        'Audio Not Available',
        `Audio for ${bookId} Chapter ${chapterId}${verseId ? ` Verse ${verseId}` : ''} is not available yet.`
      );
      return;
    }
    
    // Check if this is the same audio that's currently loaded
    const isSameAudio = (playingChapter === audioKey || playingVerse === audioKey);
    
    if (currentAudio && isSameAudio) {
      // Same audio - toggle play/pause
      if (isPlaying) {
        console.log('Pausing current audio');
        currentAudio.pause();
        setIsPlaying(false);
      } else {
        console.log('Resuming current audio');
        currentAudio.play();
        setIsPlaying(true);
      }
      return;
    }
    
    // Different audio or no current audio - stop current and start new
    if (currentAudio) {
      console.log('Stopping current audio and starting new one');
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Set loading state
    setAudioLoading(true);

    // Create new audio element with proper CORS for cross-origin streaming
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = audioPath;
    audio.volume = 0.8; // Set volume to 80%
    audio.preload = 'metadata'; // Preload metadata for faster start
    setCurrentAudio(audio);
    
    // Set playing states
    if (audioKey.includes('chapter')) {
      console.log('🎵 Setting playingChapter to:', audioKey);
      setPlayingChapter(audioKey);
      setPlayingVerse(null);
      // Mark chapter as in progress
      markInProgress(bookId, parseInt(chapterId), undefined, selectedReader);
      
      // Track audio play event
      trackAudioPlay(bookId, parseInt(chapterId), selectedReader, 'chapter');
    } else {
      console.log('🎵 Setting playingVerse to:', audioKey);
      setPlayingVerse(audioKey);
      setPlayingChapter(null);
      // Mark verse as in progress
      markInProgress(bookId, parseInt(chapterId), parseInt(verseId), selectedReader);
      
      // Track audio play event
      trackAudioPlay(bookId, parseInt(chapterId), selectedReader, 'verse', parseInt(verseId));
    }
    
    // Note: isPlaying will be set to true when audio.play() promise resolves

    // Add load event listener
    audio.onloadeddata = () => {
      console.log('Audio loaded successfully:', audioPath);
      console.log('Audio duration:', audio.duration, 'seconds');
      console.log('Audio src:', audio.src);
      setAudioLoading(false);
    };

    // Add canplay event listener
    audio.oncanplay = () => {
      console.log('Audio can play:', audioPath);
      setAudioLoading(false);
    };

    // Add play event listener
    audio.onplay = () => {
      console.log('🎵 Audio onplay event fired for:', audioKey);
      setIsPlaying(true);
      if (audioKey.includes('chapter')) {
        console.log('🎵 Setting playingChapter to:', audioKey);
        setPlayingChapter(audioKey);
      }
      console.log('🎵 After onplay - isPlaying should be true, playingChapter:', audioKey);
    };

    // Add time update listener for progress
    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      // Update tracking progress
      const [bookId, chapterId, verseId] = audioKey.split('-');
      updatePlaybackProgress(
        bookId, 
        parseInt(chapterId), 
        verseId ? parseInt(verseId) : undefined, 
        selectedReader, 
        audio.currentTime, 
        audio.duration
      );
    };

    // Add loaded metadata listener
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };

    // Play audio
    audio.play().then(() => {
      console.log('🎵 Audio.play() promise resolved - setting isPlaying to TRUE');
      setIsPlaying(true);
      setAudioLoading(false);
    }).catch(error => {
      console.error('Error playing audio:', error);
      console.error('Audio path attempted:', audioPath);
      setIsPlaying(false);
      setAudioLoading(false);
      
      // Fallback for quirky browsers: fetch as blob and play via Object URL
      const tryBlobFallback = async () => {
        try {
          setAudioLoading(true);
          const response = await fetch(audioPath, { mode: 'cors', credentials: 'omit' });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          audio.src = objectUrl;
          await audio.play();
          setIsPlaying(true);
          setAudioLoading(false);
        } catch (fallbackErr) {
          console.error('Blob fallback failed:', fallbackErr);
          // Show user-friendly error message
          if ((error as Error).name === 'NotAllowedError') {
            alert('Please click the play button to start audio playback.');
          } else if ((error as Error).name === 'NotSupportedError') {
            alert('Audio format not supported. Please try a different browser.');
          } else if ((error as Error).name === 'AbortError') {
            alert('Audio loading was interrupted. Please try again.');
          } else {
            alert('Audio could not be played. Please check your internet connection and try again.');
          }
        }
      };

      // Only attempt blob fallback for format/support errors
      if ((error as Error).name === 'NotSupportedError') {
        tryBlobFallback();
      } else if ((error as Error).name === 'NotAllowedError') {
        alert('Please click the play button to start audio playback.');
      } else if ((error as Error).name === 'AbortError') {
        alert('Audio loading was interrupted. Please try again.');
      } else {
        alert('Audio could not be played. Please check your internet connection and try again.');
      }
    });

    // Handle audio end
    audio.onended = () => {
      setIsPlaying(false);
      setPlayingChapter(null);
      setPlayingVerse(null);
      setCurrentAudio(null);
      setCurrentTime(0);
      setDuration(0);
      
      // Track that audio has finished for this chapter
      const parts = audioKey.split('-');
      const bookId = parts[0];
      const chapterId = parts[1];
      const verseId = parts[2]; // This will be undefined for chapter audio
      
      // Check if this is a full chapter audio (not a verse)
      // For chapter audio like "genesis-2", there are only 2 parts
      // For verse audio like "genesis-2-5", there are 3 parts
      if (parts.length === 2) {
        const chapterKey = audioKey;
        console.log('🎵 Audio finished for chapter:', chapterKey, 'verseId:', verseId);
        setAudioFinishedChapters(prev => {
          const newSet = new Set([...prev, chapterKey]);
          console.log('🎵 Updated audioFinishedChapters:', Array.from(newSet));
          return newSet;
        });
        
        // Show audio finished message
        showInfo(
          'Audio Finished!',
          `You've finished listening to ${bookId} Chapter ${chapterId}. Click "Mark as Complete" below if you want to mark it as complete.`
        );
      } else if (parts.length === 3) {
        showSuccess(
          'Verse Completed!',
          `You've completed ${bookId} Chapter ${chapterId}, Verse ${verseId}.`
        );
      }
    };

    // Handle audio error
    audio.onerror = (error) => {
      console.error('Audio playback error:', error);
      console.error('Failed to load audio file:', audioPath);
      setIsPlaying(false);
      setPlayingChapter(null);
      setPlayingVerse(null);
      setCurrentAudio(null);
    };
  };


  const readers = [
    { id: 'aria', name: 'Aria', avatar: '/presets/Preset3.jpg' },
    { id: 'heartsease', name: 'Heartsease', avatar: '/presets/Preset4.jpg' }
  ];

  // Save note function
  const saveNote = () => {
    if (note.trim() && book) {
      const id = Date.now().toString();
      const text = note.trim();
      const newNotes = { ...savedNotes, [id]: text };
      setSavedNotes(newNotes);
      if (user) {
        saveUserNote(user.uid, book.id, id, text).catch(() => {});
      } else if (typeof window !== 'undefined') {
        localStorage.setItem(`asmrts_notes_${book.id}`, JSON.stringify(newNotes));
      }
      setNote('');
      showSuccess('Note Saved!', 'Your note has been saved successfully.');
    }
  };

  // Clear note function
  const clearNote = () => {
    setNote('');
  };

  // Load exact durations for available chapters
  const loadExactDurations = async (bookId: string, preset: string) => {
    // Only load if book has audio
    if (!(bookId === 'genesis')) return;
    
    const durations = new Map<string, string>();
    
    // Load durations for Genesis chapters 1-24 (available in GCP)
    for (let chapterId = 1; chapterId <= 24; chapterId++) {
      if (bookId === 'genesis') {
        try {
          const duration = await getAudioDuration(bookId, chapterId, preset);
          if (duration) {
            durations.set(`${bookId}-${chapterId}`, duration.formatted);
            console.log(`Loaded duration for ${bookId} Chapter ${chapterId}: ${duration.formatted}`);
          }
        } catch (error) {
          console.warn(`Failed to load duration for ${bookId} Chapter ${chapterId}:`, error);
        }
      }
    }
    
    setExactDurations(durations);
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900">Loading...</h1>
          <p className="text-gray-600">Loading Bible book</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h1>
          <p className="text-gray-600">The requested Bible book could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
        <Header />
      
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Row - Navigation and Title */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigateToBook('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentBookIndex === 0}
                title="Previous book"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => navigateToBook('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentBookIndex === getAllBooks().length - 1}
                title="Next book"
              >
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
                {book.title}
              </h1>
              <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                Studying
              </span>
            </div>
            
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
          
          {/* Tab Menu */}
          <div className="flex">
            <button 
              onClick={() => setChapterFilter('all')}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                chapterFilter === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setChapterFilter('in-progress')}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                chapterFilter === 'in-progress'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              In Progress
            </button>
            <button 
              onClick={() => setChapterFilter('completed')}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                chapterFilter === 'completed'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Complete
            </button>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-8 bg-white">
        <div className="max-w-6xl mx-auto">

          {/* Progress Summary */}
          {book && (() => {
            const bookProgress = getBookProgress(book.id);
            if (bookProgress && bookProgress.overallProgress > 0) {
              return (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Reading Progress</h3>
                    <span className="text-sm text-gray-600">
                      {bookProgress.completedChapters} of {bookProgress.totalChapters} chapters completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${bookProgress.overallProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{Math.round(bookProgress.overallProgress)}% Complete</span>
                    {bookProgress.inProgressChapters > 0 && (
                      <span>{bookProgress.inProgressChapters} in progress</span>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* Reader Selection - Full Width */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900 whitespace-nowrap">Choose your favorite:</h3>
              <div className="flex gap-3 flex-1">
                {readers.map((reader) => (
                  <button
                    key={reader.id}
                    onClick={() => {
                      setSelectedReader(reader.id as VoicePreset);
                      // Track preset selection
                      trackPresetSelect(reader.id);
                    }}
                    className={`p-2 rounded-lg border-2 transition-all flex-1 flex items-center gap-2 ${
                      selectedReader === reader.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src={reader.avatar} 
                        alt={reader.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-900">{reader.name}</div>
                  </button>
                ))}
              </div>
            </div>
              </div>

          {/* Filter Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            {(() => {
              const filteredChapters = book.chapterList.filter((chapter) => {
                if (chapterFilter === 'all') return true;
                const trackingStatus = getCompletionStatus(book.id, chapter.id, selectedReader);
                if (chapterFilter === 'completed') return trackingStatus.status === 'completed';
                if (chapterFilter === 'in-progress') return trackingStatus.status === 'in-progress';
                return true;
              });
              return `Showing ${filteredChapters.length} of ${book.chapterList.length} chapters`;
            })()}
          </div>

          {/* Chapter Cards - Full Width */}
          <div className="space-y-4">
          {book.chapterList
            .filter((chapter) => {
              if (chapterFilter === 'all') return true;
              const trackingStatus = getCompletionStatus(book.id, chapter.id, selectedReader);
              if (chapterFilter === 'completed') return trackingStatus.status === 'completed';
              if (chapterFilter === 'in-progress') return trackingStatus.status === 'in-progress';
              return true;
            })
            .map((chapter) => (
            <div key={chapter.id} className="bg-gradient-to-r from-white to-purple-50 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Collapsed Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
                onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-md ${
                      (() => {
                        const trackingStatus = getCompletionStatus(book.id, chapter.id, selectedReader);
                        if (trackingStatus.status === 'completed') return 'bg-gradient-to-br from-green-400 to-green-600 text-white';
                        if (trackingStatus.status === 'in-progress') return 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white';
                        if (chapter.status === 'error') return 'bg-gradient-to-br from-red-400 to-red-600 text-white';
                        return 'bg-gradient-to-br from-blue-400 to-purple-600 text-white';
                      })()
                    }`}>
                      {(() => {
                        const trackingStatus = getCompletionStatus(book.id, chapter.id, selectedReader);
                        if (trackingStatus.status === 'completed') return '✓';
                        if (trackingStatus.status === 'in-progress') return '⏳';
                        if (chapter.status === 'error') return '✗';
                        return chapter.id;
                      })()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {chapter.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {(book.id === 'genesis' && chapter.id >= 1 && chapter.id <= 24) && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {exactDurations.get(`${book.id}-${chapter.id}`) || chapter.duration}
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (() => {
                            const trackingStatus = getCompletionStatus(book.id, chapter.id, selectedReader);
                            const hasAudio = (book.id === 'genesis' && chapter.id >= 1 && chapter.id <= 24);
                            
                            if (trackingStatus.status === 'completed') return 'bg-green-100 text-green-800';
                            if (trackingStatus.status === 'in-progress') return 'bg-yellow-100 text-yellow-800';
                            if (chapter.status === 'error') return 'bg-red-100 text-red-800';
                            if (!hasAudio) return 'bg-gray-100 text-gray-600';
                            return 'bg-blue-100 text-blue-800';
                          })()
                        }`}>
                          {(() => {
                            const trackingStatus = getCompletionStatus(book.id, chapter.id, selectedReader);
                            const hasAudio = (book.id === 'genesis' && chapter.id >= 1 && chapter.id <= 24);
                            
                            if (trackingStatus.status === 'completed') return '✓ Completed';
                            if (trackingStatus.status === 'in-progress') return '⏳ In Progress';
                            if (chapter.status === 'error') return '✗ Error';
                            if (!hasAudio) return '🔇 No Audio';
                            return 'Available';
                          })()}
                        </span>
                      </div>
                      
                      {/* Progress Bar - Show when this chapter is playing or has progress */}
                      {(() => {
                        const trackingStatus = getCompletionStatus(book.id, chapter.id, selectedReader);
                        const isPlaying = (playingChapter === `${book.id}-${chapter.id}` || playingVerse?.startsWith(`${book.id}-${chapter.id}`)) && duration > 0;
                        const hasProgress = trackingStatus.progress > 0;
                        
                        if (isPlaying || hasProgress) {
                          return (
                            <div className="mt-3">
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                <span>
                                  {isPlaying 
                                    ? `${Math.floor(currentTime / 60)}:${(currentTime % 60).toFixed(0).padStart(2, '0')}`
                                    : `${Math.floor(trackingStatus.progress)}%`
                                  }
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-1">
                                  <div 
                                    className={`h-1 rounded-full transition-all duration-100 ${
                                      trackingStatus.status === 'completed' 
                                        ? 'bg-green-500' 
                                        : 'bg-purple-500'
                                    }`}
                                    style={{ 
                                      width: `${isPlaying 
                                        ? (currentTime / duration) * 100 
                                        : trackingStatus.progress
                                      }%` 
                                    }}
                                  ></div>
                                </div>
                                <span>
                                  {isPlaying 
                                    ? `${Math.floor(duration / 60)}:${(duration % 60).toFixed(0).padStart(2, '0')}`
                                    : '100%'
                                  }
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    </div>
                    <div className="flex items-center gap-2">
                    <div onClick={(e) => e.stopPropagation()}>
                      {(() => {
                        const chapterKey = `${book.id}-${chapter.id}`;
                        const isThisChapterPlaying = playingChapter === chapterKey && isPlaying;
                        console.log(`🎯 MAIN Chapter ${chapter.id} button:`, {
                          chapterKey,
                          playingChapter,
                          isPlaying,
                          isThisChapterPlaying,
                          'playingChapter === chapterKey': playingChapter === chapterKey
                        });
                        return null;
                      })()}
                      <SimplePlayButton
                        key={`main-chapter-${book.id}-${chapter.id}-${playingChapter}-${isPlaying}`}
                        isPlaying={playingChapter === `${book.id}-${chapter.id}` && isPlaying}
                        onPlay={() => {
                          const chapterKey = `${book.id}-${chapter.id}`;
                          
                          if (!(book.id === 'genesis' && chapter.id >= 1 && chapter.id <= 24)) {
                            showWarning(
                              'Audio Not Available',
                              `Audio for ${book.id} Chapter ${chapter.id} is not available yet.`
                            );
                            return;
                          }
                          
                          ensureAndPlay(selectedReader, book.id, chapter.id, 'chapter');
                        }}
                        onPause={() => {
                          const chapterKey = `${book.id}-${chapter.id}`;
                          stopAudio();
                        }}
                        className={`${
                          !(book.id === 'genesis' && chapter.id >= 1 && chapter.id <= 24)
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      />
                    </div>
                    <div className={`transform transition-transform duration-300 ${
                      expandedChapter === chapter.id ? 'rotate-180' : ''
                    }`}>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedChapter === chapter.id && (
                <div className="border-t border-purple-100 bg-gradient-to-b from-white to-purple-25">
                  {/* Full Chapter Audio Player */}
                  <div className="p-6 border-b border-purple-100">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg">
                      <div className="text-center mb-3">
                        <h4 className="text-white text-base font-semibold">🎧 Full Chapter Audio</h4>
                        <p className="text-gray-300 text-sm">{book.title} - {chapter.title}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Play Button - Left aligned */}
                        <SimplePlayButton
                          key={`expanded-chapter-${book.id}-${chapter.id}-${playingChapter}-${isPlaying}`}
                          isPlaying={playingChapter === `${book.id}-${chapter.id}` && isPlaying}
                          onPlay={() => {
                            const chapterKey = `${book.id}-${chapter.id}`;
                            const audioPath = getAudioPath(selectedReader, book.id, chapter.id, 'chapter');
                            playAudio(audioPath, chapterKey);
                          }}
                          onPause={() => {
                            const chapterKey = `${book.id}-${chapter.id}`;
                            stopAudio();
                          }}
                          className="!p-0 w-12 h-12 !flex !items-center !justify-center"
                        />
                        
                        {/* Time */}
                        <span className="text-white text-xs font-mono">0:00</span>
                        
                        {/* Progress Bar */}
                        <div className="flex-1">
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full w-0 relative">
                              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-purple-400 shadow-md"></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Duration */}
                        {(book.id === 'genesis' && chapter.id >= 1 && chapter.id <= 24) && (
                          <span className="text-white text-xs font-mono">{exactDurations.get(`${book.id}-${chapter.id}`) || chapter.duration}</span>
                        )}
              </div>
            </div>


                    {/* Mark as Complete Button - Only show after audio finishes */}
                    {(() => {
                      const chapterKey = `${book.id}-${chapter.id}`;
                      const trackingStatus = getCompletionStatus(book.id, chapter.id, selectedReader);
                      const hasAudioFinished = audioFinishedChapters.has(chapterKey);
                      
                      console.log('🔍 Mark Complete Button Check:', {
                        chapterKey,
                        hasAudioFinished,
                        trackingStatus: trackingStatus.status,
                        audioFinishedChapters: Array.from(audioFinishedChapters),
                        shouldShowButton: hasAudioFinished && trackingStatus.status !== 'completed'
                      });
                      
                      
                      if (hasAudioFinished && trackingStatus.status !== 'completed') {
                        return (
                          <div className="mt-4 text-center">
                            <button 
                              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                              onClick={() => {
                                if (!book) return;
                                markCompleted(book.id, chapter.id, undefined, selectedReader);
                                
                                // Track chapter completion event
                                trackChapterComplete(book.id, chapter.id, selectedReader);
                                
                                showSuccess(
                                  'Chapter Marked Complete!',
                                  `You've marked ${book.title} Chapter ${chapter.id} as complete. Great job!`
                                );
                                // Remove from audio finished list since it's now completed
                                setAudioFinishedChapters(prev => {
                                  const newSet = new Set(prev);
                                  newSet.delete(chapterKey);
                                  return newSet;
                                });
                              }}
                            >
                              ✓ Mark as Complete
                            </button>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>

                  {/* Verse-by-Verse Content */}
                  <div className="p-6">
                    <div className="mb-4 text-center">
                      <h5 className="text-lg font-semibold text-gray-800 mb-2">📖 Verse by Verse</h5>
                      <p className="text-sm text-gray-600">Click on any verse to hear it individually</p>
                    </div>
                    
                    <div className="space-y-3">
                      {chapter.text.split('\n').filter(line => line.trim()).map((verse, index) => {
                        const verseNumber = verse.match(/^(\d+)/)?.[1] || (index + 1).toString();
                        const verseKey = `${book.id}-${chapter.id}-${verseNumber}`;
                        const verseText = verse.replace(/^\d+\s*/, '');
                        
                        return (
                          <div 
                            key={index}
                            className={`group relative p-4 rounded-lg border transition-all duration-300 cursor-pointer hover:shadow-md ${
                              playingVerse === verseKey 
                                ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-300 shadow-lg' 
                                : 'bg-white border-gray-200 hover:border-purple-200'
                            }`}
                            onClick={() => setPlayingVerse(playingVerse === verseKey ? null : verseKey)}
                          >
                            <div className="flex items-start gap-3">
                              {/* Verse Number */}
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                playingVerse === verseKey
                                  ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                                  : 'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-700'
                              }`}>
                                {verseNumber || index + 1}
                </div>
                              
                              {/* Verse Text */}
                              <div className="flex-1">
                                <p className="text-gray-700 leading-relaxed">{verseText}</p>
                </div>
                              
                              {/* Audio Controls */}
                              <div className={`flex-shrink-0 transition-all duration-300 ${
                                playingVerse === verseKey ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                              }`}>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <SimplePlayButton
                                    key={`verse-${verseKey}-${playingVerse}-${isPlaying}`}
                                    isPlaying={playingVerse === verseKey && isPlaying}
                                    onPlay={() => {
                                      // Individual verse audio files (1.mp3, 2.mp3, etc.)
                                      ensureAndPlay(selectedReader, book.id, chapter.id, 'verse', parseInt(verseNumber));
                                    }}
                                    onPause={() => {
                                      stopAudio();
                                    }}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                      playingVerse === verseKey
                                        ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-600 hover:bg-purple-200 hover:text-purple-700'
                                    }`}
                                  />
              </div>
            </div>
          </div>

                            {/* Playing Indicator */}
                            {playingVerse === verseKey && (
                              <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-full animate-pulse"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
              </div>
              )}

            </div>
          ))}
            </div>

          {/* Notes Section - At the end of all chapters */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">My Notes:</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add your thoughts and insights about the chapters..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="flex items-center gap-3 mt-3">
                <button 
                  onClick={saveNote}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Save Note
                </button>
                <button 
                  onClick={clearNote}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Clear
                </button>
              </div>
              </div>
            </div>

          {/* Saved Notes Display */}
          {Object.keys(savedNotes).length > 0 && (
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-sm border border-purple-200">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-purple-600">📝</span>
                  Saved Notes
                </h3>
                <div className="space-y-3">
                  {Object.entries(savedNotes)
                    .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Show newest first
                    .map(([timestamp, noteText]) => (
                      <div key={timestamp} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-gray-500">
                            {new Date(parseInt(timestamp)).toLocaleDateString()} at {new Date(parseInt(timestamp)).toLocaleTimeString()}
                          </span>
                          <button
                            onClick={() => {
                              const newNotes = { ...savedNotes };
                              delete newNotes[timestamp];
                              setSavedNotes(newNotes);
                              if (book) {
                                if (user) {
                                  deleteUserNote(user.uid, book.id, timestamp).catch(() => {});
                                } else if (typeof window !== 'undefined') {
                                  localStorage.setItem(`asmrts_notes_${book.id}`, JSON.stringify(newNotes));
                                }
                              }
                            }}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="text-gray-700 text-sm">{noteText}</p>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          )}

        </div>
      </main>
      
        <Footer />
    </div>
    </ProtectedRoute>
  );
} 