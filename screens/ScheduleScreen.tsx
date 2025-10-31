import React, { useState, useMemo } from 'react';
import type { Screen } from '../App';
import type { OrderDetails, ScheduledItem } from '../types';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import TimePicker from '../components/TimePicker';
import ScrollableContainer from '@/components/ScrollableContainer';

interface ScheduleScreenProps {
  orderDetails: OrderDetails;
  setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetails | null>>;
  navigateTo: (screen: Screen) => void;
}

const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ orderDetails, setOrderDetails, navigateTo }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [scheduleTime, setScheduleTime] = useState('08:00 AM');
  const [repeat, setRepeat] = useState<'none' | 'weekly' | 'monthly'>('none');

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

    setSelectedDates(prevSelected => {
      const isSelected = prevSelected.some(d => isSameDay(d, clickedDate));
      if (isSelected) {
        return prevSelected.filter(d => !isSameDay(d, clickedDate));
      } else {
        return [...prevSelected, clickedDate].sort((a, b) => a.getTime() - b.getTime());
      }
    });
  };

  const handleCheckout = () => {
    if (selectedDates.length === 0) {
      alert("Please select at least one date.");
      return;
    }
    
    const schedules: ScheduledItem[] = selectedDates.map(date => ({
        id: date.getTime(),
        date: date,
        time: scheduleTime,
    }));
    
    const total = (orderDetails.subtotal + orderDetails.convenienceFee) * schedules.length;
    setOrderDetails({
        ...orderDetails,
        schedules: schedules,
        total,
    });
    navigateTo('payment');
  }
  
  const formatSelectedDates = (dates: Date[]) => {
    if (dates.length === 0) return 'None';
    const sortedDays = dates.map(d => d.getDate()).sort((a,b) => a - b);
    if (sortedDays.length <= 5) {
      return sortedDays.join(', ');
    }
    const firstPart = sortedDays.slice(0, 4).join(', ');
    const remainingCount = sortedDays.length - 4;
    return `${firstPart},... +${remainingCount}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF9F2]">
      <header className="p-4 flex items-center">
        <button onClick={() => navigateTo('cart')} className="p-2">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex-grow text-center">Schedule Order</h1>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      <ScrollableContainer className="p-4">
        <p className="font-semibold text-center mb-4 text-gray-700">Please select date and time</p>
        
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-lg font-bold text-orange-500">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} ›</h2>
              <div className="flex space-x-2">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => <div key={day} className="font-semibold text-gray-400 text-xs py-2">{day}</div>)}
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
                          className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto font-medium transition-colors duration-200
                            ${!day ? 'bg-transparent' : ''}
                            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}
                            ${isSelected ? 'bg-orange-500 text-white font-bold shadow-md' : ''}
                            ${!isSelected && isToday ? 'border border-orange-500 text-orange-500' : ''}
                          `}
                      >
                          {day}
                      </button>
                  )
              })}
          </div>
          <div className="border-t mt-4 pt-4">
             <TimePicker value={scheduleTime} onChange={setScheduleTime} />
          </div>
        </div>

        <div className="mt-6">
            <h3 className="font-bold text-lg text-gray-700 mb-3 px-2">Repeat</h3>
            <div className="flex items-center bg-gray-100 p-1 rounded-full shadow-inner">
                {(['None', 'Weekly', 'Monthly'] as const).map((option) => {
                    const value = option.toLowerCase() as 'none' | 'weekly' | 'monthly';
                    return (
                        <button
                            key={option}
                            onClick={() => setRepeat(value)}
                            className={`flex-1 py-2 text-center font-semibold rounded-full transition-all duration-300 text-sm ${
                                repeat === value
                                ? 'bg-orange-500 text-white shadow'
                                : 'text-gray-600'
                            }`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>

        {selectedDates.length > 0 && (
          <div className="mt-6 bg-[#6F4E37] p-4 rounded-2xl text-white font-semibold space-y-1 shadow-lg animate-fade-in">
            <p>Selected dates : {formatSelectedDates(selectedDates)}</p>
            <p>Selected time : {scheduleTime}</p>
            {repeat !== 'none' && <p>Repeat : <span className="capitalize">{repeat}</span></p>}
          </div>
        )}
      </ScrollableContainer>

      <footer className="p-4 border-t bg-white">
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