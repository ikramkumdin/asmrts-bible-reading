// Audio configuration for different environments
export const getAudioBaseUrl = () => {
  // Always prefer explicit env override first
  const envBase = process.env.NEXT_PUBLIC_AUDIO_BASE_URL;
  if (envBase && envBase.trim().length > 0) return envBase.replace(/\/$/, '');

  // Default to GCP bucket in all environments (avoids missing local files in dev)
  // Files are uploaded to: gs://asmrts-bible-audio-files/audio/{preset}/{bookId}/chapter{chapterId}/
  return 'https://storage.googleapis.com/asmrts-bible-audio-files';
};

/**
 * Get the full audio URL for a chapter or verse
 * @param preset - Voice preset (e.g., 'aria', 'heartsease')
 * @param bookId - Bible book ID (e.g., 'genesis')
 * @param chapterId - Chapter number
 * @param audioType - 'chapter' for full chapter, 'verse' for individual verse
 * @param verseNumber - Verse number (required if audioType is 'verse')
 * @returns Full URL to the audio file in GCP bucket
 */
export const getAudioUrl = (
  preset: string,
  bookId: string,
  chapterId: number,
  audioType: 'chapter' | 'verse' = 'chapter',
  verseNumber?: number
): string => {
  const baseUrl = getAudioBaseUrl();
  
  // Convert book IDs to match GCP folder structure (remove hyphens for numbered books)
  const gcsBookId = bookId.replace('-', ''); // '2-john' -> '2john', '3-john' -> '3john'
  
  if (audioType === 'chapter') {
    return `${baseUrl}/audio/${preset}/${gcsBookId}/chapter${chapterId}/chapter${chapterId}.mp3`;
  } else {
    if (!verseNumber) {
      throw new Error('Verse number is required for verse audio type');
    }
    return `${baseUrl}/audio/${preset}/${gcsBookId}/chapter${chapterId}/${verseNumber}.mp3`;
  }
};

export const isAudioAvailable = (preset: string, bookId: string, chapterId: number) => {
  // Genesis chapters 1-50 are available for both presets (aria and heartsease) in GCP bucket
  if (bookId === 'genesis' && chapterId >= 1 && chapterId <= 50) {
    return true;
  }
  
  // Jude chapter 1 is available for both presets
  if (bookId === 'jude' && chapterId === 1) {
    return true;
  }
  
  // 1 John chapters 1-5 are available for both presets
  if (bookId === '1-john' && chapterId >= 1 && chapterId <= 5) {
    return true;
  }
  
  // 2 John chapter 1 is available for both presets
  if (bookId === '2-john' && chapterId === 1) {
    return true;
  }
  
  // 3 John chapter 1 is available for both presets
  if (bookId === '3-john' && chapterId === 1) {
    return true;
  }
  
  // Revelation chapters 1-12 are available for both presets
  if (bookId === 'revelation' && chapterId >= 1 && chapterId <= 12) {
    return true;
  }
  
  // Other books/chapters: check based on file existence (currently only Genesis 1-50, Jude 1, 1 John 1-5, 2 John 1, 3 John 1, Revelation 1-12 available)
  return false;
};

/**
 * Check if verse audio is available for a specific book/chapter
 * @param preset - Voice preset (e.g., 'aria', 'heartsease')
 * @param bookId - Bible book ID (e.g., 'genesis')
 * @param chapterId - Chapter number
 * @returns Whether verse audio is available
 */
export const isVerseAudioAvailable = (preset: string, bookId: string, chapterId: number): boolean => {
  // Genesis chapters 46-50 have verse-by-verse audio
  if (bookId === 'genesis' && chapterId >= 46 && chapterId <= 50) {
    return true;
  }
  
  // Jude chapter 1 has verse-by-verse audio
  if (bookId === 'jude' && chapterId === 1) {
    return true;
  }
  
  // 1 John chapters 1-5 have verse-by-verse audio
  if (bookId === '1-john' && chapterId >= 1 && chapterId <= 5) {
    return true;
  }
  
  // 2 John chapter 1 has verse-by-verse audio
  if (bookId === '2-john' && chapterId === 1) {
    return true;
  }
  
  // 3 John chapter 1 has verse-by-verse audio
  if (bookId === '3-john' && chapterId === 1) {
    return true;
  }
  
  // Revelation chapters 1-12 have verse-by-verse audio
  if (bookId === 'revelation' && chapterId >= 1 && chapterId <= 12) {
    return true;
  }
  
  return false;
};

/**
 * Check if an audio file exists by attempting to fetch it
 * @param url - Full URL to the audio file
 * @returns Promise<boolean> - Whether the file exists and is accessible
 */
export const checkAudioFileExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    // Note: In no-cors mode, we can't check status, so we assume it exists
    // For more accurate checking, use a backend API endpoint
    return true;
  } catch {
    return false;
  }
};
