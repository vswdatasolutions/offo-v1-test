import React, { useState, useMemo } from 'react';
import type { Screen } from '../App';
import type { OrderDetails } from '../types';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

interface ScheduleScreenProps {
  orderDetails: OrderDetails;
  setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetails | null>>;
  navigateTo: (screen: Screen) => void;
}

const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ orderDetails, setOrderDetails, navigateTo }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [repeat, setRepeat] = useState('Weekly');

  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push(i);
    }
    return grid;
  }, [currentDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const handleDateClick = (day: number | null) => {
    if (day === null) return;
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    clickedDate.setHours(0, 0, 0, 0);

    if (clickedDate < today) return;

    setSelectedDates(prevDates => {
      const isSelected = prevDates.some(d => isSameDay(d, clickedDate));
      if (isSelected) {
        return prevDates.filter(d => !isSameDay(d, clickedDate));
      } else {
        return [...prevDates, clickedDate].sort((a, b) => a.getTime() - b.getTime());
      }
    });
  };
  
  const handleCheckout = () => {
    if (selectedDates.length === 0) {
      alert("Please select at least one date.");
      return;
    }
    const scheduledDate = selectedDates[0];
    setOrderDetails({
        ...orderDetails,
        scheduledDate: scheduledDate,
        scheduledTime: `${hour}:${minute} ${period}`
    });
    navigateTo('payment');
  }

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF9F2]">
      <header className="p-4 flex items-center border-b">
        <button onClick={() => navigateTo('cart')}>
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 mx-auto">Schedule Order</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <p className="font-semibold text-center mb-4">Please select date and time</p>
        
        <div className="text-center mb-4">
            <div className="flex justify-between items-center font-bold text-gray-700 px-2">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200">&lt;</button>
                <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200">&gt;</button>
            </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day} className="font-bold text-gray-500 w-10 h-10 flex items-center justify-center">{day}</div>)}
            {calendarGrid.map((day, index) => {
                const date = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
                const isPast = date && date < today;
                const isSelected = date && selectedDates.some(d => isSameDay(d, date));
                const isToday = date && isSameDay(date, today);

                return (
                    <button 
                        key={index}
                        disabled={isPast || !day}
                        onClick={() => handleDateClick(day)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                          ${!day ? 'bg-transparent' : ''}
                          ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-orange-100'}
                          ${isSelected ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}
                          ${!isSelected && isToday ? 'font-bold border-2 border-orange-500' : ''}
                        `}
                    >
                        {day}
                    </button>
                )
            })}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label className="text-sm font-semibold text-gray-600">Time</label>
                <div className="flex items-center bg-white border rounded-lg p-1 mt-1">
                    <select value={hour} onChange={(e) => setHour(e.target.value)} className="w-full bg-transparent p-1 focus:outline-none appearance-none text-center">
                        {hours.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span>:</span>
                     <select value={minute} onChange={(e) => setMinute(e.target.value)} className="w-full bg-transparent p-1 focus:outline-none appearance-none text-center">
                        {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <div className="flex flex-col">
                      <button onClick={() => setPeriod('AM')} className={`px-2 py-0.5 text-xs rounded ${period === 'AM' ? 'bg-orange-500 text-white' : 'text-gray-500'}`}>AM</button>
                      <button onClick={() => setPeriod('PM')} className={`px-2 py-0.5 text-xs rounded ${period === 'PM' ? 'bg-orange-500 text-white' : 'text-gray-500'}`}>PM</button>
                    </div>
                </div>
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-600">Repeat</label>
                <select value={repeat} onChange={(e) => setRepeat(e.target.value)} className="w-full bg-white border rounded-lg p-2 mt-1 focus:outline-none">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>None</option>
                </select>
            </div>
        </div>
      </main>

      <footer className="p-4 border-t bg-white">
        <div className="bg-orange-50 text-gray-800 p-4 rounded-lg mb-4">
            <p className="font-bold text-sm mb-1">Summary</p>
            <p><span className="font-semibold">Dates:</span> {selectedDates.length > 0 ? selectedDates.map(formatDate).join(', ') : 'None'}</p>
            <p><span className="font-semibold">Time:</span> {hour}:{minute} {period}</p>
            <p><span className="font-semibold">Repeat:</span> {repeat}</p>
        </div>
        <button
          onClick={handleCheckout}
          disabled={selectedDates.length === 0}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Checkout
        </button>
      </footer>
    </div>
  );
};

export default ScheduleScreen;
