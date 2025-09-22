import { httpClient } from './httpClient';
import { Thali } from '../types/thali';

export const thaliService = {
  // Get thali details by ID
  async getThaliDetail(thaliId: string): Promise<Thali> {
    try {
      const response = await httpClient.get<Thali>(`/food-partner/thali-detail?thaliId=${thaliId}`);
      return response; // ✅ Remove .data, add generic type
    } catch (error) {
      console.error(`Error fetching thali details for ID ${thaliId}:`, error);
      throw new Error(`Failed to fetch thali details for ID ${thaliId}`);
    }
  },

  // Get multiple thali details
  async getMultipleThaliDetails(thaliIds: string[]): Promise<Thali[]> {
    try {
      const promises = thaliIds.map(id => this.getThaliDetail(id));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching multiple thali details:', error);
      throw new Error('Failed to fetch thali details');
    }
  }
};