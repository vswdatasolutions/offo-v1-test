import React, { useState } from 'react';
import type { Screen } from '../App';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

interface MyAccountScreenProps {
  navigateTo: (screen: Screen) => void;
}

const DetailRow: React.FC<{ label: string; value: string; isEditing?: boolean; onChange?: (value: string) => void }> = ({ label, value, isEditing = false, onChange }) => (
    <div className="py-3">
        <label className="text-xs text-gray-500">{label}</label>
        {isEditing ? (
            <input 
                type="text" 
                value={value} 
                onChange={(e) => onChange?.(e.target.value)} 
                className="w-full p-1 bg-gray-100 border-b-2 border-orange-400 focus:outline-none"
            />
        ) : (
            <p className="font-semibold text-gray-800">{value}</p>
        )}
    </div>
);


const MyAccountScreen: React.FC<MyAccountScreenProps> = ({ navigateTo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({
        name: 'John Doe',
        phone: '+91 98765 43210',
        email: 'john.doe@offo.com',
        department: 'Engineering',
        company: 'Amazon',
        building: 'Building 1'
    });
    const [editedUser, setEditedUser] = useState(user);

    const handleEdit = () => {
        setEditedUser(user);
        setIsEditing(true);
    };

    const handleSave = () => {
        setUser(editedUser);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleInputChange = (field: keyof typeof user, value: string) => {
        setEditedUser(prev => ({...prev, [field]: value}));
    };

    return (
        <div className="flex flex-col h-full bg-[#FFF9F2]">
            <header className="p-4 flex items-center border-b sticky top-0 bg-[#FFF9F2] z-10">
                <div className="w-1/5">
                    <button onClick={() => navigateTo('profile')}>
                        <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
                <div className="w-3/5 text-center">
                    <h1 className="text-xl font-bold text-gray-800">My Account</h1>
                </div>
                <div className="w-1/5"></div>
            </header>

            <main className="flex-grow overflow-y-auto p-4">
                <div className="flex flex-col items-center mb-6">
                     <img 
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                        alt="User Avatar"
                        className="w-24 h-24 rounded-full object-cover border-4 border-orange-200"
                    />
                    <h2 className="text-2xl font-bold text-gray-800 mt-3">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border divide-y">
                   <DetailRow label="Full Name" value={isEditing ? editedUser.name : user.name} isEditing={isEditing} onChange={(val) => handleInputChange('name', val)} />
                   <DetailRow label="Phone Number" value={isEditing ? editedUser.phone : user.phone} isEditing={isEditing} onChange={(val) => handleInputChange('phone', val)} />
                   <DetailRow label="Email Address" value={isEditing ? editedUser.email : user.email} isEditing={isEditing} onChange={(val) => handleInputChange('email', val)} />
                   <DetailRow label="Department" value={isEditing ? editedUser.department : user.department} isEditing={isEditing} onChange={(val) => handleInputChange('department', val)} />
                   <DetailRow label="Company" value={user.company} />
                   <DetailRow label="Building" value={user.building} />
                </div>
            </main>

            <footer className="p-4 border-t bg-white">
                {isEditing ? (
                    <div className="flex gap-4">
                        <button onClick={handleCancel} className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl">Cancel</button>
                        <button onClick={handleSave} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl shadow-md">Save Changes</button>
                    </div>
                ) : (
                    <button onClick={handleEdit} className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-md">Edit Profile</button>
                )}
            </footer>
        </div>
    );
};

export default MyAccountScreen;
