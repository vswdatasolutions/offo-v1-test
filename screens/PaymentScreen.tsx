import React, { useState, useEffect } from 'react';
import type { Screen } from '../App';
import type { OrderDetails } from '../types';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import CheckIcon from '../components/icons/CheckIcon';
import ScrollableContainer from '../components/ScrollableContainer';

const phonePeMethod = { name: 'Phone Pe', icon: '../../assets/icons/phone pe.jpeg' };

// FIX: Defined the missing 'PaymentScreenProps' interface.
interface PaymentScreenProps {
  orderDetails: OrderDetails;
  setOrderDetails: (details: OrderDetails | null) => void;
  navigateTo: (screen: Screen) => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ orderDetails, setOrderDetails, navigateTo }) => {
  const [selectedPayment] = useState('Phone Pe');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  useEffect(() => {
    // FIX: Use `ReturnType<typeof setTimeout>` which correctly resolves to `number` in a browser environment, instead of the Node.js-specific `NodeJS.Timeout`.
    let timer: ReturnType<typeof setTimeout>;
    if (paymentStatus === 'processing') {
      timer = setTimeout(() => {
        setPaymentStatus('success');
      }, 2000); // 2 seconds for processing
    } else if (paymentStatus === 'success') {
      timer = setTimeout(() => {
        navigateTo('success');
      }, 1500); // 1.5 seconds to show success
    }
    return () => clearTimeout(timer);
  }, [paymentStatus, navigateTo]);


  const amountToPay = orderDetails.total;

  const handlePlaceOrder = () => {
    setOrderDetails({ 
      ...orderDetails, 
      paymentMethod: selectedPayment,
      paymentOption: 'full',
      paymentAmount: amountToPay,
    });
    setPaymentStatus('processing');
  }

  if (paymentStatus !== 'idle') {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center p-8 text-center animate-fade-in">
        {paymentStatus === 'processing' && (
          <>
            <img src={phonePeMethod.icon} alt={selectedPayment} className="h-20 w-auto mb-6"/>
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-bold text-gray-800">Processing Payment...</h2>
            <p className="text-gray-500">Redirecting to {selectedPayment}</p>
          </>
        )}
        {paymentStatus === 'success' && (
          <div className="animate-fade-in">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-500/30 mx-auto">
                <CheckIcon className="w-16 h-16 text-white"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
            <p className="text-gray-500 mt-2">Preparing your order summary...</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#FFF9F2]">
      <header className="p-4 flex items-center border-b">
        <button onClick={() => navigateTo(orderDetails.schedules ? 'schedule' : 'cart')}>
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 mx-auto">Payment Method</h1>
      </header>

      <ScrollableContainer className="p-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border mb-6">
            <h2 className="font-bold text-lg text-gray-800 mb-3 border-b pb-2">Order Summary</h2>
            <div className="space-y-2 text-sm text-gray-600">
                {orderDetails.items.map(({ item, quantity }) => (
                    <div key={item.id} className="flex justify-between">
                        <span className="truncate pr-2">{quantity}x {item.name}</span>
                        <span>₹ {(item.price * quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <hr className="my-2"/>
            <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span>Item Subtotal</span>
                    <span>₹ {orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Convenience Fee</span>
                    <span>₹ {orderDetails.convenienceFee.toFixed(2)}</span>
                </div>
                {orderDetails.schedules && orderDetails.schedules.length > 1 &&
                    <div className="flex justify-between font-semibold text-gray-700">
                        <span>Total for 1 day</span>
                        <span>₹ {(orderDetails.subtotal + orderDetails.convenienceFee).toFixed(2)}</span>
                    </div>
                }
            </div>

            {orderDetails.schedules && orderDetails.schedules.length > 1 &&
                <div className="mt-2 pt-2 border-t text-sm">
                    <div className="flex justify-between font-semibold text-gray-700">
                        <span>No. of scheduled days</span>
                        <span>x {orderDetails.schedules.length}</span>
                    </div>
                </div>
            }

            <div className="flex justify-between font-bold text-base text-gray-800 pt-2 mt-2 border-t">
                <span>Amount to Pay</span>
                <span>₹ {orderDetails.total.toFixed(2)}</span>
            </div>
        </div>

        <h2 className="font-bold text-lg text-gray-800 my-4">Payment via UPI</h2>
        <div className="space-y-3">
            <div
                className="flex items-center justify-between p-4 rounded-lg border border-orange-500 bg-orange-50"
            >
              <div className="flex items-center">
                <img src={phonePeMethod.icon} alt={phonePeMethod.name} className="h-8 w-auto mr-4" />
                <span className="font-semibold text-gray-700">{phonePeMethod.name}</span>
              </div>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-orange-500">
                <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500">
                You will be redirected to the Phone Pe app to complete your payment.
            </p>
        </div>
      </ScrollableContainer>

      <footer className="p-4 border-t bg-white">
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-orange-600 transition-colors"
        >
          Place Order - ₹{amountToPay.toFixed(2)}
        </button>
      </footer>
    </div>
  );
};

export default PaymentScreen;