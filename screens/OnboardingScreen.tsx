import React, { useState, useEffect } from 'react';

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

const onboardingSteps = [
  {
    image: '../../assets/illustrations/17177.jpg',
    title: 'Order from your work place',
    description: 'Pre-book your lunch, save your time - we\'ll have it ready when you are.',
  },
  {
    image: '../../assets/illustrations/flash1.jpg',
    title: 'No Queue, No hassles',
    description: 'Smart, fast, and fresh - your cafeteria just got an upgrade!',
  },
  {
    image: '../../assets/illustrations/1236.jpg',
    title: 'Order from Your Anywhere',
    description: 'Get all your favorite meals in one place — Order ahead, skip the line!',
  }
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onGetStarted }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < onboardingSteps.length - 1) {
      const timer = setTimeout(() => {
        setStep(prevStep => prevStep + 1);
      }, 2000); // Auto-advance every 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [step]);


  const currentStep = onboardingSteps[step];

  return (
    <div className="flex flex-col h-full bg-[#FFF9F2]">
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <img src={currentStep.image} alt={currentStep.title} className="w-full max-w-xs rounded-lg mb-8" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{currentStep.title}</h1>
        <p className="text-gray-500 px-4">{currentStep.description}</p>
      </div>

      <div className="p-8">
        <div className="flex justify-center items-center mb-6">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full mx-1 transition-all duration-500 ease-in-out ${index === step ? 'bg-orange-500 w-6' : 'bg-orange-200'}`}
            ></div>
          ))}
        </div>
        
        {step === onboardingSteps.length - 1 ? (
          <button
            onClick={onGetStarted}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-orange-600 transition-colors"
          >
            Get Started
          </button>
        ) : (
          <div className="h-[56px]" />
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
