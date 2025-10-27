import React, { useState } from 'react';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const isButtonDisabled = activeTab === 'login'
    ? phone.length < 10
    : phone.length < 10 || !firstName || !lastName;

  return (
    <div className="flex flex-col h-full bg-[#0D1B2A]">
      <div className="p-4">
        <button className="text-white">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">Welcome!</h1>
            <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('login')}
                        className={`w-1/2 pb-3 text-center font-semibold text-lg transition-all duration-300 ${activeTab === 'login' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => setActiveTab('signup')}
                        className={`w-1/2 pb-3 text-center font-semibold text-lg transition-all duration-300 ${activeTab === 'signup' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
                    >
                        Sign-up
                    </button>
                </div>

                {activeTab === 'signup' && (
                    <>
                        <div className="mb-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full p-3 bg-gray-100 rounded-lg" />
                        </div>
                        <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full p-3 bg-gray-100 rounded-lg" />
                        </div>
                    </>
                )}

                <div className="mb-4">
                <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-gray-100 rounded-lg"
                />
                </div>
                <button
                onClick={onLoginSuccess}
                disabled={isButtonDisabled}
                className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-orange-600 transition-colors disabled:bg-gray-300"
                >
                Get Otp
                </button>
                <div className="flex items-center my-4">
                <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                </div>
                <div className="text-center text-sm text-gray-500">
                <p>We will send an OTP to +91 {phone || '...'}</p>
                <p>Didn't get otp? <a href="#" className="font-medium text-orange-600 hover:text-orange-500">Resend OTP: 00:31 sec</a></p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;