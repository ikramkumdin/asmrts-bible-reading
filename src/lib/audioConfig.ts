// Audio configuration for different environments
export const getAudioBaseUrl = () => {
  // Always prefer explicit env override first
  const envBase = process.env.NEXT_PUBLIC_AUDIO_BASE_URL;
  if (envBase && envBase.trim().length > 0) return envBase.replace(/\/$/, '');

  // Default to GCP bucket in all environments (avoids missing local files in dev)
  return 'https://storage.googleapis.com/asmrts-bible-audio-files';
};

export const isAudioAvailable = (preset: string, bookId: string, chapterId: number) => {
  // Audio is available in both development and production
  return true;
};
