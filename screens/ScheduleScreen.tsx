
import React, { useState, useMemo, useEffect } from 'react';
import type { Screen } from '../App';
import type { OrderDetails, ScheduledItem, Order } from '../types';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import TimePicker from '../components/TimePicker';
import ScrollableContainer from '../components/ScrollableContainer';

interface ScheduleScreenProps {
  orderDetails: OrderDetails;
  setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetails | null>>;
  navigateTo: (screen: Screen) => void;
  orderToEdit: Order | null;
  onUpdateOrder: (updatedOrder: Order) => void;
}

const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ orderDetails, setOrderDetails, navigateTo, orderToEdit, onUpdateOrder }) => {
  const isEditMode = orderToEdit != null;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [initialSelectedDates, setInitialSelectedDates] = useState<Date[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [scheduleTime, setScheduleTime] = useState('08:00 AM');
  const [repeat, setRepeat] = useState<'none' | 'weekly'>('none');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && orderToEdit) {
        const orderDate = orderToEdit.date;
        setSelectedDates([orderDate]);
        setInitialSelectedDates([orderDate]);
        setCurrentDate(new Date(orderDate.getFullYear(), orderDate.getMonth(), 1));

        let hours = orderDate.getHours();
        const minutes = orderDate.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const hoursStr = hours.toString().padStart(2, '0');
        setScheduleTime(`${hoursStr}:${minutes} ${ampm}`);
    }
  }, [isEditMode, orderToEdit]);

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

    if (isEditMode) {
      // In edit mode, only one date can be selected
      setSelectedDates([clickedDate]);
      setInitialSelectedDates([clickedDate]);
      return;
    }

    const newInitialDates = initialSelectedDates.some(d => isSameDay(d, clickedDate))
        ? initialSelectedDates.filter(d => !isSameDay(d, clickedDate))
        : [...initialSelectedDates, clickedDate];
    
    newInitialDates.sort((a, b) => a.getTime() - b.getTime());
    
    setInitialSelectedDates(newInitialDates);
    setSelectedDates(newInitialDates);
    setRepeat('none');
  };
  
  const handleClearSelection = () => {
    setSelectedDates([]);
    setInitialSelectedDates([]);
    setRepeat('none');
  };
  
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
        setNotification(null);
    }, 2500);
  };

  const handleRepeatChange = (newRepeat: 'none' | 'weekly') => {
    setRepeat(newRepeat);

    if (initialSelectedDates.length === 0) {
        if (newRepeat !== 'none') {
            showNotification("Please select a date first.");
        }
        return;
    }

    if (newRepeat === 'none') {
        setSelectedDates([...initialSelectedDates]);
        return;
    }

    const newDatesSet = new Set<number>(initialSelectedDates.map(d => d.getTime()));

    if (newRepeat === 'weekly') {
        initialSelectedDates.forEach(initialDate => {
            // Add the next 3 weeks for a total of 4 occurrences
            for (let i = 1; i <= 3; i++) {
                const dateIterator = new Date(initialDate.getTime());
                dateIterator.setDate(dateIterator.getDate() + (7 * i));
                if (dateIterator >= today) {
                    newDatesSet.add(dateIterator.getTime());
                }
            }
        });
        showNotification(`Weekly repeat applied for 4 weeks.`);
    }
    
    const sortedDates = Array.from(newDatesSet).map(t => new Date(t)).sort((a, b) => a.getTime() - b.getTime());
    setSelectedDates(sortedDates);
  };

  const handleUpdate = () => {
    if (selectedDates.length !== 1) {
        alert("Please select one date for the order.");
        return;
    }
    if (!orderToEdit) return;

    const newScheduledDate = new Date(selectedDates[0]);
    const [time, period] = scheduleTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    newScheduledDate.setHours(hours, minutes, 0, 0);

    const updatedOrder = {
        ...orderToEdit,
        date: newScheduledDate,
    };
    onUpdateOrder(updatedOrder);
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
      return dates.map(d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short'})).join(', ');
    }
    const firstPart = dates.slice(0, 4).map(d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short'})).join(', ');
    const remainingCount = sortedDays.length - 4;
    return `${firstPart},... +${remainingCount}`;
  };

  const checkoutTotal = !isEditMode && orderDetails ? (orderDetails.subtotal + orderDetails.convenienceFee) * selectedDates.length : 0;

  return (
    <div className="flex flex-col h-full bg-[#FFF9F2] relative">
      {notification && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-lg z-20 animate-fade-in-slow">
                {notification}
            </div>
      )}
      <header className="p-4 flex items-center">
        <button onClick={() => navigateTo(isEditMode ? 'orders' : 'cart')} className="p-2">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex-grow text-center">{isEditMode ? 'Edit Schedule' : 'Schedule Order'}</h1>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      <ScrollableContainer className="p-4">
        {isEditMode && orderToEdit && (
            <div className="mb-4 bg-white p-4 rounded-2xl shadow-sm border">
                <h3 className="font-bold text-gray-800 text-md mb-2">Editing Schedule for Order #{orderToEdit.id.slice(-5)}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                    {orderToEdit.items.map(({ item, quantity }) => (
                        <div key={item.id} className="flex justify-between">
                            <span>{quantity}x {item.name}</span>
                            <span>₹{(item.price * quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t mt-2 pt-2 flex justify-between font-semibold text-gray-700">
                    <span>Total</span>
                    <span>₹{orderToEdit.total.toFixed(2)}</span>
                </div>
            </div>
        )}
        <p className="font-semibold text-center my-4 text-gray-700">Please select date and time</p>
        
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

        <div className={`mt-6 ${isEditMode ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="font-bold text-lg text-gray-700 mb-3 px-2">Repeat</h3>
            <div className="flex items-center bg-gray-100 p-1 rounded-full shadow-inner">
                {(['None', 'Weekly'] as const).map((option) => {
                    const value = option.toLowerCase() as 'none' | 'weekly';
                    return (
                        <button
                            key={option}
                            onClick={() => handleRepeatChange(value)}
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
        {isEditMode && <p className="text-xs text-center text-gray-500 mt-2">Repeat options are not available when editing a single order.</p>}
        
        {initialSelectedDates.length > 0 && !isEditMode && (
          <div className="mt-4 text-center">
              <button 
                  onClick={handleClearSelection}
                  className="text-sm text-red-500 font-semibold hover:underline"
              >
                  Clear All Selections
              </button>
          </div>
        )}

        {selectedDates.length > 0 && (
          <div className="mt-6 bg-[#6F4E37] p-4 rounded-2xl text-white font-semibold space-y-1 shadow-lg animate-fade-in">
            <p>Selected dates : {formatSelectedDates(selectedDates)}</p>
            <p>Selected time : {scheduleTime}</p>
            {repeat !== 'none' && !isEditMode && <p>Repeat : <span className="capitalize">{repeat}</span></p>}
          </div>
        )}
      </ScrollableContainer>

      <footer className="p-4 border-t bg-white">
        <button
          onClick={isEditMode ? handleUpdate : handleCheckout}
          disabled={selectedDates.length === 0}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-md hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isEditMode ? 'Update Schedule' : `Checkout - ₹${checkoutTotal.toFixed(2)}`}
        </button>
      </footer>
    </div>
  );
};

export default ScheduleScreen;
