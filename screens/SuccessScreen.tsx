import React from 'react';
import type { Screen } from '../App';
import CheckIcon from '../components/icons/CheckIcon';

interface SuccessScreenProps {
  navigateTo: (screen: Screen) => void;
  clearCart: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ navigateTo, clearCart }) => {
  const handleNavigation = (screen: Screen) => {
    clearCart();
    navigateTo(screen);
  }

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-500/30">
        <CheckIcon className="w-16 h-16 text-white"/>
      </div>
      <h1 className="text-3xl font-bold mb-2">Success!</h1>
      <p className="text-gray-300 mb-8">
        Your order has been placed successfully.
      </p>

      <p className="text-sm text-gray-400 mb-4">
        <button onClick={() => handleNavigation('orders')} className="underline">View Order Details</button> / <button className="underline">Download Receipt</button>
      </p>

      <div className="w-full max-w-xs grid grid-cols-2 gap-4">
        <button onClick={() => handleNavigation('home')} className="bg-orange-500 text-white font-bold py-3 rounded-xl">
          Menu
        </button>
        <button onClick={() => handleNavigation('orders')} className="bg-gray-600 text-white font-bold py-3 rounded-xl">
          My Orders
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;