import React, { useState, useRef, useEffect } from 'react';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (otpSent && timer > 0) {
      const countdown = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [otpSent, timer]);

  const handleTabChange = (tab: 'login' | 'signup') => {
    if (otpSent) return;
    setActiveTab(tab);
    setFirstName('');
    setLastName('');
  };

  const isGetOtpDisabled = activeTab === 'login'
    ? phone.length < 10
    : phone.length < 10 || !firstName || !lastName;

  const isVerifyDisabled = otp.join('').length < 6;

  const handleGetOtp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOtpSent(true);
    setTimer(30);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handleEditPhone = () => {
    setOtpSent(false);
    setOtp(new Array(6).fill(''));
    setTimer(0);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const paste = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(paste)) {
      setOtp(paste.split(''));
      inputRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      setTimer(30);
      // Logic to resend OTP would go here
      console.log("Resending OTP...");
    }
  };

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
                onClick={() => handleTabChange('login')}
                disabled={otpSent}
                className={`w-1/2 pb-3 text-center font-semibold text-lg transition-all duration-300 ${activeTab === 'login' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'} disabled:text-gray-300 disabled:cursor-not-allowed`}
              >
                Log In
              </button>
              <button
                onClick={() => handleTabChange('signup')}
                disabled={otpSent}
                className={`w-1/2 pb-3 text-center font-semibold text-lg transition-all duration-300 ${activeTab === 'signup' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'} disabled:text-gray-300 disabled:cursor-not-allowed`}
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
                    disabled={otpSent}
                    className="w-full p-3 bg-gray-100 rounded-lg disabled:bg-gray-200 disabled:text-gray-500" />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={otpSent}
                    className="w-full p-3 bg-gray-100 rounded-lg disabled:bg-gray-200 disabled:text-gray-500" />
                </div>
              </>
            )}

            <div className="mb-4">
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                className="w-full p-3 bg-gray-100 rounded-lg disabled:bg-gray-200 disabled:text-gray-500"
                maxLength={10}
                disabled={otpSent}
              />
            </div>
            
            {!otpSent && (
                <>
                    <button
                    onClick={handleGetOtp}
                    disabled={isGetOtpDisabled}
                    className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-orange-600 transition-colors disabled:bg-gray-300"
                    >
                    Get Otp
                    </button>
                    <div className="flex items-center my-4">
                        <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                    </div>
                </>
            )}

            {otpSent && (
              <div className="text-center animate-fade-in" style={{animationDuration: '0.5s'}}>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Enter OTP</h2>
                <p className="text-sm text-gray-500 mb-6">
                  An OTP has been sent to +91 {phone}
                  <button onClick={handleEditPhone} className="font-semibold text-orange-600 ml-2">Edit</button>
                </p>
                <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      ref={el => { inputRefs.current[index] = el; }}
                      type="tel"
                      maxLength={1}
                      value={data}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                      className="w-10 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
                <button
                  onClick={onLoginSuccess}
                  disabled={isVerifyDisabled}
                  className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-orange-600 transition-colors disabled:bg-gray-300"
                >
                  Verify OTP
                </button>
                <div className="text-center text-sm text-gray-500 mt-4">
                  <p>
                    Didn't get otp?{' '}
                    <button
                      onClick={handleResendOtp}
                      disabled={timer > 0}
                      className={`font-medium ${timer > 0 ? 'text-gray-400' : 'text-orange-600 hover:text-orange-500'}`}
                    >
                      Resend OTP{timer > 0 ? ` in 00:${timer.toString().padStart(2, '0')}` : ''}
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
