import React, { useState } from 'react';
import type { Screen } from '../App';
import type { OrderDetails } from '../types';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

interface PaymentScreenProps {
  orderDetails: OrderDetails;
  setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetails | null>>;
  navigateTo: (screen: Screen) => void;
}

const paymentMethods = [
    { name: 'Phone Pe', icon: 'https://i.imgur.com/QnkYdbM.png' },
    { name: 'Google Pay', icon: 'https://i.imgur.com/r4S1eDD.png' },
    { name: 'Paytm', icon: 'https://i.imgur.com/uPiOB06.png' }
];

const PaymentScreen: React.FC<PaymentScreenProps> = ({ orderDetails, setOrderDetails, navigateTo }) => {
  const [selectedPayment, setSelectedPayment] = useState('Phone Pe');

  const handlePlaceOrder = () => {
    setOrderDetails({ ...orderDetails, paymentMethod: selectedPayment });
    navigateTo('success');
  }

  return (
    <div className="flex flex-col h-full bg-[#FFF9F2]">
      <header className="p-4 flex items-center border-b">
        <button onClick={() => navigateTo('cart')}>
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 mx-auto">Payment Method</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-md text-gray-800 mb-2">Order Summary</h3>
          {orderDetails.items.map(({ item, quantity }) => (
            <div key={item.id} className="flex justify-between py-1 text-gray-700">
              <span>{quantity}x {item.name}</span>
              <span>₹{(item.price * quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex justify-between py-1 text-gray-700">
            <span>Convenience fee</span>
            <span>₹{orderDetails.convenienceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 font-bold text-gray-800">
            <span>Total:</span>
            <span>₹{orderDetails.total.toFixed(2)}</span>
          </div>
        </div>

        <h2 className="font-bold text-lg text-gray-800 my-4">Select UPI App</h2>
        <div className="space-y-3">
          {paymentMethods.map(method => (
            <div 
                key={method.name} 
                onClick={() => setSelectedPayment(method.name)}
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer ${selectedPayment === method.name ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}
            >
              <div className="flex items-center">
                <img src={method.icon} alt={method.name} className="h-8 w-auto mr-4" />
                <span className="font-semibold text-gray-700">{method.name}</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.name ? 'border-orange-500' : 'border-gray-300'}`}>
                {selectedPayment === method.name && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-4 border-t">
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-orange-600 transition-colors"
        >
          Place Order
        </button>
      </footer>
    </div>
  );
};

export default PaymentScreen;