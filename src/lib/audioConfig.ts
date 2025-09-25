// Audio configuration for different environments
export const getAudioBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return '';
  }
  
  // Client-side
  if (process.env.NODE_ENV === 'production') {
    // Use GCP bucket for production
    return 'https://storage.googleapis.com/asmrts-bible-audio-files';
  }
  
  // Development - use local files
  return '';
};

export const isAudioAvailable = (preset: string, bookId: string, chapterId: number) => {
  // Audio is available in both development and production
  return true;
};
