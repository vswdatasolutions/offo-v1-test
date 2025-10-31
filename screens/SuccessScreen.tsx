import React from 'react';
import type { Screen } from '../App';
import type { OrderDetails } from '../types';
import CheckIcon from '../components/icons/CheckIcon';

interface SuccessScreenProps {
  navigateTo: (screen: Screen) => void;
  clearCart: () => void;
  orderDetails: OrderDetails | null;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ navigateTo, clearCart, orderDetails }) => {
  const handleNavigation = (screen: Screen) => {
    clearCart();
    navigateTo(screen);
  };

  const handleDownloadReceipt = () => {
    if (!orderDetails) {
      alert("Order details not available for download.");
      return;
    }

    const orderId = `OFFO-${Math.floor(Math.random() * 90000) + 10000}`;
    const today = new Date().toLocaleString();

    let receiptContent = `OFFO - Order Receipt\n`;
    receiptContent += `---------------------\n`;
    receiptContent += `Order ID: ${orderId}\n`;
    receiptContent += `Date: ${today}\n\n`;

    if (orderDetails.schedules && orderDetails.schedules.length > 0) {
      receiptContent += `This is a scheduled order for ${orderDetails.schedules.length} day(s):\n`;
      orderDetails.schedules.forEach(schedule => {
        const scheduleDate = schedule.date.toLocaleDateString('en-GB'); // DD/MM/YYYY
        receiptContent += `- ${scheduleDate} at ${schedule.time}\n`;
      });
      receiptContent += `\nItems per order:\n`;
    } else {
      receiptContent += `Items:\n`;
    }

    orderDetails.items.forEach(cartItem => {
      const itemTotal = cartItem.item.price * cartItem.quantity;
      receiptContent += `- ${cartItem.quantity} x ${cartItem.item.name}: ₹${itemTotal.toFixed(2)}\n`;
    });

    receiptContent += `\n---------------------\n`;
    receiptContent += `Subtotal: ₹${orderDetails.subtotal.toFixed(2)}\n`;
    receiptContent += `Convenience Fee: ₹${orderDetails.convenienceFee.toFixed(2)}\n`;
    if (orderDetails.schedules && orderDetails.schedules.length > 0) {
        const perOrderTotal = orderDetails.subtotal + orderDetails.convenienceFee;
        receiptContent += `Total per order: ₹${perOrderTotal.toFixed(2)}\n\n`;
        receiptContent += `GRAND TOTAL for ${orderDetails.schedules.length} orders: ₹${orderDetails.total.toFixed(2)}\n`;
    } else {
        receiptContent += `Total: ₹${orderDetails.total.toFixed(2)}\n`;
    }
    receiptContent += `Payment Method: ${orderDetails.paymentMethod || 'N/A'}\n\n`;
    receiptContent += `Thank you for your order!`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OFFO-Receipt-${orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        <button onClick={() => handleNavigation('orders')} className="underline">View Order Details</button> / <button onClick={handleDownloadReceipt} className="underline">Download Receipt</button>
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