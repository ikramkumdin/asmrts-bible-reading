// Audio file path utilities for the ASMR Bible Reading app

export type VoicePreset = 'aria' | 'heartsease';

/**
 * Get the audio file path for a specific chapter
 * @param voicePreset - The selected voice preset
 * @param bookId - The Bible book ID (e.g., 'genesis', 'exodus')
 * @param chapterNumber - The chapter number
 * @returns The audio file path
 */
export function getChapterAudioPath(
  voicePreset: VoicePreset,
  bookId: string,
  chapterNumber: number
): string {
  return `/audio/${voicePreset}/${bookId}/chapter-${chapterNumber}.mp3`;
}

/**
 * Get the audio file path for a specific verse
 * @param voicePreset - The selected voice preset
 * @param bookId - The Bible book ID (e.g., 'genesis', 'exodus')
 * @param chapterNumber - The chapter number
 * @param verseNumber - The verse number
 * @returns The audio file path
 */
export function getVerseAudioPath(
  voicePreset: VoicePreset,
  bookId: string,
  chapterNumber: number,
  verseNumber: number
): string {
  return `/audio/${voicePreset}/${bookId}/verse-${chapterNumber}-${verseNumber}.mp3`;
}

/**
 * Check if an audio file exists (for client-side validation)
 * @param audioPath - The audio file path
 * @returns Promise<boolean> - Whether the file exists
 */
export async function checkAudioFileExists(audioPath: string): Promise<boolean> {
  try {
    const response = await fetch(audioPath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get all available voice presets
 * @returns Array of voice preset names
 */
export function getAvailableVoicePresets(): VoicePreset[] {
  return ['aria', 'heartsease'];
}

/**
 * Get voice preset display information
 * @param voicePreset - The voice preset ID
 * @returns Object with display name and avatar
 */
export function getVoicePresetInfo(voicePreset: VoicePreset) {
  const presets = {
    aria: { name: 'Aria', avatar: '/presets/Preset3.jpg' },
    heartsease: { name: 'Heartsease', avatar: '/presets/Preset4.jpg' }
  };
  
  return presets[voicePreset];
}

/**
 * Audio file configuration for different environments
 */
export const AUDIO_CONFIG = {
  // Base URL for audio files (can be overridden for CDN)
  baseUrl: '',
  
  // Default audio format
  format: 'mp3',
  
  // Fallback audio format (for browsers that don't support MP3)
  fallbackFormat: 'ogg',
  
  // Audio quality settings
  quality: {
    high: '320kbps',
    medium: '128kbps',
    low: '64kbps'
  }
};

/**
 * Get the full audio URL with base URL and format
 * @param audioPath - The relative audio path
 * @param format - The audio format (defaults to mp3)
 * @returns The full audio URL
 */
export function getFullAudioUrl(audioPath: string, format: string = AUDIO_CONFIG.format): string {
  const baseUrl = AUDIO_CONFIG.baseUrl || '';
  const pathWithoutExtension = audioPath.replace(/\.(mp3|ogg|wav)$/, '');
  return `${baseUrl}${pathWithoutExtension}.${format}`;
}
