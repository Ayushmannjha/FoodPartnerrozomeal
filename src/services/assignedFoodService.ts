import { httpClient } from './httpClient';
import { AssignedFood, AssignedFoodResponse, FlattenedAssignedFood } from '../types/assignedFood';

export const assignedFoodService = {
  // Get assigned food for food partner
  async getAssignedFood(foodPartnerId: string): Promise<FlattenedAssignedFood[]> {
    try {
      console.log('🔍 Making API call to get assigned food for food partner:', foodPartnerId);
      console.log('🔗 Request URL: /food-partner/get-assigned-food?id=' + foodPartnerId);
      
      // The endpoint returns a JWT token containing the assigned food data
      const tokenResponse = await httpClient.get<string>(`/food-partner/get-assigned-food?id=${foodPartnerId}`);
      
      console.log('🎫 Received token response:', tokenResponse);
      
      // Decode the JWT token to extract assigned food data
      const assignedFoodData = this.decodeAssignedFoodToken(tokenResponse);
      
      console.log('✅ Decoded assigned food data:', assignedFoodData);
      
      return assignedFoodData;
    } catch (error) {
      console.error('❌ Error fetching assigned food:', error);
      
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
      }
      
      throw new Error('Failed to fetch assigned food');
    }
  },

  // Decode JWT token to extract assigned food data
  decodeAssignedFoodToken(token: string): FlattenedAssignedFood[] {
    try {
      // Decode JWT payload
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload: AssignedFoodResponse = JSON.parse(jsonPayload);
      console.log('🔓 Decoded assigned food token payload:', payload);
      
      // Extract and flatten assigned food data from payload
      const assignedFoodDetails = payload.Assigned_food_details || [];
      
      // Flatten the nested structure for easier UI management
      const flattenedData: FlattenedAssignedFood[] = assignedFoodDetails.map((item: AssignedFood) => ({
        id: item.id,
        foodId: item.food.id,
        name: item.food.name,
        category: item.food.category,
        price: item.food.price,
        imageUrl: item.food.imageUrl,
        isAvailable: true, // Default to available, you can add logic to determine this
        foodPartnerId: item.foodPartner.userId,
        foodPartnerName: item.foodPartner.name
      }));
      
      console.log('🍽️ Flattened assigned food data:', flattenedData);
      
      return flattenedData;
    } catch (error) {
      console.error('❌ Error decoding assigned food token:', error);
      throw new Error('Failed to decode assigned food data');
    }
  },

  // Toggle food availability (you'll need to implement this endpoint)
  async toggleFoodAvailability(assignedFoodId: string, isAvailable: boolean): Promise<void> {
    try {
      console.log('🔄 Toggling food availability:', { assignedFoodId, isAvailable });
      
      // You'll need to implement this endpoint on the backend
      await httpClient.post(`/food-partner/toggle-food-availability`, {
        assignedFoodId,
        isAvailable
      });
      
      console.log('✅ Food availability toggled successfully');
    } catch (error) {
      console.error('❌ Error toggling food availability:', error);
      throw new Error('Failed to toggle food availability');
    }
  },

  // Update food price (you'll need to implement this endpoint)
  async updateFoodPrice(assignedFoodId: string, newPrice: number): Promise<void> {
    try {
      console.log('💰 Updating food price:', { assignedFoodId, newPrice });
      
      // You'll need to implement this endpoint on the backend
      await httpClient.put(`/food-partner/update-food-price/${assignedFoodId}`, {
        price: newPrice
      });
      
      console.log('✅ Food price updated successfully');
    } catch (error) {
      console.error('❌ Error updating food price:', error);
      throw new Error('Failed to update food price');
    }
  },

  // Remove assigned food (you'll need to implement this endpoint)
  async removeAssignedFood(assignedFoodId: string): Promise<void> {
    try {
      console.log('🗑️ Removing assigned food:', assignedFoodId);
      
      // You'll need to implement this endpoint on the backend
      await httpClient.delete(`/food-partner/remove-assigned-food/${assignedFoodId}`);
      
      console.log('✅ Assigned food removed successfully');
    } catch (error) {
      console.error('❌ Error removing assigned food:', error);
      throw new Error('Failed to remove assigned food');
    }
  }
};