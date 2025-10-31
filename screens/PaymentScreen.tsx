import React, { useState, useEffect } from 'react';
import type { Screen } from '../App';
import type { OrderDetails } from '../types';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

type PaymentMethodName = 'Phone Pe' | 'Google Pay' | 'Paytm';

const paymentMethods: { name: PaymentMethodName; icon: string }[] = [
    { name: 'Phone Pe', icon: '../../assets/icons/phone pe.jpeg' },
    // { name: 'Google Pay', icon: '../../assets/icons/g_pay.png' },
    // { name: 'Paytm', icon: '../../assets/icons/paytm.png' }
];

// New component for the payment animation
const PaymentAnimation: React.FC<{ 
    orderDetails: OrderDetails; 
    onComplete: () => void;
    method: PaymentMethodName;
}> = ({ orderDetails, onComplete, method }) => {
    const [status, setStatus] = useState<'processing' | 'success'>('processing');

    const themes = {
        'Phone Pe': {
            name: 'PhonePe',
            logo: '../../assets/icons/phone pe.jpeg',
            bgColor: 'bg-[#4F2683]',
            textColor: 'text-white',
            subTextColor: 'text-gray-300',
            spinnerBg: 'bg-white/20',
            spinnerFg: 'text-white',
            successBg: 'bg-green-500',
            footerText: 'Secured by PhonePe'
        },
        // 'Google Pay': {
        //     name: 'Google Pay',
        //     logo: '../../assets/icons/g_pay.png',
        //     bgColor: 'bg-white',
        //     textColor: 'text-gray-800',
        //     subTextColor: 'text-gray-500',
        //     spinnerBg: 'bg-blue-100',
        //     spinnerFg: 'text-blue-600',
        //     successBg: 'bg-green-500',
        //     footerText: 'Secured by Google'
        // },
        // 'Paytm': {
        //     name: 'Paytm',
        //     logo: '../../assets/icons/paytm.png',
        //     bgColor: 'bg-[#002E6E]',
        //     textColor: 'text-white',
        //     subTextColor: 'text-gray-300',
        //     spinnerBg: 'bg-white/20',
        //     spinnerFg: 'text-white',
        //     successBg: 'bg-green-500',
        //     footerText: 'Paytm Secured'
        // }
    };

    const theme = themes[method];

    useEffect(() => {
        const processTimer = setTimeout(() => {
            setStatus('success');
        }, 3000); // Simulate 3 seconds of processing time

        return () => clearTimeout(processTimer);
    }, []);

    useEffect(() => {
        if (status === 'success') {
            const successTimer = setTimeout(() => {
                onComplete();
            }, 2000); // Show success message for 2 seconds
            return () => clearTimeout(successTimer);
        }
    }, [status, onComplete]);

    return (
    <div
      className={`absolute inset-0 ${theme.bgColor} ${theme.textColor} flex flex-col items-center justify-center p-6 z-20 animate-fade-in`}
    >
      {/* Header (logo at top left) */}
      <div className="absolute top-6 left-6 flex items-center">
        <img src={theme.logo} alt={theme.name} className="h-8" />
      </div>

      {/* ✅ Centered Main Content */}
      <main className="flex flex-col items-center justify-center text-center">
        {status === 'processing' && (
          <>
            <div
              className={`w-20 h-20 rounded-full ${theme.spinnerBg} flex items-center justify-center animate-pulse-slow mb-6`}
            >
              <svg
                className={`w-12 h-12 ${theme.spinnerFg} animate-spin`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p className="text-lg">Processing Payment</p>
            <p className={`text-sm ${theme.subTextColor} mt-2`}>Paying OFFO</p>
            <p className="text-3xl font-bold mt-1">
              ₹{orderDetails.total.toFixed(2)}
            </p>
          </>
        )}

        {status === 'success' && (
          <div className="animate-fade-in flex flex-col items-center justify-center">
            {/* ✅ Checkmark icon perfectly centered */}
            <div
              className={`w-20 h-20 rounded-full ${theme.successBg} flex items-center justify-center mb-6`}
            >
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  className="animate-draw-check"
                />
              </svg>
            </div>
            <p className="text-xl font-semibold">Payment Successful</p>
            <p className={`text-sm ${theme.subTextColor} mt-2`}>You paid OFFO</p>
            <p className="text-3xl font-bold mt-1">
              ₹{orderDetails.total.toFixed(2)}
            </p>
          </div>
        )}
      </main>

      {/* Footer text fixed at bottom */}
      <footer className="absolute bottom-6 text-center w-full">
        <p className="text-xs text-gray-300">{theme.footerText}</p>
      </footer>
    </div>
  );
};


interface PaymentScreenProps {
  orderDetails: OrderDetails;
  setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetails | null>>;
  navigateTo: (screen: Screen) => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ orderDetails, setOrderDetails, navigateTo }) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodName>('Phone Pe');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePlaceOrder = () => {
    setIsProcessingPayment(true);
  };

  const handlePaymentComplete = () => {
    setOrderDetails({ ...orderDetails, paymentMethod: selectedPayment });
    navigateTo('success');
  }

  return (
    <div className="flex flex-col h-full bg-[#FFF9F2] relative">
      {isProcessingPayment ? (
        <PaymentAnimation 
            orderDetails={orderDetails} 
            onComplete={handlePaymentComplete}
            method={selectedPayment}
        />
      ) : (
        <>
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

          <footer className="p-4 border-t bg-white">
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-orange-600 transition-colors"
            >
              Place Order
            </button>
          </footer>
        </>
      )}
    </div>
  );
};

export default PaymentScreen;