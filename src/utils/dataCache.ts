// Cache utility for API data
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class DataCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default

  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiry = now + (ttl || this.defaultTTL);
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache info for debugging
  getInfo(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Create singleton instance
export const dataCache = new DataCache();

// Cache keys constants
export const CACHE_KEYS = {
  ORDERS: (foodPartnerId: string) => `orders:${foodPartnerId}`,
  ASSIGNED_ORDERS: (foodPartnerId: string) => `assigned_orders:${foodPartnerId}`,
  ASSIGNED_FOOD: (foodPartnerId: string) => `assigned_food:${foodPartnerId}`,
  FOOD_DETAILS: (foodIds: string[]) => `food_details:${foodIds.sort().join(',')}`,
  THALI_DETAILS: (thaliIds: string[]) => `thali_details:${thaliIds.sort().join(',')}`,
} as const;

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000,      // 2 minutes - for frequently changing data
  MEDIUM: 5 * 60 * 1000,     // 5 minutes - for moderately changing data
  LONG: 15 * 60 * 1000,      // 15 minutes - for static data
} as const;

export default dataCache;
