
import React, { useState } from 'react';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

interface LocationScreenProps {
  onConfirm: (location: { city: string, company: string, building: string }) => void;
}

const LocationScreen: React.FC<LocationScreenProps> = ({ onConfirm }) => {
  const [city, setCity] = useState('Bangalore');
  const [company, setCompany] = useState('Amazon');
  const [building, setBuilding] = useState('Building 1');

  const handleConfirm = () => {
    onConfirm({ city, company, building });
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF9F2]">
      <div className="p-4 flex items-center">
        <button>
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-4">Select your Location</h1>
      </div>
      
      <div className="p-4">
        <div className="bg-gray-200 h-40 rounded-lg mb-4 flex items-center justify-center">
           <img src="https://i.imgur.com/3Y1D5gG.png" alt="Map placeholder" className="rounded-lg object-cover h-full w-full"/>
        </div>

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
      </div>

      <div className="mt-auto p-4">
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
