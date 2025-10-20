'use client';

import { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UnifiedPlayButtonProps {
  audioSrc?: string;
  audioKey?: string;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
}

export default function UnifiedPlayButton({
  audioSrc,
  audioKey,
  isPlaying = false,
  onPlay,
  onPause,
  className = ''
}: UnifiedPlayButtonProps) {
  const { isAuthenticated, signIn } = useAuth();

  const handleClick = () => {
    // If not authenticated, always sign in
    if (!isAuthenticated) {
      signIn();
      return;
    }

    // If authenticated, handle play/pause
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <button
        onClick={handleClick}
        className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6 ml-0.5" />
        )}
      </button>
      
      {/* Show hint text if not authenticated */}
      {!isAuthenticated && (
        <div className="ml-4 text-sm text-gray-600">
          Click to sign in and start listening
        </div>
      )}
    </div>
  );
}

