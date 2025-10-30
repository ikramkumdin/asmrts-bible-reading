// Audio duration utilities to get exact duration from audio files
import { getAudioBaseUrl } from './audioConfig';

export interface AudioDuration {
  bookId: string;
  chapterId: number;
  preset: string;
  duration: number; // in seconds
  formatted: string; // "5:23" format
}

// Cache for audio durations to avoid repeated requests
const durationCache = new Map<string, AudioDuration>();

// Get exact duration from audio file
export async function getAudioDuration(
  bookId: string, 
  chapterId: number, 
  preset: string
): Promise<AudioDuration | null> {
  const cacheKey = `${bookId}-${chapterId}-${preset}`;
  
  // Check cache first
  if (durationCache.has(cacheKey)) {
    return durationCache.get(cacheKey)!;
  }

  try {
    // Construct audio file path
    const audioPath = getAudioFilePath(bookId, chapterId, preset);
    
    // Create audio element to get duration
    const audio = new Audio(audioPath);
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Audio duration timeout'));
      }, 10000); // 10 second timeout

      audio.onloadedmetadata = () => {
        clearTimeout(timeout);
        
        const duration = audio.duration;
        const formatted = formatDuration(duration);
        
        const result: AudioDuration = {
          bookId,
          chapterId,
          preset,
          duration,
          formatted
        };
        
        // Cache the result
        durationCache.set(cacheKey, result);
        resolve(result);
      };

      audio.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load audio file'));
      };

      // Load the audio
      audio.load();
    });
  } catch (error) {
    console.error('Error getting audio duration:', error);
    return null;
  }
}

// Get audio file path
function getAudioFilePath(bookId: string, chapterId: number, preset: string): string {
  const baseUrl = getAudioBaseUrl();
  return `${baseUrl}/audio/${preset}/${bookId}/chapter${chapterId}/chapter${chapterId}.mp3`;
}

// Format duration in seconds to MM:SS format
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Get duration for multiple chapters
export async function getMultipleAudioDurations(
  bookId: string,
  chapterIds: number[],
  preset: string
): Promise<Map<number, AudioDuration>> {
  const results = new Map<number, AudioDuration>();
  
  // Process in batches to avoid overwhelming the browser
  const batchSize = 3;
  for (let i = 0; i < chapterIds.length; i += batchSize) {
    const batch = chapterIds.slice(i, i + batchSize);
    
    const promises = batch.map(async (chapterId) => {
      try {
        const duration = await getAudioDuration(bookId, chapterId, preset);
        if (duration) {
          results.set(chapterId, duration);
        }
      } catch (error) {
        console.warn(`Failed to get duration for ${bookId} Chapter ${chapterId}:`, error);
      }
    });
    
    await Promise.all(promises);
    
    // Small delay between batches
    if (i + batchSize < chapterIds.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

// Preload durations for a book
export async function preloadBookDurations(
  bookId: string,
  chapterIds: number[],
  preset: string
): Promise<void> {
  console.log(`Preloading durations for ${bookId} with ${preset}...`);
  
  try {
    await getMultipleAudioDurations(bookId, chapterIds, preset);
    console.log(`Successfully preloaded durations for ${bookId}`);
  } catch (error) {
    console.error(`Failed to preload durations for ${bookId}:`, error);
  }
}

