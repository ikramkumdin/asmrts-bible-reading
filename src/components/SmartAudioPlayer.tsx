'use client';

import { useState, useEffect } from 'react';
import AdvancedAudioPlayer from './AdvancedAudioPlayer';
import { useAuth } from '@/contexts/AuthContext';

interface SmartAudioPlayerProps {
  audioSrc?: string;
  audioKey?: string;
  onDownload?: () => void;
  className?: string;
}

export default function SmartAudioPlayer({
  audioSrc,
  audioKey,
  onDownload,
  className
}: SmartAudioPlayerProps) {
  const { isAuthenticated, signIn } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Auto-determine mode based on authentication and audio availability
  const mode = !isAuthenticated || !audioSrc ? 'auth' : 'audio';

  // Audio handlers
  const handlePlay = () => {
    if (!isAuthenticated) {
      signIn();
      return;
    }
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

  const handleAuth = () => {
    signIn();
  };

  return (
    <AdvancedAudioPlayer
      mode={mode}
      audioSrc={audioSrc}
      audioKey={audioKey}
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
      onDownload={onDownload}
      onAuth={handleAuth}
      className={className}
    />
  );
}

