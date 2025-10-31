import React, { useState } from 'react';
import type { Screen } from '../App';
import BottomNav from '../components/BottomNav';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import { FOOD_ITEMS } from '../constants';
import type { FoodItem } from '../types';

interface OrderItem {
    item: FoodItem;
    quantity: number;
}

interface Order {
    id: string;
    cafe: string;
    date: string;
    items: OrderItem[];
    total: number;
    status: 'Delivered' | 'Cancelled' | 'Ongoing' | 'Scheduled' | 'Preparing' | 'Ready to Take';
    placedAt: Date;
}

const mockOrders: Order[] = [
    {
        id: 'ODS56781',
        cafe: 'Cozy Corner',
        date: '28 Jun 2024, 01:00 PM',
        items: [
            { item: FOOD_ITEMS[8], quantity: 1 }, // Paneer Biryani
            { item: FOOD_ITEMS[2], quantity: 1 }, // Hot Coffee
        ],
        total: FOOD_ITEMS[8].price + FOOD_ITEMS[2].price,
        status: 'Scheduled',
        placedAt: new Date(),
    },
    {
        id: 'ODS56782',
        cafe: 'Fresh Bites',
        date: '30 Jun 2024, 12:00 PM',
        items: [
            { item: FOOD_ITEMS[3], quantity: 2 }, // Green Salad
        ],
        total: FOOD_ITEMS[3].price * 2,
        status: 'Scheduled',
        placedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Placed yesterday
    },
    {
        id: 'OD12349',
        cafe: 'Urban Roast',
        date: '26 Jun 2024, 10:15 AM',
        items: [
            { item: FOOD_ITEMS[2], quantity: 2 }, // Hot Coffee
        ],
        total: FOOD_ITEMS[2].price * 2,
        status: 'Ongoing',
        placedAt: new Date(Date.now() - 2 * 60 * 1000), // Placed 2 minutes ago for testing
    },
    {
        id: 'OD12350',
        cafe: 'Caffeine Fix',
        date: '26 Jun 2024, 10:25 AM',
        items: [
            { item: FOOD_ITEMS[9], quantity: 1 }, // Chicken Burger
        ],
        total: FOOD_ITEMS[9].price,
        status: 'Preparing',
        placedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    },
    {
        id: 'OD12351',
        cafe: 'Cozy Corner',
        date: '26 Jun 2024, 10:20 AM',
        items: [
            { item: FOOD_ITEMS[1], quantity: 1 }, // Chicken Tikka Fry
        ],
        total: FOOD_ITEMS[1].price,
        status: 'Ready to Take',
        placedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
    },
    {
        id: 'OD12352',
        cafe: 'Fresh Bites',
        date: '26 Jun 2024, 10:30 AM',
        items: [
            { item: FOOD_ITEMS[7], quantity: 1 }, // South Meals
        ],
        total: FOOD_ITEMS[7].price,
        status: 'Preparing',
        placedAt: new Date(Date.now() - 3 * 60 * 1000), // 3 mins ago
    },
    {
        id: 'OD12345',
        cafe: 'Cozy Corner',
        date: '25 Jun 2024, 12:30 PM',
        items: [
            { item: FOOD_ITEMS[0], quantity: 1 }, // Chicken Tikka Fry
            { item: FOOD_ITEMS[4], quantity: 1 }, // Chicken Noodles
        ],
        total: FOOD_ITEMS[0].price + FOOD_ITEMS[4].price,
        status: 'Delivered',
        placedAt: new Date('2024-06-25T12:30:00'),
    },
    {
        id: 'OD12346',
        cafe: 'Urban Roast',
        date: '24 Jun 2024, 01:00 PM',
        items: [
            { item: FOOD_ITEMS[5], quantity: 1 }, // Masala Dosa
        ],
        total: FOOD_ITEMS[5].price,
        status: 'Delivered',
        placedAt: new Date('2024-06-24T13:00:00'),
    },
    {
        id: 'OD12347',
        cafe: 'Fresh Bites',
        date: '22 Jun 2024, 07:00 PM',
        items: [
            { item: FOOD_ITEMS[3], quantity: 1 }, // Green Salad
            { item: FOOD_ITEMS[7], quantity: 1 }, // South Meals
        ],
        total: FOOD_ITEMS[3].price + FOOD_ITEMS[7].price,
        status: 'Cancelled',
        placedAt: new Date('2024-06-22T19:00:00'),
    },
    {
        id: 'OD12348',
        cafe: 'Caffeine Fix',
        date: '20 Jun 2024, 09:00 AM',
        items: [
            { item: FOOD_ITEMS[9], quantity: 2 }, // Chicken Burger
            { item: FOOD_ITEMS[2], quantity: 1 }, // Hot Coffee
        ],
        total: (FOOD_ITEMS[9].price * 2) + FOOD_ITEMS[2].price,
        status: 'Delivered',
        placedAt: new Date('2024-06-20T09:00:00'),
    },
];


interface OrdersScreenProps {
  navigateTo: (screen: Screen) => void;
}

