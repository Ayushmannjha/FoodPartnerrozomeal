export interface Food {
  id: string;
  name: string;
  category: string;
  image?: string;
  price: number;
  description?: string;
  isAvailable?: boolean;
}

export interface FoodCategory {
  id: string;
  name: string;
  description?: string;
}