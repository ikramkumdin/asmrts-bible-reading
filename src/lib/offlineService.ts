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
  private isIndexedDBAvailable: boolean | null = null;

  // Request persistent storage permission
  async requestStoragePermission(): Promise<boolean> {
    try {
      if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        console.log('Storage persistence:', isPersisted);
        return isPersisted;
      }
      return true; // If API not available, assume it's okay
    } catch (error) {
      console.warn('Could not request storage persistence:', error);
      return true; // Continue anyway
    }
  }

  // Test if IndexedDB actually works in this browser
  async testIndexedDB(): Promise<boolean> {
    if (this.isIndexedDBAvailable !== null) {
      return this.isIndexedDBAvailable;
    }

    if (!('indexedDB' in window)) {
      console.error('IndexedDB not supported in window');
      this.isIndexedDBAvailable = false;
      return false;
    }

    try {
      // Request storage permission first
      await this.requestStoragePermission();
      
      const testDBName = 'test-idb-availability';
      console.log('Testing IndexedDB with database:', testDBName);
      
      const testDB = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(testDBName, 1);
        
        request.onsuccess = () => {
          console.log('Test DB opened successfully');
          resolve(request.result);
        };
        
        request.onerror = () => {
          console.error('Test DB open error:', request.error);
          reject(request.error);
        };
        
        request.onupgradeneeded = (event) => {
          console.log('Test DB upgrade needed');
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('test')) {
            db.createObjectStore('test');
          }
        };
      });
      
      testDB.close();
      console.log('Test DB closed, deleting...');
      
      await new Promise<void>((resolve, reject) => {
        const deleteRequest = indexedDB.deleteDatabase(testDBName);
        deleteRequest.onsuccess = () => {
          console.log('Test DB deleted successfully');
          resolve();
        };
        deleteRequest.onerror = () => {
          console.error('Test DB delete error:', deleteRequest.error);
          reject(deleteRequest.error);
        };
      });
      
      this.isIndexedDBAvailable = true;
      console.log('✅ IndexedDB is available and working');
      return true;
    } catch (error) {
      console.error('❌ IndexedDB test failed:', error);
      this.isIndexedDBAvailable = false;
      return false;
    }
  }

  private async deleteDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(this.dbName);
      deleteRequest.onsuccess = () => {
        console.log('Successfully deleted corrupted database');
        resolve();
      };
      deleteRequest.onerror = () => {
        console.error('Failed to delete database:', deleteRequest.error);
        reject(deleteRequest.error);
      };
      deleteRequest.onblocked = () => {
        console.warn('Database deletion blocked - close all tabs using this site');
        reject(new Error('Database deletion blocked'));
      };
    });
  }

  async init(retryAfterDelete = false): Promise<void> {
    // Request storage permission first
    await this.requestStoragePermission();
    
    return new Promise((resolve, reject) => {
      // Check if IndexedDB is available
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB is not supported in this browser'));
        return;
      }

      console.log(`Opening IndexedDB: ${this.dbName} (version ${this.version}), retry=${retryAfterDelete}`);
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = async () => {
        const error = request.error;
        console.error('IndexedDB error:', {
          name: error?.name,
          message: error?.message,
          code: (error as any)?.code,
        });
        
        // If it's a backing store error and we haven't tried deleting yet, try to fix it
        if (error?.message?.includes('backing store') && !retryAfterDelete) {
          console.log('Attempting to fix corrupted database...');
          try {
            await this.deleteDatabase();
            // Retry initialization after deleting
            return this.init(true).then(resolve).catch(reject);
          } catch (deleteError) {
            console.error('Failed to auto-fix database:', deleteError);
          }
        }
        
        let errorMessage = 'Failed to open offline storage';
        
        if (error?.message?.includes('backing store')) {
          errorMessage = 'Browser storage is corrupted. Please try:\n\n' +
            '1. Open DevTools (F12) → Application/Storage tab\n' +
            '2. Find "IndexedDB" → Right-click "ASMRBibleOffline"\n' +
            '3. Select "Delete Database"\n' +
            '4. Refresh the page and try again\n\n' +
            'Or clear your browser cache for this site.';
        } else if (error?.name === 'UnknownError') {
          errorMessage = 'Browser storage is unavailable. Try:\n' +
            '• Opening DevTools (F12) and clearing IndexedDB\n' +
            '• Disabling browser extensions\n' +
            '• Using a different browser\n' +
            '• Checking if you have sufficient disk space';
        } else if (error?.name === 'QuotaExceededError') {
          errorMessage = 'Browser storage is full. Please free up some space.';
        } else if (error) {
          errorMessage = `Storage error: ${error.name} - ${error.message}`;
        }
        
        reject(new Error(errorMessage));
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
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
    console.log('Starting download for:', audio.title);
    
    // Test if IndexedDB is available first
    console.log('Testing IndexedDB availability...');
    const isAvailable = await this.testIndexedDB();
    console.log('IndexedDB available:', isAvailable);
    
    if (!isAvailable) {
      throw new Error(
        'Browser storage (IndexedDB) is not working. Please check the browser console for details and try:\n\n' +
        '1. Restarting your browser\n' +
        '2. Using a different browser\n' +
        '3. Checking browser console for specific errors'
      );
    }

    if (!this.db) {
      console.log('Database not initialized, initializing...');
      await this.init();
    }

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

