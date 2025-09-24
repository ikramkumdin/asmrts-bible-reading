// Audio configuration for different environments
export const getAudioBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return '';
  }
  
  // Client-side
  if (process.env.NODE_ENV === 'production') {
    // In production, use a CDN or external storage
    // For now, we'll use the same domain but the files won't be deployed
    return '';
  }
  
  // Development
  return '';
};

export const isAudioAvailable = (preset: string, bookId: string, chapterId: number) => {
  // In production, we need to check if audio files are available
  // For now, return false to show a message to users
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  
  return true;
};
