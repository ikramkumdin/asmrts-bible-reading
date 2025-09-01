'use client';

import React, { useState, useEffect } from 'react';
import { generateAudio, VOICE_PRESETS, AudioGenerationRequest } from '@/lib/audioService';

export default function AudioGenerator() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('luna');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  // Check backend status on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/audio/list');
        setBackendStatus(response.ok ? 'available' : 'unavailable');
      } catch (error) {
        setBackendStatus('unavailable');
      }
    };
    
    checkBackend();
  }, []);

  const handleGenerateAudio = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const request: AudioGenerationRequest = {
        text: text.trim(),
        preset_id: selectedVoice,
        user_id: 'anonymous', // For now, use anonymous
        is_pro: false
      };

      const response = await generateAudio(request);
      
      if (response.success && response.audioUrl) {
        setResult({
          audioUrl: response.audioUrl,
          text: text.trim(),
          voice: selectedVoice,
          duration: 'Generated successfully'
        });
      } else {
        setError(response.error || 'Generation failed');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (result?.audioUrl) {
      const link = document.createElement('a');
      link.href = result.audioUrl;
      link.download = `audio_${selectedVoice}_${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Audio Generator</h2>
        <p className="text-gray-600">Transform your Bible text into beautiful, relaxing audio</p>
        
        {/* Backend Status */}
        <div className="mt-4">
          {backendStatus === 'checking' && (
            <div className="text-yellow-600 text-sm">Checking backend connection...</div>
          )}
          {backendStatus === 'available' && (
            <div className="text-green-600 text-sm">✅ Backend connected</div>
          )}
          {backendStatus === 'unavailable' && (
            <div className="text-red-600 text-sm">⚠️ Backend not available. Please start the asmrtts_website server.</div>
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Text to Convert</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your Bible text here..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            disabled={backendStatus === 'unavailable'}
          />
          <div className="mt-2 text-sm text-gray-500">
            {text.length} characters, {text.split(/\s+/).filter(word => word.length > 0).length} words
          </div>
        </div>

        {/* Voice Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Choose Voice Model</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {VOICE_PRESETS.map((voice) => (
              <div
                key={voice.id}
                onClick={() => setSelectedVoice(voice.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedVoice === voice.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{voice.name.charAt(0)}</span>
                  </div>
                  <h4 className="font-medium text-gray-900">{voice.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{voice.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateAudio}
          disabled={!text.trim() || isGenerating || backendStatus === 'unavailable'}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating Audio...
            </>
          ) : (
            <>
              <span>🎵</span>
              Generate Audio
            </>
          )}
        </button>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-medium text-red-800 mb-2">Generation Failed</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Audio Generated Successfully!</h3>
            <p className="text-green-700 text-sm mb-3">
              Voice: {VOICE_PRESETS.find(v => v.id === result.voice)?.name} | 
              Duration: {result.duration}
            </p>
            
            <div className="space-y-3">
              <audio controls className="w-full">
                <source src={result.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  📥 Download Audio
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setText('');
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
                >
                  🔄 Generate Another
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">💡 How to Use</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Enter your Bible text in the text area above</li>
            <li>• Choose your preferred voice model</li>
            <li>• Click "Generate Audio" to create your audio</li>
            <li>• Download or play the generated audio</li>
            <li>• Make sure the asmrtts_website backend is running on port 8000</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
