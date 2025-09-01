// Image compression utility to reduce file size for localStorage
export class ImageCompressor {
  static async compressImage(file, maxSizeKB = 500, quality = 0.7) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions to keep under size limit
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        
        let { width, height } = img;
        
        // Scale down if too large
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const aspectRatio = width / height;
          if (width > height) {
            width = MAX_WIDTH;
            height = width / aspectRatio;
          } else {
            height = MAX_HEIGHT;
            width = height * aspectRatio;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try different quality levels to meet size requirement
        let currentQuality = quality;
        let result = canvas.toDataURL('image/jpeg', currentQuality);
        
        // If still too large, reduce quality further
        while (result.length > maxSizeKB * 1024 * 1.37 && currentQuality > 0.1) { // 1.37 accounts for base64 overhead
          currentQuality -= 0.1;
          result = canvas.toDataURL('image/jpeg', currentQuality);
        }
        
        resolve(result);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  static async validateAndCompress(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file.');
    }

    // Validate file size (max 10MB original)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image file size must be less than 10MB.');
    }

    // Compress image to fit in localStorage (target ~500KB compressed)
    try {
      const compressedDataUrl = await this.compressImage(file, 500, 0.8);
      return compressedDataUrl;
    } catch (error) {
      throw new Error('Failed to process image. Please try a different image.');
    }
  }
}
