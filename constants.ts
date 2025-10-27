
import type { Cafe, FoodItem } from './types';

export const CAFES: Cafe[] = [
  { id: 1, name: 'Cozy Corner', location: 'Urban Roast, 1st Floor, Tower A', image: '../../assets/cafes/coffee-shop.jpg', status: 'Open' },
  { id: 2, name: 'Urban Roast', location: '2nd Floor, Tower B', image: '../../assets/cafes/busiesscafe.jpg', status: 'Open' },
  { id: 3, name: 'Fresh Bites', location: 'Ground Floor, Tower C', image: '../../assets/cafes/busiess cafe.jpg', status: 'Closed' },
  { id: 4, name: 'Caffeine Fix', location: '3rd Floor, Tower A', image: 'https://picsum.photos/seed/cafe4/200/200', status: 'Open' },
];

export const FOOD_ITEMS: FoodItem[] = [
  { id: 1, name: 'Chicken Tikka Fry', price: 199.00, image: '../../assets/food items/chickentikka.jpg', cafe: 'Cozy Corner', isVeg: false, category: 'Appetizers' },
  { id: 2, name: 'Egg Rice', price: 59.00, image: '../../assets/food items/eggrice.jpg', cafe: 'Cozy Corner', isVeg: false, category: 'Main Course' },
  { id: 3, name: 'Hot Coffee', price: 40.00, image: '../../assets/food items/hotcoffee.jpg', cafe: 'Urban Roast', isVeg: true, category: 'Beverages' },
  { id: 4, name: 'Green Salad', price: 179.00, image: '../../assets/food items/greensalad.jpg', cafe: 'Fresh Bites', isVeg: true, category: 'Appetizers' },
  { id: 5, name: 'Chicken Noodles', price: 210.00, image: '../../assets/food items/chickennodels.jpg', cafe: 'Cozy Corner', isVeg: false, category: 'Main Course' },
  { id: 6, name: 'Masala Dosa', price: 30.00, image: '../../assets/food items/masaladoasa.jpg', cafe: 'Urban Roast', isVeg: true, category: 'Snacks' },
  { id: 7, name: 'Idly', price: 25.00, image: '../../assets/food items/idaly1.jpg', cafe: 'Urban Roast', isVeg: true, category: 'Snacks' },
  { id: 8, name: 'South Meals', price: 130.00, image: '../../assets/food items/southmeals.jpg', cafe: 'Fresh Bites', isVeg: true, category: 'Main Course' },
  { id: 9, name: 'Paneer Biryani', price: 199.00, image: '../../assets/food items/panieerbiryani.jpg', cafe: 'Cozy Corner', isVeg: true, category: 'Main Course' },
  { id: 10, name: 'Chicken Burger', price: 99.00, image: '../../assets/food items/chicken-burger.jpg', cafe: 'Caffeine Fix', isVeg: false, category: 'Snacks' },
  
];