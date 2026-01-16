import React, { useState } from 'react';
import { IoShieldCheckmarkOutline } from "react-icons/io5";

const Toggle = ({ label, description, checked, onChange }) => (
    <div className='flex items-center justify-between py-4 border-b border-gray-100 last:border-none'>
        <div>
            <h4 className='font-medium text-gray-800'>{label}</h4>
            <p className='text-xs text-gray-500 mt-1'>{description}</p>
        </div>
         <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
    </div>
);

const AccountPrivacy = () => {
    const [settings, setSettings] = useState({
        marketingEmails: true,
        activityTracking: false,
        profileVisibility: true
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className='p-4 max-w-2xl mx-auto'>
            <div className='bg-white shadow-sm p-4 rounded mb-6 flex items-center justify-between border border-gray-100'>
                <h2 className='font-bold text-lg flex items-center gap-2'>
                    <IoShieldCheckmarkOutline size={24} className="text-green-600"/>
                    Account Privacy
                </h2>
            </div>

            <div className='bg-white shadow-md rounded-lg p-6'>
                <h3 className='font-semibold text-gray-900 mb-4'>Privacy Settings</h3>
                
                <Toggle 
                    label="Marketing Emails" 
                    description="Receive offers, promotions, and news from Blinkeyit."
                    checked={settings.marketingEmails}
                    onChange={() => handleToggle('marketingEmails')}
                />
                
                <Toggle 
                    label="Personalized Ads" 
                    description="Allow us to use your activity to show relevant ads."
                    checked={settings.activityTracking}
                    onChange={() => handleToggle('activityTracking')}
                />

                <Toggle 
                    label="Profile Visibility" 
                    description="Allow others to see your public profile info."
                    checked={settings.profileVisibility}
                    onChange={() => handleToggle('profileVisibility')}
                />
            </div>

            <div className='bg-white shadow-md rounded-lg p-6 mt-6'>
                 <h3 className='font-semibold text-gray-900 mb-4'>Data Management</h3>
                 <p className='text-sm text-gray-600 mb-4'>
                    You have control over your data. You can request a copy of your data or delete your account permanently.
                 </p>
                 <div className="flex gap-4">
                     <button className='text-blue-600 text-sm font-semibold hover:underline'>Request Data</button>
                     <button className='text-red-500 text-sm font-semibold hover:underline'>Delete Account</button>
                 </div>
            </div>
        </div>
    );
};

export default AccountPrivacy;
