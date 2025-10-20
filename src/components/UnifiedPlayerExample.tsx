'use client';

import { useState } from 'react';
import AdvancedAudioPlayer from './AdvancedAudioPlayer';
import { useAuth } from '@/contexts/AuthContext';

// Example component showing how to use the unified player
export default function UnifiedPlayerExample() {
  const { signIn, isAuthenticated } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // 5 minutes
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Audio mode handlers
  const handlePlay = () => {
    setIsPlaying(true);
    // Your audio play logic here
  };

  const handlePause = () => {
    setIsPlaying(false);
    // Your audio pause logic here
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    // Your audio seek logic here
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    // Your volume change logic here
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    // Your playback rate change logic here
  };

  const handleDownload = async () => {
    // Your download logic here
    console.log('Downloading audio...');
  };

  // Auth mode handler
  const handleAuth = () => {
    signIn();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Unified Audio Player & Auth Component
      </h1>

      {/* Audio Mode Example */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Audio Mode</h2>
        <AdvancedAudioPlayer
          mode="audio"
          audioSrc="/audio/genesis/chapter1.mp3"
          audioKey="genesis-1"
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          playbackRate={playbackRate}
          onPlay={handlePlay}
          onPause={handlePause}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onPlaybackRateChange={handlePlaybackRateChange}
          onDownload={handleDownload}
        />
      </div>

      {/* Auth Mode Example */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Auth Mode</h2>
        <AdvancedAudioPlayer
          mode="auth"
          onAuth={handleAuth}
        />
      </div>

      {/* Conditional Rendering Example */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Conditional Rendering</h2>
        {isAuthenticated ? (
          <AdvancedAudioPlayer
            mode="audio"
            audioSrc="/audio/genesis/chapter1.mp3"
            audioKey="genesis-1"
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            playbackRate={playbackRate}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onPlaybackRateChange={handlePlaybackRateChange}
            onDownload={handleDownload}
          />
        ) : (
          <AdvancedAudioPlayer
            mode="auth"
            onAuth={handleAuth}
          />
        )}
      </div>
    </div>
  );
}

