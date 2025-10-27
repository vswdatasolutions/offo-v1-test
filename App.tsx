import React, { useState, useMemo } from 'react';
import type { CartItem, OrderDetails, Cafe } from './types';
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

export type Screen = 'splash' | 'onboarding' | 'login' | 'location' | 'home' | 'menu' | 'cart' | 'schedule' | 'payment' | 'success' | 'orders' | 'help' | 'profile' | 'about' | 'my-account' | 'payment-methods';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('splash');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [location, setLocation] = useState({ city: '', company: '', building: '' });
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

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

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen onFinish={() => navigateTo('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onGetStarted={() => navigateTo('login')} />;
      case 'login':
        return <LoginScreen onLoginSuccess={() => navigateTo('location')} />;
      case 'location':
        return <LocationScreen onConfirm={loc => { setLocation(loc); navigateTo('home'); }} />;
      case 'home':
        return <HomeScreen 
                  location={location} 
                  cart={cart} 
                  navigateTo={navigateTo} 
                  addToCart={addToCart} 
                  setSelectedCafe={setSelectedCafe}
                />;
      case 'menu':
        return <MenuScreen 
                  cafe={selectedCafe!} 
                  cart={cart} 
                  navigateTo={navigateTo} 
                  addToCart={addToCart} 
                />;
      case 'cart':
        return <CartScreen 
                  cart={cart}
                  updateCartQuantity={updateCartQuantity}
                  navigateTo={navigateTo}
                  setOrderDetails={setOrderDetails}
                  clearCart={clearCart}
                />;
      case 'schedule':
        return <ScheduleScreen 
                  orderDetails={orderDetails!}
                  setOrderDetails={setOrderDetails}
                  navigateTo={navigateTo}
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
                />;
      case 'orders':
        return <OrdersScreen navigateTo={navigateTo} />;
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
    <div className="bg-gray-800 flex justify-center items-start min-h-screen py-4 sm:py-8">
      <div className="w-full max-w-sm h-[850px] sm:h-[900px] bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;