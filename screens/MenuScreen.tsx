
import React, { useState } from 'react';
import type { Screen } from '../App';
import type { CartItem, FoodItem, Cafe } from '../types';
import { FOOD_ITEMS } from '../constants';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import CartIcon from '../components/icons/CartIcon';

interface MenuScreenProps {
  cafe: Cafe;
  cart: CartItem[];
  navigateTo: (screen: Screen) => void;
  addToCart: (item: FoodItem) => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ cafe, cart, navigateTo, addToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVeg, setIsVeg] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const menuItems = FOOD_ITEMS.filter(item => item.cafe === cafe.name);
  
  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredMenuItems = menuItems
    .filter(item => isVeg ? item.isVeg : true)
    .filter(item => selectedCategory === 'All' ? true : item.category === selectedCategory)
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const cartItemCount = cart.reduce((total, current) => total + current.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-[#FFF9F2]">
      <header className="p-4 sticky top-0 bg-[#FFF9F2] z-10 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigateTo('home')}>
            <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          <div className="relative">
            <button onClick={() => navigateTo('cart')}>
                 <CartIcon className="w-8 h-8 text-gray-700"/>
             </button>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
        </div>
        <div className="text-center">
            <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800">{cafe.name}</h1>
                <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${cafe.status === 'Open' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {cafe.status}
                </span>
            </div>
            <p className="text-sm text-gray-500">{cafe.location}</p>
        </div>
         <div className="mt-4 flex items-center justify-between">
            <input 
                type="text" 
                placeholder="Search your food here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <div className="flex items-center space-x-2 ml-4">
                <button onClick={() => setIsVeg(!isVeg)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isVeg ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isVeg ? 'translate-x-6' : 'translate-x-1'}`}/>
                </button>
                <span className={`font-medium text-sm ${isVeg ? 'text-green-500' : 'text-gray-400'}`}>Veg</span>
            </div>
        </div>
        <div className="mt-4 -mx-4 px-4 overflow-x-auto no-scrollbar">
            <div className="flex space-x-3 py-2">
            {categories.map(category => (
                <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
                >
                {category}
                </button>
            ))}
            </div>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-4">
        {cafe.status === 'Closed' && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4" role="alert">
                <p className="font-bold">Cafe Closed</p>
                <p>This cafe is not accepting orders at this time.</p>
            </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          {filteredMenuItems.length > 0 ? filteredMenuItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm p-2 flex flex-col items-center text-center">
              <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover mb-2"/>
              <div className="flex items-center mb-1">
                <span className={`h-3 w-3 rounded-full border ${item.isVeg ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'}`}></span>
                <p className="font-bold text-sm text-gray-800 ml-2">{item.name}</p>
              </div>
              <p className="text-sm text-gray-600 mb-2">₹ {item.price.toFixed(2)}</p>
              <button 
                onClick={() => addToCart(item)} 
                className="bg-orange-100 text-orange-600 font-bold px-4 py-1 rounded-lg hover:bg-orange-200 text-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                disabled={cafe.status === 'Closed'}
              >
                Add +
              </button>
            </div>
          )) : (
            <div className="col-span-2 text-center text-gray-500 mt-8">
                <p>No items match your filter.</p>
            </div>
          )}
        </div>
      </main>
      
      {cartItemCount > 0 && cafe.status === 'Open' && (
          <div className="p-4 bg-[#FFF9F2] border-t">
               <div className="bg-orange-500 text-white rounded-lg shadow-lg flex justify-between items-center p-3">
                  <p>{cartItemCount} items | ₹ {cart.reduce((acc, cv) => acc + cv.item.price * cv.quantity, 0).toFixed(2)}</p>
                  <button onClick={() => navigateTo('cart')} className="font-bold">View Cart &gt;</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default MenuScreen;