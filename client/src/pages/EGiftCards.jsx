import React, { useEffect, useState } from 'react';
import { IoGiftOutline } from "react-icons/io5";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import AxiosToastError from '../utils/AxiosToastError';

const EGiftCards = () => {
    const [giftCards, setGiftCards] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchGiftCards = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getGiftCard
            });
            const { data: responseData } = response;
            if (responseData.success) {
                setGiftCards(responseData.data.filter(card => card.isActive));
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGiftCards();
    }, []);

    return (
        <div className='p-4'>
            <div className='bg-white shadow-md p-4 rounded mb-6 flex items-center justify-between'>
                <h2 className='font-bold text-lg flex items-center gap-2'>
                    <IoGiftOutline size={24} className="text-yellow-500"/>
                    E-Gift Cards
                </h2>
                <span className="text-sm text-gray-500">Share the joy instantly</span>
            </div>

            {loading ? (
                <div className='flex justify-center p-10'>
                    <Loading />
                </div>
            ) : giftCards.length === 0 ? (
                <div className='p-10'>
                    <NoData />
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {giftCards.map((card) => (
                        <div key={card._id} className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group'>
                            <div className='h-48 w-full overflow-hidden bg-gray-50'>
                                <img 
                                    src={card.image} 
                                    alt={card.name} 
                                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                />
                            </div>
                            <div className='p-4'>
                                <h3 className='font-bold text-lg mb-1 text-gray-800'>{card.name}</h3>
                                {card.description && <p className='text-xs text-gray-500 mb-3 truncate'>{card.description}</p>}
                                <div className='flex items-center justify-between mb-4'>
                                    <p className='text-gray-600 font-medium'>Value: <span className='font-bold text-black'>₹{card.price}</span></p>
                                    {card.discount > 0 && <span className='bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded'>{card.discount}% OFF</span>}
                                </div>
                                <button className='w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2.5 rounded shadow-sm shadow-yellow-100 active:scale-95 transition-all cursor-pointer'>
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <span className='bg-blue-100 p-1.5 rounded-full'>💡</span>
                    How it works
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='flex flex-col gap-1'>
                        <span className='w-7 h-7 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center font-bold text-xs'>1</span>
                        <p className='text-sm text-blue-700 font-medium'>Select a gift card design and value.</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <span className='w-7 h-7 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center font-bold text-xs'>2</span>
                        <p className='text-sm text-blue-700 font-medium'>Complete checkout to receive your unique code.</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <span className='w-7 h-7 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center font-bold text-xs'>3</span>
                        <p className='text-sm text-blue-700 font-medium'>Share the code or use it for your next purchase!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EGiftCards;
