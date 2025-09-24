import axios from 'axios';

// Configuration for the backend API
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export interface AudioGenerationRequest {
  text: string;
  preset_id: string;
  user_id?: string;
  is_pro?: boolean;
}

export interface AudioGenerationResponse {
  success: boolean;
  audioUrl?: string;
  error?: string;
  queueId?: string;
}

export interface AudioFile {
  id: string;
  userId: string;
  fileName: string;
  status: string;
  createdAt: string;
  generationParams: {
    text: string;
    preset_id: string;
  };
}

// Available voice presets (mapped to the backend presets)
export const VOICE_PRESETS = [
  { id: 'luna', name: 'Luna', description: 'Soft, calming voice perfect for meditation' },
  { id: 'river', name: 'River', description: 'Smooth, flowing voice for storytelling' },
  { id: 'aria', name: 'Aria', description: 'Clear, melodic voice for narration' },
  { id: 'heartsease', name: 'Heartsease', description: 'Warm, comforting voice for relaxation' }
];

// Generate audio using the existing backend
export async function generateAudio(request: AudioGenerationRequest): Promise<AudioGenerationResponse> {
  try {
    console.log('🎵 Generating audio with backend:', request);
    
    const response = await axios.post(`${BACKEND_URL}/api/audio/generate`, request, {
      responseType: 'blob',
      timeout: 30000 // 30 second timeout
    });

    // Convert blob to audio URL
    const audioBlob = response.data;
    const audioUrl = URL.createObjectURL(audioBlob);

    return {
      success: true,
      audioUrl
    };

  } catch (error) {
    console.error('❌ Audio generation failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

// Generate audio with queue (for better performance)
export async function generateAudioQueued(request: AudioGenerationRequest & { sessionId?: string }): Promise<AudioGenerationResponse> {
  try {
    console.log('🎵 Adding audio generation to queue:', request);
    
    const response = await axios.post(`${BACKEND_URL}/api/audio/generate-queued`, request);
    
    return {
      success: true,
      queueId: response.data.queueId,
      audioUrl: response.data.audioUrl
    };

  } catch (error) {
    console.error('❌ Failed to add audio to queue:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

// Get user's audio files
export async function getUserAudioFiles(userId: string, preset?: string): Promise<AudioFile[]> {
  try {
    const params = new URLSearchParams({ uid: userId });
    if (preset) {
      params.append('preset', preset);
    }
    
    const response = await axios.get(`${BACKEND_URL}/api/audio/list?${params}`);
    
    return response.data;

  } catch (error) {
    console.error('❌ Failed to fetch audio files:', error);
    return [];
  }
}

// Get audio file by path
export async function getAudioFile(filePath: string): Promise<string> {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/audio/${filePath}`, {
      responseType: 'blob'
    });
    
    return URL.createObjectURL(response.data);

  } catch (error) {
    console.error('❌ Failed to fetch audio file:', error);
    throw new Error('Failed to fetch audio file');
  }
}

// Check if backend is available
export async function checkBackendHealth(): Promise<boolean> {
  try {
    await axios.get(`${BACKEND_URL}/api/audio/list`, { timeout: 5000 });
    return true;
  } catch (error) {
    console.warn('⚠️ Backend not available:', error);
    return false;
  }
}
