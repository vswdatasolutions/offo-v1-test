
import React, { useState, useEffect } from 'react';
import type { Screen } from '../App';
import BottomNav from '../components/BottomNav';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import type { Order } from '../types';
import ScrollableContainer from '../components/ScrollableContainer';
import OrderStatusTracker from '../components/OrderStatusTracker';

interface OrdersScreenProps {
  navigateTo: (screen: Screen) => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  onEditSchedule: (order: Order) => void;
  onEditOrderItems: (order: Order) => void;
}

const OrderStatusPill: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const baseClasses = "text-xs font-semibold px-2.5 py-1 rounded-full";
  switch (status) {
    case 'Delivered':
      return <span className={`${baseClasses} bg-gray-200 text-gray-800`}>Completed</span>;
    case 'Cancelled':
    case 'Rejected':
      return <span className={`${baseClasses} bg-gray-200 text-gray-800`}>{status}</span>;
    case 'Scheduled':
      return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>{status}</span>;
    case 'Accepted':
      return <span className={`${baseClasses} bg-orange-100 text-orange-800 animate-pulse`}>{status}</span>;
    case 'Preparing':
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 animate-pulse`}>{status}</span>;
    case 'Ready for Pickup':
       return <span className={`${baseClasses} bg-orange-100 text-orange-800 relative flex items-center`}>
          <span className="absolute -left-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
          <span className="ml-3">{status}</span>
      </span>;
    case 'Out for Delivery':
      return <span className={`${baseClasses} bg-indigo-100 text-indigo-800 animate-pulse`}>Out for Pickup</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
  }
};

const OrdersScreen: React.FC<OrdersScreenProps> = ({ navigateTo, orders, setOrders, onEditSchedule, onEditOrderItems }) => {
  const [activeTab, setActiveTab] = useState<'scheduled' | 'ongoing' | 'past'>('past');
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      let hasUpdates = false;

      const updatedOrders = orders.map(order => {
        const timeSincePlaced = now - new Date(order.placedAt).getTime();

        if (order.status === 'Accepted' && timeSincePlaced > 1 * 60 * 1000) { // 1 minute
          hasUpdates = true;
          return { ...order, status: 'Preparing' as const };
        }
        if (order.status === 'Preparing' && timeSincePlaced > 3 * 60 * 1000) { // 3 minutes total
          hasUpdates = true;
          return { ...order, status: 'Ready for Pickup' as const };
        }
        if (order.status === 'Ready for Pickup' && timeSincePlaced > 5 * 60 * 1000) { // 5 minutes total
          hasUpdates = true;
          return { ...order, status: 'Out for Delivery' as const };
        }
        return order;
      });

      if (hasUpdates) {
        setOrders(updatedOrders);
      }
    }, 15000); // Check every 15 seconds for updates

    return () => clearInterval(interval);
  }, [orders, setOrders]);

  
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
  const ongoingOrders = orders.filter(o => ['Accepted', 'Preparing', 'Ready for Pickup', 'Out for Delivery'].includes(o.status));
  const pastOrders = orders.filter(o => ['Delivered', 'Cancelled', 'Rejected'].includes(o.status));

  const ordersToDisplay = activeTab === 'scheduled'
      ? scheduledOrders
      : activeTab === 'ongoing'
      ? ongoingOrders
      : pastOrders;


  return (
    <div className="flex flex-col h-full bg-gray-100 relative">
      {orderToCancel && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20" aria-modal="true" role="dialog">
            <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-4/5">
                <h2 className="text-lg font-bold mb-2 text-gray-800">Cancel Order?</h2>
                <p className="text-gray-600 mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => setOrderToCancel(null)} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold">No, Keep It</button>
                    <button onClick={confirmCancel} className="px-6 py-2 rounded-lg bg-orange-500 text-white font-semibold">Yes, Cancel</button>
                </div>
            </div>
        </div>
      )}
      <header className="p-4 flex items-center border-b flex-shrink-0">
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
      
      <div className="flex border-b flex-shrink-0">
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

      <ScrollableContainer className="p-4 space-y-4 pb-20">
        {ordersToDisplay.length > 0 ? (
          ordersToDisplay.map(order => {
            const isCancellable = (['Accepted', 'Preparing', 'Scheduled'].includes(order.status) && (new Date().getTime() - order.placedAt.getTime()) < 5 * 60 * 1000);
            const formattedDate = order.date.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
            
            return (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{order.cafe}</h3>
                  <p className="text-xs text-gray-500">{order.id} | {formattedDate}</p>
                </div>
                <OrderStatusPill status={order.status} />
              </div>

              {activeTab === 'ongoing' && (
                  <div className="mt-4">
                      <OrderStatusTracker status={order.status} />
                  </div>
              )}
        
              <div className="mt-3 flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-800">Total: ₹{order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{order.items.reduce((sum, i) => sum + i.quantity, 0)} items</p>
              </div>
              
              <div className="mt-3"> {/* Order items are now always visible */}
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
        
              <div className="border-t mt-3 pt-3 flex justify-between items-center flex-wrap gap-2">
                 {/* Removed View Details / Hide Details button */}
                 <div className="flex items-center flex-wrap justify-end gap-2">
                     {order.status === 'Scheduled' && (
                        <>
                          <button 
                              onClick={() => onEditSchedule(order)}
                              className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-2 rounded-lg hover:bg-orange-200"
                          >
                              Edit Schedule
                          </button>
                          <button 
                              onClick={() => onEditOrderItems(order)}
                              className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-2 rounded-lg hover:bg-green-200"
                          >
                              Edit Items
                          </button>
                        </>
                     )}
                     {isCancellable && (
                        <button 
                            onClick={() => handleCancelClick(order.id)}
                            className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-2 rounded-lg hover:bg-orange-200"
                        >
                            Cancel Order
                        </button>
                     )}
                     {order.status === 'Delivered' && (
                        <button className="text-sm font-semibold text-orange-500 bg-orange-500/20 px-3 py-2 rounded-lg hover:bg-orange-500/30">
                            Reorder
                        </button>
                     )}
                 </div>
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
      </ScrollableContainer>

      <BottomNav activeScreen="orders" navigateTo={navigateTo} />
    </div>
  );
};

export default OrdersScreen;