const OrderStatusPill: React.FC<{ status: string }> = ({ status }) => {
  const baseClasses = "text-xs font-semibold px-2.5 py-1 rounded-full";
  const isBlinking = status === 'Ongoing' || status === 'Scheduled' || status === 'Preparing' || status === 'Ready to Take';
  const blinkingClass = isBlinking ? 'animate-blink' : '';

  switch (status) {
    case 'Delivered':
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
    case 'Cancelled':
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
    case 'Scheduled':
      return <span className={`${baseClasses} ${blinkingClass} bg-blue-100 text-blue-800`}>{status}</span>;
    case 'Preparing':
        return <span className={`${baseClasses} ${blinkingClass} bg-orange-100 text-orange-800`}>{status}</span>;
    case 'Ready to Take':
        return <span className={`${baseClasses} ${blinkingClass} bg-purple-100 text-purple-800`}>Ready to Take</span>;
    case 'Ongoing':
    default:
      return <span className={`${baseClasses} ${blinkingClass} bg-yellow-100 text-yellow-800`}>{status}</span>;
  }
};

const OrdersScreen: React.FC<OrdersScreenProps> = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = useState<'scheduled' | 'ongoing' | 'past'>('ongoing');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };
  
  const handleCancelClick = (orderId: string) => {
    setOrderToCancel(orderId);
  };

  const confirmCancel = () => {
    if (!orderToCancel) return;
    setOrders(currentOrders =>
      currentOrders.map(order =>
        order.id === orderToCancel ? { ...order, status: 'Cancelled' } : order
      )
    );
    setOrderToCancel(null);
  };

  const scheduledOrders = orders.filter(o => o.status === 'Scheduled');
  const ongoingOrders = orders.filter(o => o.status === 'Ongoing' || o.status === 'Preparing' || o.status === 'Ready to Take');
  const pastOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');

  const ordersToDisplay = activeTab === 'scheduled'
      ? scheduledOrders
      : activeTab === 'ongoing'
      ? ongoingOrders
      : pastOrders;


  return (
    <div className="flex flex-col h-full bg-[#FFF9F2] relative">
      {orderToCancel && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20" aria-modal="true" role="dialog">
            <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-4/5">
                <h2 className="text-lg font-bold mb-2 text-gray-800">Cancel Order?</h2>
                <p className="text-gray-600 mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => setOrderToCancel(null)} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold">No, Keep It</button>
                    <button onClick={confirmCancel} className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold">Yes, Cancel</button>
                </div>
            </div>
        </div>
      )}
      <header className="p-4 flex items-center border-b">
        <div className="w-1/5">
            <button onClick={() => navigateTo('home')}>
                <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
            </button>
        </div>
        <div className="w-3/5 text-center">
            <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
        </div>
        <div className="w-1/5"></div>
      </header>
      
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`w-1/3 py-3 text-center font-semibold transition-colors ${activeTab === 'scheduled' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
        >
          Scheduled
        </button>
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`w-1/3 py-3 text-center font-semibold transition-colors ${activeTab === 'ongoing' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
        >
          Ongoing
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`w-1/3 py-3 text-center font-semibold transition-colors ${activeTab === 'past' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
        >
          Past Orders
        </button>
      </div>

      <main className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
        {ordersToDisplay.length > 0 ? (
          ordersToDisplay.map(order => {
            const isCancellable = (order.status === 'Ongoing' && (new Date().getTime() - order.placedAt.getTime()) < 5 * 60 * 1000) || order.status === 'Scheduled';

            return (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{order.cafe}</h3>
                  <p className="text-xs text-gray-500">{order.id} | {order.date}</p>
                </div>
                <OrderStatusPill status={order.status} />
              </div>
        
              <div className="mt-3 flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-800">Total: ₹{order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{order.items.reduce((sum, i) => sum + i.quantity, 0)} items</p>
              </div>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedOrderId === order.id ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                <div className="border-t pt-3">
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">Order Items</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                        {order.items.map(({ item, quantity }) => (
                            <li key={item.id} className="flex justify-between">
                                <span className="truncate pr-2">{quantity} x {item.name}</span>
                                <span>₹{(item.price * quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
              </div>
        
              <div className="border-t mt-3 pt-3 flex justify-end space-x-3">
                 <button 
                   onClick={() => toggleOrderDetails(order.id)}
                   className="text-sm font-semibold text-gray-600 px-4 py-2 rounded-lg border hover:bg-gray-50 flex items-center"
                 >
                    {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 ml-2 transition-transform ${expandedOrderId === order.id ? 'transform rotate-180' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                 </button>
                 {isCancellable && (
                    <button 
                        onClick={() => handleCancelClick(order.id)}
                        className="text-sm font-semibold text-red-600 bg-red-100 px-4 py-2 rounded-lg hover:bg-red-200"
                    >
                        Cancel Order
                    </button>
                 )}
                 {order.status === 'Delivered' && (
                    <button className="text-sm font-semibold text-orange-600 bg-orange-100 px-4 py-2 rounded-lg hover:bg-orange-200">
                        Reorder
                    </button>
                 )}
              </div>
            </div>
            );
          })
        ) : (
            <div className="text-center pt-20">
                <p className="text-gray-500 text-lg">
                    {activeTab === 'ongoing' ? 'No ongoing orders.' : 
                     activeTab === 'scheduled' ? 'No scheduled orders.' : 'No past orders found.'}
                </p>
                <p className="text-gray-400 mt-2">
                    {activeTab === 'ongoing' ? 'Active orders will appear here.' : 
                     activeTab === 'scheduled' ? 'Your future scheduled orders will appear here.' : 'Your previous orders will be shown here.'}
                </p>
            </div>
        )}
      </main>

      <BottomNav activeScreen="orders" navigateTo={navigateTo} />
    </div>
  );
};

export default OrdersScreen;