
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

export interface ScheduledItem {
    id: number;
    date: Date;
    time: string;
}

export interface OrderDetails {
  items: CartItem[];
  subtotal: number;
  convenienceFee: number;
  total: number;
  schedules?: ScheduledItem[];
  paymentMethod?: string;
  paymentOption?: 'full' | 'partial';
  paymentAmount?: number;
}

export interface OrderItem {
    item: FoodItem;
    quantity: number;
}

export interface Order {
    id: string;
    cafe: string;
    date: Date;
    items: OrderItem[];
    total: number;
    status: 'Delivered' | 'Cancelled' | 'Preparing' | 'Ready for Pickup' | 'Scheduled' | 'Out for Delivery' | 'Accepted' | 'Rejected';
    placedAt: Date;
}
