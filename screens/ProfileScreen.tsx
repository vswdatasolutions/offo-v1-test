import React, { useState } from 'react';
import type { Screen } from '../App';
import BottomNav from '../components/BottomNav';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import CheckIcon from '../components/icons/CheckIcon';

// Icon Components
const UserIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);
const CreditCardIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21.75z" />
    </svg>
);
const ReceiptIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const BellIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);
const HelpIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);
const InfoIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
);
const LogoutIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
);
const EditIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
);
const ChevronRightIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);
const CloseIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface ProfileScreenProps {
  navigateTo: (screen: Screen) => void;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onChange(); }}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${checked ? 'bg-orange-500' : 'bg-gray-300'}`}
        role="switch"
        aria-checked={checked}
    >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}/>
    </button>
);


const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigateTo }) => {
    const [name, setName] = useState('John Doe');
    const [phone, setPhone] = useState('+91 98765 43210');
    const [email, setEmail] = useState('john.doe@offo.com');
    const [department, setDepartment] = useState('Engineering');

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedPhone, setEditedPhone] = useState(phone);
    const [editedEmail, setEditedEmail] = useState(email);
    const [editedDepartment, setEditedDepartment] = useState(department);

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const generalOptions = [
        { label: "My Account", icon: UserIcon, action: () => navigateTo('my-account') },
        { label: "Payment Methods", icon: CreditCardIcon, action: () => navigateTo('payment-methods') },
        { label: "Order History", icon: ReceiptIcon, action: () => navigateTo('orders') },
        { label: "Notifications", icon: BellIcon, action: () => setNotificationsEnabled(!notificationsEnabled) },
    ];
    
    const moreOptions = [
        { label: "Help & Support", icon: HelpIcon, action: () => navigateTo('help') },
        { label: "About Us", icon: InfoIcon, action: () => navigateTo('about') },
    ];

    const handleLogout = () => {
        navigateTo('login');
    };

    const handleStartEdit = () => {
        setEditedName(name);
        setEditedPhone(phone);
        setEditedEmail(email);
        setEditedDepartment(department);
        setIsEditing(true);
    };

    const handleSaveChanges = () => {
        setName(editedName);
        setPhone(editedPhone);
        setEmail(editedEmail);
        setDepartment(editedDepartment);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#FFF9F2]">
            <header className="p-4 flex items-center border-b">
                <div className="w-1/5">
                    <button onClick={() => navigateTo('home')}>
                        <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
                <div className="w-3/5 text-center">
                    <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
                </div>
                <div className="w-1/5"></div>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-6 no-scrollbar">
                <div className="relative bg-gradient-to-br from-orange-400 to-orange-500 p-4 rounded-2xl shadow-lg text-white">
                    <div className="absolute top-3 right-3 flex space-x-2">
                        {isEditing ? (
                            <>
                                <button onClick={handleSaveChanges} className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors" aria-label="Save changes">
                                    <CheckIcon className="w-4 h-4 text-white"/>
                                </button>
                                <button onClick={handleCancelEdit} className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors" aria-label="Cancel edit">
                                    <CloseIcon className="w-4 h-4 text-white"/>
                                </button>
                            </>
                        ) : (
                            <button onClick={handleStartEdit} className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors" aria-label="Edit profile">
                                <EditIcon className="w-4 h-4 text-white"/>
                            </button>
                        )}
                    </div>
                    <div className="flex items-center">
                         <img 
                            src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                            alt="User Avatar"
                            className="w-20 h-20 rounded-full object-cover mr-4 border-4 border-white/30"
                        />
                        <div className="w-full pr-12">
                            {isEditing ? (
                                <div className="space-y-1">
                                    <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="bg-white/20 text-white placeholder-white/70 text-xl font-bold rounded-md p-1 w-full focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="Your Name" aria-label="Edit name"/>
                                    <input type="tel" value={editedPhone} onChange={(e) => setEditedPhone(e.target.value)} className="bg-white/20 text-white placeholder-white/70 text-sm rounded-md p-1 w-full focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="Phone Number" aria-label="Edit phone number"/>
                                    <input type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} className="bg-white/20 text-white placeholder-white/70 text-sm rounded-md p-1 w-full focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="Email Address" aria-label="Edit email address"/>
                                    <input type="text" value={editedDepartment} onChange={(e) => setEditedDepartment(e.target.value)} className="bg-white/20 text-white placeholder-white/70 text-sm rounded-md p-1 w-full focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="Department" aria-label="Edit department"/>
                                </div>
                            ) : (
                                <>
                                    <h2 className="font-bold text-2xl truncate">{name}</h2>
                                    <p className="text-sm opacity-90 truncate">{phone}</p>
                                    <p className="text-sm opacity-90 truncate">{email}</p>
                                    <p className="text-sm opacity-90 truncate">{department}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">General</h3>
                    <div className="bg-white rounded-xl shadow-sm border">
                        {generalOptions.map((option, index) => (
                            <button 
                                key={option.label}
                                onClick={option.action}
                                className={`w-full flex items-center text-left p-4 ${index < generalOptions.length - 1 ? 'border-b' : ''}`}
                            >
                                <option.icon className="w-6 h-6 text-orange-500 mr-4"/>
                                <span className="flex-grow font-semibold text-gray-700">{option.label}</span>
                                {option.label === 'Notifications' ? (
                                    <ToggleSwitch checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
                                ) : (
                                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                 <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">More</h3>
                    <div className="bg-white rounded-xl shadow-sm border">
                        {moreOptions.map((option, index) => (
                            <button 
                                key={option.label}
                                onClick={option.action}
                                className={`w-full flex items-center text-left p-4 ${index < moreOptions.length - 1 ? 'border-b' : ''}`}
                            >
                                <option.icon className="w-6 h-6 text-orange-500 mr-4"/>
                                <span className="flex-grow font-semibold text-gray-700">{option.label}</span>
                                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                            </button>
                        ))}
                    </div>
                </div>


                <div className="pt-2">
                     <button
                        onClick={handleLogout}
                        className="w-full flex items-center text-left p-4 bg-white rounded-xl shadow-sm border"
                     >
                        <LogoutIcon className="w-6 h-6 text-red-500 mr-4"/>
                        <span className="flex-grow font-semibold text-red-500">Log Out</span>
                     </button>
                </div>
            </main>

            <BottomNav activeScreen="profile" navigateTo={navigateTo} />
        </div>
    );
};

export default ProfileScreen;