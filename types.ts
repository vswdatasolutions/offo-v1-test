
export interface FoodItem {
  id: number;
  name: string;
  price: number;
  image: string;
  cafe: string;
  isVeg: boolean;
  category: 'Appetizers' | 'Main Course' | 'Desserts' | 'Beverages' | 'Snacks';
}

export interface Cafe {
  id: number;
  name: string;
  location: string;
  image: string;
  status: 'Open' | 'Closed';
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
}

export interface OrderDetails {
  items: CartItem[];
  subtotal: number;
  convenienceFee: number;
  total: number;
  scheduledTime?: string;
  scheduledDate?: Date;
  paymentMethod?: string;
}