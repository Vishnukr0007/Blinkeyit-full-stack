import React from 'react';
import { IoGiftOutline } from "react-icons/io5";

const EGiftCards = () => {
    const giftCards = [
        {
            id: 1,
            name: "Blinkit Gold Gift Card",
            image: "https://via.placeholder.com/300x180/FFC220/000000?text=Blinkitem+Gold",
            price: 500
        },
        {
            id: 2,
            name: "Blinkit Platinum Gift Card",
            image: "https://via.placeholder.com/300x180/0C831F/FFFFFF?text=Blinkitem+Platinum",
            price: 1000
        },
        {
            id: 3,
            name: "Blinkit Birthday Special",
            image: "https://via.placeholder.com/300x180/FF5733/FFFFFF?text=Happy+Birthday",
            price: 2500
        }
    ];

    return (
        <div className='p-4'>
            <div className='bg-white shadow-md p-4 rounded mb-6 flex items-center justify-between'>
                <h2 className='font-bold text-lg flex items-center gap-2'>
                    <IoGiftOutline size={24} className="text-yellow-500"/>
                    E-Gift Cards
                </h2>
                <span className="text-sm text-gray-500">Share the joy instanly</span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {giftCards.map((card) => (
                    <div key={card.id} className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow'>
                        <img 
                            src={card.image} 
                            alt={card.name} 
                            className='w-full h-48 object-cover'
                        />
                        <div className='p-4'>
                            <h3 className='font-semibold text-lg mb-2'>{card.name}</h3>
                            <p className='text-gray-600 mb-4'>Value: <span className='font-bold text-black'>₹{card.price}</span></p>
                            <button className='w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded transition-colors'>
                                Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">How it works</h3>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    <li>Purchase a gift card of your choice.</li>
                    <li>Share the code with your friends or family.</li>
                    <li>They can redeem it instantly on checkout.</li>
                </ul>
            </div>
        </div>
    );
};

export default EGiftCards;
