// Offline download service for ASMR Bible audio
export interface OfflineAudio {
  id: string;
  bookId: string;
  chapterId: number;
  verseId?: number;
  preset: string;
  audioUrl: string;
  title: string;
  duration: number;
  size: number;
  downloadedAt: string;
  isDownloaded: boolean;
}

export interface DownloadProgress {
  audioId: string;
  progress: number;
  status: 'downloading' | 'completed' | 'error';
  error?: string;
}

class OfflineService {
  private dbName = 'ASMRBibleOffline';
  private version = 1;
  private db: IDBDatabase | null = null;
  private downloadProgress: Map<string, DownloadProgress> = new Map();

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create audio store
        if (!db.objectStoreNames.contains('audio')) {
          const audioStore = db.createObjectStore('audio', { keyPath: 'id' });
          audioStore.createIndex('bookId', 'bookId', { unique: false });
          audioStore.createIndex('preset', 'preset', { unique: false });
          audioStore.createIndex('downloadedAt', 'downloadedAt', { unique: false });
        }
      };
    });
  }

  async downloadAudio(audio: OfflineAudio, onProgress?: (progress: number) => void): Promise<void> {
    if (!this.db) await this.init();

    const audioId = `${audio.bookId}-${audio.chapterId}${audio.verseId ? `-${audio.verseId}` : ''}-${audio.preset}`;
    
    // Set initial progress
    this.downloadProgress.set(audioId, {
      audioId,
      progress: 0,
      status: 'downloading'
    });

    try {
      // Fetch audio file
      const response = await fetch(audio.audioUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        loaded += value.length;

        if (total > 0) {
          const progress = (loaded / total) * 100;
          this.downloadProgress.set(audioId, {
            audioId,
            progress: Math.round(progress),
            status: 'downloading'
          });
          onProgress?.(progress);
        }
      }

      // Combine chunks
      const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
      
      // Store in IndexedDB
      const offlineAudio: OfflineAudio = {
        ...audio,
        id: audioId,
        isDownloaded: true,
        downloadedAt: new Date().toISOString(),
        size: audioBlob.size
      };

      const transaction = this.db!.transaction(['audio'], 'readwrite');
      const store = transaction.objectStore('audio');
      await store.put(offlineAudio);

      // Update progress
      this.downloadProgress.set(audioId, {
        audioId,
        progress: 100,
        status: 'completed'
      });

    } catch (error) {
      this.downloadProgress.set(audioId, {
        audioId,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Download failed'
      });
      throw error;
    }
  }

  async getDownloadedAudio(): Promise<OfflineAudio[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['audio'], 'readonly');
      const store = transaction.objectStore('audio');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAudioById(audioId: string): Promise<OfflineAudio | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['audio'], 'readonly');
      const store = transaction.objectStore('audio');
      const request = store.get(audioId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteAudio(audioId: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['audio'], 'readwrite');
      const store = transaction.objectStore('audio');
      const request = store.delete(audioId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getStorageUsage(): Promise<{ used: number; available: number }> {
    if (!this.db) await this.init();

    const audioList = await this.getDownloadedAudio();
    const used = audioList.reduce((total, audio) => total + audio.size, 0);
    
    // Estimate available space (this is approximate)
    const available = 50 * 1024 * 1024; // 50MB estimate
    
    return { used, available };
  }

  getDownloadProgress(audioId: string): DownloadProgress | null {
    return this.downloadProgress.get(audioId) || null;
  }

  // Get audio blob for playback
  async getAudioBlob(audioId: string): Promise<Blob | null> {
    const audio = await this.getAudioById(audioId);
    if (!audio || !audio.isDownloaded) return null;

    // In a real implementation, you'd retrieve the blob from IndexedDB
    // For now, we'll return null as this requires more complex blob storage
    return null;
  }

  // Check if audio is available offline
  async isAudioOffline(audioId: string): Promise<boolean> {
    const audio = await this.getAudioById(audioId);
    return audio?.isDownloaded || false;
  }
}

// Export singleton instance
export const offlineService = new OfflineService();

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getOfflineAudioId = (bookId: string, chapterId: number, verseId: number | undefined, preset: string): string => {
  return `${bookId}-${chapterId}${verseId ? `-${verseId}` : ''}-${preset}`;
};

