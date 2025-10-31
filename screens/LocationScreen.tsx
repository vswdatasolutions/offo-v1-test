
import React, { useState } from 'react';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

interface LocationScreenProps {
  onConfirm: (location: { city: string, company: string, building: string }) => void;
}

const LocationScreen: React.FC<LocationScreenProps> = ({ onConfirm }) => {
  const [city, setCity] = useState('Bangalore');
  const [company, setCompany] = useState('Amazon');
  const [building, setBuilding] = useState('Building 1');
  const [isLocating, setIsLocating] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<{ city: string, company: string, building: string } | null>(null);

  const handleConfirm = () => {
    onConfirm({ city, company, building });
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setDetectedLocation(null);
    navigator.geolocation.getCurrentPosition(
      () => {
        // Mocking successful location detection
        setTimeout(() => {
          const mockLocation = { city: 'Bangalore', company: 'Amazon', building: 'Building 2 (Detected)' };
          setDetectedLocation(mockLocation);
          // Also update the dropdowns
          setCity(mockLocation.city);
          setCompany(mockLocation.company);
          setBuilding('Building 2'); // Simplified for dropdown
          setIsLocating(false);
        }, 1500);
      },
      () => {
        // Handle error
        alert('Could not get your location. Please select it manually.');
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF9F2]">
      <div className="p-4 flex items-center">
        <button>
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-4">Select your Location</h1>
      </div>
      
      <div className="p-4 flex-grow overflow-y-auto">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">Select Your City</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 bg-white border border-gray-300 rounded-lg mt-1">
              <option>Delhi</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
              <option>Hyderabad</option>
              <option>Chennai</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">Select your company</label>
            <select value={company} onChange={(e) => setCompany(e.target.value)} className="w-full p-3 bg-white border border-gray-300 rounded-lg mt-1">
              <option>Amazon</option>
              <option>Wipro</option>
              <option>TCS</option>
              <option>Oracle</option>
              <option>Dell</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">Select Building</label>
            <select value={building} onChange={(e) => setBuilding(e.target.value)} className="w-full p-3 bg-white border border-gray-300 rounded-lg mt-1">
              <option>Building 1</option>
              <option>Building 2</option>
              <option>Building 3</option>
              <option>Building 4</option>
              <option>Building 5</option>
            </select>
          </div>
        </div>

        <div className="my-6 flex items-center text-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 font-semibold">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="w-full bg-white border-2 border-orange-500 text-orange-500 font-bold py-3 rounded-xl shadow-sm hover:bg-orange-50 transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {isLocating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Detecting...
              </>
          ) : 'Use My Current Location'}
        </button>

        {detectedLocation && (
          <div className="mt-6 text-center animate-fade-in-slow">
            <img src="../../assets/location/cafe map.jpg" alt="Map placeholder" className="rounded-lg object-cover h-32 w-full mb-2"/>
            <p className="font-semibold text-gray-700">Detected: {detectedLocation.company}, {detectedLocation.building}</p>
          </div>
        )}

      </div>

      <div className="mt-auto p-4 bg-[#FFF9F2] border-t">
        <button
          onClick={handleConfirm}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-orange-600 transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default LocationScreen;