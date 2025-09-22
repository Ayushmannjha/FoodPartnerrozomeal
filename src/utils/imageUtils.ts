export const imageUtils = {
  /**
   * Validates and fixes image URLs
   */
  getValidImageUrl(url?: string | null): string | null {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return null;
    }

    // Fix common URL issues
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    
    if (url.startsWith('via.placeholder.com')) {
      return `https://${url}`;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      return `https://${url}`;
    }

    return url.trim();
  },

  /**
   * Generates a proper placeholder URL
   */
  getPlaceholderUrl(text: string, width = 300, height = 200): string {
    const encodedText = encodeURIComponent(text);
    return `https://via.placeholder.com/${width}x${height}/e2e8f0/64748b?text=${encodedText}`;
  },

  /**
   * Checks if an image URL is likely to be valid
   */
  isValidImageUrl(url: string): boolean {
    if (!url) return false;
    
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    const hasValidExtension = validExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    const isValidProtocol = url.startsWith('http://') || 
                           url.startsWith('https://') || 
                           url.startsWith('/');
    
    return isValidProtocol && (hasValidExtension || url.includes('placeholder'));
  }
};