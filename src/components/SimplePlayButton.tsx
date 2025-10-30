'use client';

import { Play, Pause } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SimplePlayButtonProps {
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
}

export default function SimplePlayButton({
  isPlaying = false,
  onPlay,
  onPause,
  className = ''
}: SimplePlayButtonProps) {
  const { isAuthenticated, signIn } = useAuth();

  const handleClick = () => {
    // If not authenticated, sign in
    if (!isAuthenticated) {
      signIn();
      return;
    }

    // If authenticated, play/pause
    if (isPlaying) {
      console.log('🎵 Pause button clicked');
      onPause?.();
    } else {
      console.log('🎵 Play button clicked');
      onPlay?.();
    }
  };

  const showPauseIcon = isPlaying;

  return (
    <button
      onClick={handleClick}
      className={`p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center ${className}`}
    >
      {/* Show pause icon only when authenticated AND playing, otherwise show play icon */}
      {showPauseIcon ? (
        <Pause className="w-5 h-5" />
      ) : (
        <Play className="w-5 h-5" />
      )}
    </button>
  );
}
