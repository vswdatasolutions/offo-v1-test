import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';

interface OTPInputProps {
  onVerify: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ onVerify }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && inputsRef.current[index - 1]) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    if (paste.length === 6 && /^\d+$/.test(paste)) {
        const newOtp = paste.split('');
        setOtp(newOtp);
        inputsRef.current[5]?.focus();
    }
  };

  const otpString = otp.join('');
  const isOtpComplete = otpString.length === 6;

  return (
    <div className="animate-fade-in-slow mt-6">
      <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            name="otp"
            maxLength={1}
            className="w-12 h-14 text-center text-2xl font-bold bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={(e) => e.target.select()}
            // FIX: The ref callback function must return void. An arrow function with a concise body `() => expression` returns the expression. Using a block body `{}` ensures an implicit `undefined` return.
            ref={(el) => { inputsRef.current[index] = el; }}
            autoComplete="one-time-code"
          />
        ))}
      </div>
      <button
        onClick={() => onVerify(otpString)}
        disabled={!isOtpComplete}
        className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-orange-600 transition-colors disabled:bg-gray-300"
      >
        Verify OTP
      </button>
    </div>
  );
};

export default OTPInput;