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
import FoodItemDetailModal from '../components/FoodItemDetailModal';

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


  const addToCart = (item: CartItem['item']) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
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
  const handleAddToCartAndCloseModal = (item: FoodItem) => {
    addToCart(item);
    setFoodDetailItem(null);
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
      <div className="w-full h-full sm:max-w-sm sm:h-[850px] bg-white sm:rounded-3xl sm:shadow-2xl overflow-hidden relative">
        {renderScreen()}
        {foodDetailItem && (
          <FoodItemDetailModal
            item={foodDetailItem}
            onClose={handleCloseFoodDetail}
            onAddToCart={handleAddToCartAndCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default App;