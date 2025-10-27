import React, { useState } from 'react';
import type { Screen } from '../App';
import type { CartItem, FoodItem, Cafe } from '../types';
import { CAFES, FOOD_ITEMS } from '../constants';
import BottomNav from '../components/BottomNav';
import CartIcon from '../components/icons/CartIcon';

interface HomeScreenProps {
  location: { city: string, company: string, building: string };
  cart: CartItem[];
  navigateTo: (screen: Screen) => void;
  addToCart: (item: FoodItem) => void;
  setSelectedCafe: (cafe: Cafe) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ location, cart, navigateTo, addToCart, setSelectedCafe }) => {
  const [isVeg, setIsVeg] = useState(false);

  const handleCafeClick = (cafe: Cafe) => {
    if (cafe.status === 'Closed') {
      alert(`${cafe.name} is currently closed.`);
      return;
    }
    setSelectedCafe(cafe);
    navigateTo('menu');
  };

  const filteredFoodItems = FOOD_ITEMS.filter(item => isVeg ? item.isVeg : true);
  const cartItemCount = cart.reduce((total, current) => total + current.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-[#FFF9F2]">
      <div className="flex-shrink-0">
        <header className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">{location.company} {location.building}</p>
              <h1 className="font-bold text-gray-800">Hey, Good morning!</h1>
            </div>
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
          <div className="mt-4 flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-800">Discover tasty foods</h2>
              <div className="flex items-center space-x-2">
                  <span className={`font-medium ${!isVeg ? 'text-orange-500' : 'text-gray-400'}`}>All</span>
                  <button onClick={() => setIsVeg(!isVeg)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isVeg ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isVeg ? 'translate-x-6' : 'translate-x-1'}`}/>
                  </button>
                  <span className={`font-medium ${isVeg ? 'text-green-500' : 'text-gray-400'}`}>Veg</span>
              </div>
          </div>
        </header>

        {/* Food Marquee */}
        <div className="overflow-x-auto no-scrollbar py-2">
          <div className="flex space-x-4 px-4">
            {filteredFoodItems.map(item => (
              <div key={item.id} className="flex-shrink-0 w-40 bg-white p-3 rounded-xl shadow-sm flex flex-col">
                <img src={item.image} alt={item.name} className="w-full h-24 rounded-lg object-cover mb-2"/>
                <div className="flex-grow">
                  <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.cafe}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-sm font-semibold text-gray-800">₹{item.price.toFixed(2)}</p>
                    <button onClick={() => addToCart(item)} className="bg-orange-100 text-orange-600 font-bold px-3 py-1 text-xs rounded-lg hover:bg-orange-200">
                      + Add
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cafe List */}
      <main className="flex-1 overflow-y-auto px-4 pb-20 no-scrollbar">
        <h2 className="font-bold text-lg text-gray-800 my-4">Cafes</h2>
        <div className="space-y-3">
          {CAFES.map((cafe) => (
            <div 
              key={cafe.id}
              onClick={() => handleCafeClick(cafe)} 
              className="flex items-center bg-white p-2 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleCafeClick(cafe)}
            >
              <img src={cafe.image} alt={cafe.name} className="w-16 h-16 rounded-lg object-cover"/>
              <div className="ml-4 flex-grow min-w-0">
                  <p className="font-bold text-gray-800 truncate">{cafe.name}</p>
                  <p className="text-sm text-gray-500 mt-1 truncate">{cafe.location}</p>
              </div>
              <div className={`flex-shrink-0 ml-2 text-xs font-bold px-2 py-1 rounded-full text-white ${cafe.status === 'Open' ? 'bg-green-500' : 'bg-red-500'}`}>
                  {cafe.status}
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {cartItemCount > 0 && (
          <div className="absolute bottom-16 left-0 right-0 p-4">
               <div className="bg-orange-500 text-white rounded-lg shadow-lg flex justify-between items-center p-3">
                  <p>{cartItemCount} items | ₹ {cart.reduce((acc, cv) => acc + cv.item.price * cv.quantity, 0).toFixed(2)}</p>
                  <button onClick={() => navigateTo('cart')} className="font-bold">View Cart &gt;</button>
              </div>
          </div>
      )}

      <BottomNav activeScreen="home" navigateTo={navigateTo} />
    </div>
  );
};

export default HomeScreen;