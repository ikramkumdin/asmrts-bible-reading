'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Download, 
  Settings,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize
} from 'lucide-react';

interface AdvancedAudioPlayerProps {
  audioSrc?: string;
  audioKey?: string;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  volume?: number;
  playbackRate?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onDownload?: () => void;
  onSeek?: (time: number) => void;
  onAuth?: () => void;
  mode: 'audio' | 'auth';
  className?: string;
}

export default function AdvancedAudioPlayer({
  audioSrc,
  audioKey,
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  volume = 0.8,
  playbackRate = 1.0,
  onPlay,
  onPause,
  onTimeUpdate,
  onVolumeChange,
  onPlaybackRateChange,
  onDownload,
  onSeek,
  onAuth,
  mode,
  className = ''
}: AdvancedAudioPlayerProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || mode === 'auth') return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * duration;
    
    onSeek?.(newTime);
  };

  const handleSkipBack = () => {
    if (mode === 'auth') return;
    onSeek?.(Math.max(0, currentTime - 15));
  };

  const handleSkipForward = () => {
    if (mode === 'auth') return;
    onSeek?.(Math.min(duration, currentTime + 15));
  };

  const handleDownload = async () => {
    if (!onDownload || mode === 'auth') return;
    
    setIsDownloading(true);
    try {
      await onDownload();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleMainAction = () => {
    // If user is not authenticated, always trigger auth
    if (mode === 'auth' || !audioSrc) {
      onAuth?.();
    } else {
      // If authenticated and has audio, handle play/pause
      if (isPlaying) {
        onPause?.();
      } else {
        onPlay?.();
      }
    }
  };

  const playbackRates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-4 ${className}`}>
      {/* Progress Bar - Only show for audio mode */}
      {mode === 'audio' && (
        <div className="mb-4">
          <div 
            ref={progressRef}
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer hover:h-3 transition-all duration-200"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full relative"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-purple-500"></div>
            </div>
          </div>
          
          {/* Time Display */}
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Auth Mode Display - Subtle hint */}
      {mode === 'auth' && (
        <div className="mb-4 text-center">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              Click the play button to sign in and start listening
            </p>
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center justify-between mb-4">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          {mode === 'audio' && (
            <>
              <button
                onClick={handleSkipBack}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Skip back 15s"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={handleSkipForward}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Skip forward 15s"
              >
                <RotateCw className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}
        </div>

        {/* Center - Main Action Button (Play/Auth) */}
        <div className="flex-1 text-center">
          <button
            onClick={handleMainAction}
            className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {/* Always show Play icon, but change behavior based on auth state */}
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>
        </div>

        {/* Right Controls - Only show for audio mode */}
        {mode === 'audio' && (
          <div className="flex items-center gap-2">
            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onVolumeChange?.(volume > 0 ? 0 : 0.8)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {volume > 0 ? (
                  <Volume2 className="w-5 h-5 text-gray-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))}
                className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Playback settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>

            {/* Download Button */}
            {onDownload && (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Download for offline listening"
              >
                {isDownloading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Download className="w-5 h-5 text-gray-600" />
                )}
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5 text-gray-600" />
              ) : (
                <Maximize className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Settings Panel - Only show for audio mode */}
      {showSettings && mode === 'audio' && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Playback Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Playback Speed
              </label>
              <div className="flex gap-1">
                {playbackRates.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => onPlaybackRateChange?.(rate)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      playbackRate === rate
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio Quality
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                <option value="high">High Quality</option>
                <option value="medium">Medium Quality</option>
                <option value="low">Low Quality (Offline)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
