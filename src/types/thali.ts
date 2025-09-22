export interface Thali {
  id: string;
  name: string;
  foodIds: string[];
  image?: string;
  price: number;
  description?: string;
  isAvailable?: boolean;
}

export interface ThaliDetails extends Thali {
  foods: Array<{
    id: string;
    name: string;
    image?: string;
  }>;
}