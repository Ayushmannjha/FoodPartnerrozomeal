export interface AssignedFood {
  id: string;
  food: Food;
  foodPartner: FoodPartner;
}

export interface AssignedFoodResponse {
  Assigned_food_details: AssignedFood[];
  sub: string;
  iat: number;
}

export interface Food {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
}

export interface FoodPartner {
  userId: string;
  name: string;
  state: string;
  city: string;
  address: string;
  licenseNumber: string;
  certifications: string;
  pincode: number;
}

// For easier display/management
export interface FlattenedAssignedFood {
  id: string;
  foodId: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  foodPartnerId: string;
  foodPartnerName: string;
}