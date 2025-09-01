// IndexedDB-based image storage for handling large background images
class ImageStorage {
  constructor() {
    this.dbName = 'QuickLookImageDB';
    this.dbVersion = 1;
    this.storeName = 'backgroundImages';
    this.db = null;
  }

  // Initialize IndexedDB
  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Save image to IndexedDB and return a reference ID
  async saveImage(imageBlob, filename = 'background') {
    try {
      await this.init();
      
      const id = `bg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const imageData = {
        id,
        filename,
        blob: imageBlob,
        timestamp: Date.now(),
        size: imageBlob.size
      };

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(imageData);

        request.onsuccess = () => resolve(id);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error saving image to IndexedDB:', error);
      throw error;
    }
  }

  // Load image from IndexedDB by reference ID
  async loadImage(id) {
    try {
      if (!id) return null;
      
      await this.init();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(id);

        request.onsuccess = () => {
          const result = request.result;
          if (result && result.blob) {
            // Convert blob to data URL for display
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(result.blob);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error loading image from IndexedDB:', error);
      return null;
    }
  }

  // Delete image from IndexedDB
  async deleteImage(id) {
    try {
      if (!id) return;
      
      await this.init();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error deleting image from IndexedDB:', error);
    }
  }

  // Clean up old images (keep only the latest 5)
  async cleanupOldImages() {
    try {
      await this.init();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const index = store.index('timestamp');
        const request = index.openCursor(null, 'prev'); // Newest first

        let count = 0;
        const toDelete = [];

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            count++;
            if (count > 5) { // Keep only 5 most recent images
              toDelete.push(cursor.value.id);
            }
            cursor.continue();
          } else {
            // Delete old images
            Promise.all(toDelete.map(id => this.deleteImage(id)))
              .then(() => resolve())
              .catch(reject);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error cleaning up old images:', error);
    }
  }

  // Convert File to Blob (for better IndexedDB storage)
  fileToBlob(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Create blob from array buffer for better storage efficiency
        const blob = new Blob([reader.result], { type: file.type });
        resolve(blob);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }
}

// Export singleton instance
export const imageStorage = new ImageStorage();
