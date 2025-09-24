'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { getBookById, getAllBooks, type BibleBook } from '@/lib/bibleData';
import { type VoicePreset } from '@/lib/audioUtils';
import { isAudioAvailable } from '@/lib/audioConfig';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BibleStudyPageProps {
  params: Promise<{
    book: string;
  }>;
}

export default function BibleStudyPage({ params }: BibleStudyPageProps) {
  const [book, setBook] = useState<BibleBook | null>(null);
  const [selectedReader, setSelectedReader] = useState<VoicePreset>('luna');
  const [note, setNote] = useState('');
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

  // Handle async params
  useEffect(() => {
    setIsLoading(true);
    params.then(({ book: bookName }) => {
      const bookData = getBookById(bookName);
      setBook(bookData || null);
      
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
    // All presets now use the chapter folder structure
    if (audioType === 'chapter') {
      return `/audio/${preset}/${bookId}/chapter${chapterId}/chapter${chapterId}.mp3`;
    } else {
      return `/audio/${preset}/${bookId}/chapter${chapterId}/${verseNumber}.mp3`;
    }
  };

  // Audio playback functions
  const playAudio = (audioPath: string, audioKey: string) => {
    console.log('Playing audio:', audioPath, 'for key:', audioKey);
    
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

    // Create new audio element
    const audio = new Audio(audioPath);
    audio.volume = 0.8; // Set volume to 80%
    audio.preload = 'metadata'; // Preload metadata for faster start
    setCurrentAudio(audio);
    
    // Set playing states
    if (audioKey.includes('chapter')) {
      setPlayingChapter(audioKey);
      setPlayingVerse(null);
    } else {
      setPlayingVerse(audioKey);
      setPlayingChapter(null);
    }
    
    setIsPlaying(true);

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
      console.log('🎵 AUDIO IS NOW PLAYING:', audioPath);
    };

    // Add time update listener for progress
    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // Add loaded metadata listener
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };

    // Play audio
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      console.error('Audio path attempted:', audioPath);
      setIsPlaying(false);
      setAudioLoading(false);
      
      // Show user-friendly error message
      if (error.name === 'NotAllowedError') {
        alert('Please click the play button to start audio playback.');
      } else if (error.name === 'NotSupportedError') {
        alert('Audio format not supported. Please try a different browser.');
      } else if (error.name === 'AbortError') {
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
      
      // Mark chapter as completed if it's a chapter audio (not verse)
      if (audioKey.includes('chapter') && !audioKey.includes('-')) {
        const chapterKey = audioKey;
        setCompletedChapters(prev => new Set([...prev, chapterKey]));
        console.log('🎉 Chapter completed:', chapterKey);
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
    { id: 'luna', name: 'Luna', avatar: '/presets/Preset1.jpg' },
    { id: 'river', name: 'River', avatar: '/presets/Preset2.jpg' },
    { id: 'aria', name: 'Aria', avatar: '/presets/Preset3.jpg' },
    { id: 'heartsease', name: 'Heartsease', avatar: '/presets/Preset4.jpg' }
  ];



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
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50">
              All
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors">
              In Progress
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors">
              Complete
            </button>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-8 bg-white">
        <div className="max-w-6xl mx-auto">

          {/* Reader Selection - Full Width */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900 whitespace-nowrap">Choose your favorite:</h3>
              <div className="flex gap-3 flex-1">
                {readers.map((reader) => (
                  <button
                    key={reader.id}
                    onClick={() => setSelectedReader(reader.id as VoicePreset)}
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

          {/* Chapter Cards - Full Width */}
          <div className="space-y-4">
          {book.chapterList.map((chapter) => (
            <div key={chapter.id} className="bg-gradient-to-r from-white to-purple-50 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Collapsed Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
                onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-md ${
                      chapter.status === 'completed' ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' :
                      chapter.status === 'error' ? 'bg-gradient-to-br from-red-400 to-red-600 text-white' :
                      chapter.status === 'pending' ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                      'bg-gradient-to-br from-blue-400 to-purple-600 text-white'
                    }`}>
                      {chapter.status === 'completed' ? '✓' : 
                       chapter.status === 'error' ? '✗' : 
                       chapter.status === 'pending' ? '⏳' : chapter.id}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {chapter.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {chapter.duration}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          completedChapters.has(`${book.id}-${chapter.id}`) ? 'bg-green-100 text-green-800' :
                          chapter.status === 'completed' ? 'bg-green-100 text-green-800' :
                          chapter.status === 'error' ? 'bg-red-100 text-red-800' :
                          chapter.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {completedChapters.has(`${book.id}-${chapter.id}`) ? '✓ Completed' : chapter.status}
                        </span>
                      </div>
                      
                      {/* Progress Bar - Show when this chapter is playing */}
                      {(playingChapter === `${book.id}-${chapter.id}` || playingVerse?.startsWith(`${book.id}-${chapter.id}`)) && duration > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-purple-500 h-1 rounded-full transition-all duration-100"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                              ></div>
                            </div>
                            <span>{Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-3 bg-purple-500 hover:bg-purple-600 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        const chapterKey = `${book.id}-${chapter.id}`;
                        console.log(`🎯 CHAPTER ${chapter.id} BUTTON CLICKED`);
                        
                        if (playingChapter === chapterKey) {
                          stopAudio();
                        } else {
                          const audioPath = getAudioPath(selectedReader, book.id, chapter.id, 'chapter');
                          console.log(`🎯 PLAYING: ${audioPath}`);
                          playAudio(audioPath, chapterKey);
                        }
                      }}
                      title="Play full chapter"
                    >
                      {audioLoading && playingChapter === `${book.id}-${chapter.id}` ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : playingChapter === `${book.id}-${chapter.id}` && isPlaying ? (
                        <div className="flex gap-0.5">
                          <div className="w-1 h-4 bg-white"></div>
                          <div className="w-1 h-4 bg-white"></div>
                        </div>
                      ) : (
                        <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-0.5"></div>
                      )}
                    </button>
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
                      
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            const chapterKey = `${book.id}-${chapter.id}`;
                            if (playingChapter === chapterKey) {
                              stopAudio();
                            } else {
                              // Use the actual audio file path (files are named 1.mp3, 2.mp3, etc.)
                              const audioPath = getAudioPath(selectedReader, book.id, chapter.id, 'chapter');
                              console.log(`🎯 EXPANDED CHAPTER ${chapter.id} - PLAYING: ${audioPath}`);
                              playAudio(audioPath, chapterKey);
                            }
                          }}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          {audioLoading && playingChapter === `${book.id}-${chapter.id}` ? (
                            <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                          ) : playingChapter === `${book.id}-${chapter.id}` ? (
                            <div className="flex gap-0.5">
                              <div className="w-1.5 h-4 bg-gray-800"></div>
                              <div className="w-1.5 h-4 bg-gray-800"></div>
                            </div>
                          ) : (
                            <div className="w-0 h-0 border-l-[8px] border-l-gray-800 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5"></div>
                          )}
                        </button>
                        
                        <span className="text-white text-xs font-mono ml-4">0:00</span>
                        
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full w-0 relative">
                              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-purple-400 shadow-md"></div>
                            </div>
                          </div>
                        </div>
                        
                        <span className="text-white text-xs font-mono">{chapter.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Verse-by-Verse Content */}
                  <div className="p-6">
                    <div className="mb-4 text-center">
                      <h5 className="text-lg font-semibold text-gray-800 mb-2">📖 Verse by Verse</h5>
                      <p className="text-sm text-gray-600">Click on any verse to hear it individually</p>
                    </div>
                    
                    <div className="space-y-3">
                      {chapter.text.split('\n').filter(line => line.trim()).map((verse, index) => {
                        const verseKey = `${book.id}-${chapter.id}-${index}`;
                        const verseNumber = verse.match(/^(\d+)/)?.[1] || (index + 1).toString();
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
                                <button
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    playingVerse === verseKey
                                      ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg'
                                      : 'bg-gray-200 text-gray-600 hover:bg-purple-200 hover:text-purple-700'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Individual verse audio files (1.mp3, 2.mp3, etc.)
                                    const audioPath = getAudioPath(selectedReader, book.id, chapter.id, 'verse', parseInt(verseNumber));
                                    console.log(`Verse button clicked for Chapter ${chapter.id} - playing:`, audioPath);
                                    playAudio(audioPath, verseKey);
                                  }}
                                >
                                  {playingVerse === verseKey && isPlaying ? (
                                    <div className="flex gap-0.5">
                                      <div className="w-1 h-3 bg-white"></div>
                                      <div className="w-1 h-3 bg-white"></div>
                                    </div>
                                  ) : (
                                    <div className="w-0 h-0 border-l-[6px] border-l-current border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
                                  )}
                                </button>
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
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Save Note
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 