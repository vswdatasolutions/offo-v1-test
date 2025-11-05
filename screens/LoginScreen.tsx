import React, { useState, useEffect } from 'react';
import type { Screen } from '../App';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import OTPInput from '../components/OTPInput';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  navigateTo: (screen: Screen) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, navigateTo }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let timer: number;
    if (isTimerActive && countdown > 0) {
      timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsTimerActive(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isTimerActive]);

  const isButtonDisabled = activeTab === 'login'
    ? phone.length !== 10
    : phone.length !== 10 || !firstName || !lastName;

  const handleGetOtp = () => {
    setShowOtp(true);
    setCountdown(30);
    setIsTimerActive(true);
  };
  
  const handleResendOtp = () => {
    if (!isTimerActive) {
      setCountdown(30);
      setIsTimerActive(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0D1B2A]">
      <div className="p-4">
        <button className="text-white" onClick={() => navigateTo('onboarding')}>
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">Welcome!</h1>
            <p className="text-center text-white/80 mb-4">Login or Sign up to continue</p>
            <img 
                src="https://storage.googleapis.com/aichat-previews/46eb2497-658b-49e0-8451-2487a6105423/K1L4YpE.png" 
                alt="Food ordering illustration" 
                className="w-48 h-48 mx-auto mb-4 object-contain"
            />
            <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => { setActiveTab('login'); setShowOtp(false); }}
                        className={`w-1/2 pb-3 text-center font-semibold text-lg transition-all duration-300 ${activeTab === 'login' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => { setActiveTab('signup'); setShowOtp(false); }}
                        className={`w-1/2 pb-3 text-center font-semibold text-lg transition-all duration-300 ${activeTab === 'signup' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
                    >
                        Sign-up
                    </button>
                </div>

                {!showOtp ? (
                  <>
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
                      <div className="flex items-center w-full p-3 bg-gray-100 rounded-lg">
                        <span className="text-gray-500 font-semibold pr-2 border-r border-gray-300">+91</span>
                        <input
                          type="tel"
                          placeholder="9876543210"
                          value={phone}
                          maxLength={10}
                          onChange={(e) => {
                            const { value } = e.target;
                            // Allow only numeric characters
                            if (/^\d*$/.test(value)) {
                              setPhone(value);
                            }
                          }}
                          className="w-full bg-transparent pl-2 focus:outline-none text-gray-800"
                        />
                      </div>
                    </div>
                    <button
                    onClick={handleGetOtp}
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
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center text-sm text-gray-500 mb-4">
                      <p>Enter the OTP sent to +91 {phone}</p>
                    </div>
                    <OTPInput onVerify={onLoginSuccess} />
                    <div className="text-center text-sm text-gray-500 mt-4">
                      <p>Didn't get otp?{' '}
                        {isTimerActive ? (
                          <span className="text-gray-400">
                            Resend OTP in: 00:{countdown.toString().padStart(2, '0')}
                          </span>
                        ) : (
                          <button onClick={handleResendOtp} className="font-medium text-orange-600 hover:text-orange-500 focus:outline-none">
                            Resend OTP
                          </button>
                        )}
                      </p>
                    </div>
                  </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;