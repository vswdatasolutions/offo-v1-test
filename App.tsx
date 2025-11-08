import React, { useState } from 'react';
import type { CartItem, OrderDetails, Cafe, Order, FoodItem } from './types';
import { ORDERS_DATA, CAFES } from './constants';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import LocationScreen from './screens/LocationScreen';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import CartScreen from './screens/CartScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import PaymentScreen from './screens/PaymentScreen';
import SuccessScreen from './screens/SuccessScreen';
import OrdersScreen from './screens/OrdersScreen';
import HelpScreen from './screens/HelpScreen';
import ProfileScreen from './screens/ProfileScreen';
import AboutScreen from './screens/AboutScreen';
import MyAccountScreen from './screens/MyAccountScreen';
import PaymentMethodsScreen from './screens/PaymentMethodsScreen';
import FoodItemDetailModal from './components/FoodItemDetailModal';

export type Screen = 'splash' | 'onboarding' | 'login' | 'location' | 'home' | 'menu' | 'cart' | 'schedule' | 'payment' | 'success' | 'orders' | 'help' | 'profile' | 'about' | 'my-account' | 'payment-methods';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('splash');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [location, setLocation] = useState({ city: '', company: '', building: '' });
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [orders, setOrders] = useState<Order[]>(ORDERS_DATA);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [foodDetailItem, setFoodDetailItem] = useState<FoodItem | null>(null);
  const [showClearCartPrompt, setShowClearCartPrompt] = useState(false);
  const [itemToAddAfterClear, setItemToAddAfterClear] = useState<{ item: FoodItem, quantity: number } | null>(null);


  const addToCart = (item: CartItem['item'], quantityToAdd: number = 1) => {
    if (cart.length > 0 && cart[0].item.cafe !== item.cafe) {
        setItemToAddAfterClear({ item, quantity: quantityToAdd });
        setShowClearCartPrompt(true);
        return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd } : cartItem
        );
      }
      return [...prevCart, { item, quantity: quantityToAdd }];
    });
  };

  const handleConfirmClearCartAndAdd = () => {
    if (itemToAddAfterClear) {
      setCart([{ item: itemToAddAfterClear.item, quantity: itemToAddAfterClear.quantity }]);
      setShowClearCartPrompt(false);
      // Close the modal if it's for the item we just added
      if (foodDetailItem && foodDetailItem.id === itemToAddAfterClear.item.id) {
        setFoodDetailItem(null);
      }
      setItemToAddAfterClear(null);
    }
  };

  const handleCancelClearCartAndAdd = () => {
    setItemToAddAfterClear(null);
    setShowClearCartPrompt(false);
  };

  const updateCartQuantity = (itemId: number, newQuantity: number) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        return prevCart.filter(cartItem => cartItem.item.id !== itemId);
      }
      return prevCart.map(cartItem =>
        cartItem.item.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
      );
    });
  };
  
  const clearCart = () => setCart([]);

  const navigateTo = (newScreen: Screen) => setScreen(newScreen);

  const handleViewFoodItem = (item: FoodItem) => setFoodDetailItem(item);
  const handleCloseFoodDetail = () => setFoodDetailItem(null);
  const handleAddToCartAndCloseModal = (item: FoodItem, quantity: number) => {
    const willShowPrompt = cart.length > 0 && cart[0].item.cafe !== item.cafe;
    addToCart(item, quantity);
    if (!willShowPrompt) {
        setFoodDetailItem(null);
    }
  };

  const handleEditSchedule = (order: Order) => {
    setOrderDetails(null); // Clear any new order details
    setOrderToEdit(order);
    navigateTo('schedule');
  };
  
  const handleEditOrderItems = (order: Order) => {
    const cafe = CAFES.find(c => c.name === order.cafe);
    if (!cafe) {
      alert("Cafe not found, cannot edit order.");
      return;
    }
    if (cafe.status === 'Closed') {
      alert("This cafe is currently closed and the order cannot be edited.");
      return;
    }
    setSelectedCafe(cafe);
    setOrderToEdit(order);
    setCart(order.items);
    setIsEditingOrder(true);
    navigateTo('menu');
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prevOrders => 
        prevOrders.map(o => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    // Reset all editing states
    setOrderToEdit(null);
    setIsEditingOrder(false);
    setCart([]);
    navigateTo('orders');
  };

  const confirmOrderItemsUpdate = () => {
    if (!orderToEdit || !cart) return;

    if (cart.length === 0) {
        alert("Cannot update with an empty cart. Please add items or cancel the order from the 'My Orders' screen.");
        return;
    }

    const subtotal = cart.reduce((acc, cartItem) => acc + cartItem.item.price * cartItem.quantity, 0);
    const convenienceFee = 6.00;
    const total = subtotal + convenienceFee;

    const updatedOrder: Order = {
        ...orderToEdit,
        items: cart,
        total,
    };
    handleUpdateOrder(updatedOrder);
  };

  const handleCancelEditOrder = () => {
      setCart([]);
      setOrderToEdit(null);
      setIsEditingOrder(false);
      navigateTo('orders');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen onFinish={() => navigateTo('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onGetStarted={() => navigateTo('login')} />;
      case 'login':
        return <LoginScreen onLoginSuccess={() => navigateTo('location')} navigateTo={navigateTo} />;
      case 'location':
        return <LocationScreen onConfirm={loc => { setLocation(loc); navigateTo('home'); }} navigateTo={navigateTo} />;
      case 'home':
        return <HomeScreen 
                  location={location} 
                  cart={cart} 
                  navigateTo={navigateTo} 
                  addToCart={addToCart} 
                  setSelectedCafe={setSelectedCafe}
                  onViewFoodItem={handleViewFoodItem}
                />;
      case 'menu':
        return <MenuScreen 
                  cafe={selectedCafe!} 
                  cart={cart} 
                  navigateTo={navigateTo} 
                  addToCart={addToCart} 
                  isEditingOrder={isEditingOrder}
                  onCancelEdit={handleCancelEditOrder}
                />;
      case 'cart':
        return <CartScreen 
                  cart={cart}
                  updateCartQuantity={updateCartQuantity}
                  navigateTo={navigateTo}
                  setOrderDetails={setOrderDetails}
                  clearCart={clearCart}
                  isEditingOrder={isEditingOrder}
                  onUpdateOrder={confirmOrderItemsUpdate}
                />;
      case 'schedule':
        return <ScheduleScreen 
                  orderDetails={orderDetails!}
                  setOrderDetails={setOrderDetails}
                  navigateTo={navigateTo}
                  orderToEdit={orderToEdit}
                  onUpdateOrder={handleUpdateOrder}
                />;
      case 'payment':
        return <PaymentScreen
                  orderDetails={orderDetails!}
                  setOrderDetails={setOrderDetails}
                  navigateTo={navigateTo}
                />
      case 'success':
        return <SuccessScreen 
                  navigateTo={navigateTo}
                  clearCart={clearCart}
                  orderDetails={orderDetails}
                />;
      case 'orders':
        return <OrdersScreen 
                  navigateTo={navigateTo} 
                  orders={orders} 
                  setOrders={setOrders} 
                  onEditSchedule={handleEditSchedule} 
                  onEditOrderItems={handleEditOrderItems}
                />;
      case 'help':
        return <HelpScreen navigateTo={navigateTo} />;
      case 'profile':
        return <ProfileScreen navigateTo={navigateTo} />;
      case 'about':
        return <AboutScreen navigateTo={navigateTo} />;
      case 'my-account':
        return <MyAccountScreen navigateTo={navigateTo} />;
      case 'payment-methods':
        return <PaymentMethodsScreen navigateTo={navigateTo} />;
      default:
        return <SplashScreen onFinish={() => navigateTo('onboarding')} />;
    }
  };

  return (
    <div className="bg-gray-100 sm:bg-gray-800 flex justify-center items-center h-full w-full">
      <div className="w-full h-full sm:max-w-md md:max-w-lg lg:max-w-2xl sm:h-[95vh] sm:max-h-[900px] bg-white sm:rounded-3xl sm:shadow-2xl overflow-hidden relative">
        {renderScreen()}
        {foodDetailItem && (
          <FoodItemDetailModal
            item={foodDetailItem}
            onClose={handleCloseFoodDetail}
            onAddToCart={handleAddToCartAndCloseModal}
          />
        )}
        {showClearCartPrompt && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 animate-fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div 
              className="bg-white p-6 rounded-2xl shadow-xl text-center w-4/5 max-w-sm"
            >
              <h2 className="text-lg font-bold mb-2 text-gray-800">Clear Cart?</h2>
              <p className="text-gray-600 mb-6">Your cart has items from another restaurant. Do you want to clear the cart and continue?</p>
              <div className="flex justify-center gap-4">
                <button onClick={handleCancelClearCartAndAdd} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold">Cancel</button>
                <button onClick={handleConfirmClearCartAndAdd} className="px-6 py-2 rounded-lg bg-orange-500 text-white font-semibold">Clear and Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;