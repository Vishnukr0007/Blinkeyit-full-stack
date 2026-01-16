import { useState } from 'react';
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage.js';
import SummaryApi from '../common/SummaryApi.js';
import Axios from '../utils/Axios.js';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError.js';

const UploadGiftCardModel = ({close, fetchData}) => {
    const [data, setData] = useState({
        name: "",
        image: "",
        price: "",
        discount: "",
        description: ""
    });
    const [loading, setLoading] = useState(false);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);
        try {
            const response = await uploadImage(file);
            const { data: ImageResponse } = response;
            if (ImageResponse.success) {
                setData((prev) => ({
                    ...prev,
                    image: ImageResponse.data.url
                }));
            }
        } catch (error) {
            console.error("Image upload failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.name || !data.image || !data.price) {
            toast.error("Name, Image and Price are required");
            return;
        }

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.createGiftCard,
                data: data
            });

            const { data: responseData } = response;
            if (responseData.success) {
                toast.success(responseData.message);
                close();
                fetchData();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='fixed top-0 left-0 bottom-0 right-0 z-50 bg-neutral-800/60 flex items-center justify-center p-4'>
            <div className='bg-white max-w-lg w-full p-6 rounded-lg shadow-xl'>
                <div className='flex items-center justify-between mb-4'>
                    <h1 className='font-bold text-xl text-gray-800'>Add New Gift Card</h1>
                    <button onClick={close} className='text-gray-500 hover:text-red-500 transition-colors cursor-pointer'>
                        <IoClose size={28} />
                    </button>
                </div>
                <form className='grid gap-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor="name" className='text-sm font-medium text-gray-700'>Gift Card Name</label>
                        <input
                            type='text'
                            id='name'
                            placeholder='e.g. Birthday Special'
                            value={data.name}
                            name='name'
                            onChange={handleOnChange}
                            className='bg-gray-50 p-2 border border-gray-200 outline-none focus:border-yellow-400 rounded-md transition-all'
                        />
                    </div>
                    
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='grid gap-1'>
                            <label htmlFor="price" className='text-sm font-medium text-gray-700'>Price (₹)</label>
                            <input
                                type='number'
                                id='price'
                                placeholder='500'
                                value={data.price}
                                name='price'
                                onChange={handleOnChange}
                                className='bg-gray-50 p-2 border border-gray-200 outline-none focus:border-yellow-400 rounded-md transition-all'
                            />
                        </div>
                        <div className='grid gap-1'>
                            <label htmlFor="discount" className='text-sm font-medium text-gray-700'>Discount (%)</label>
                            <input
                                type='number'
                                id='discount'
                                placeholder='10'
                                value={data.discount}
                                name='discount'
                                onChange={handleOnChange}
                                className='bg-gray-50 p-2 border border-gray-200 outline-none focus:border-yellow-400 rounded-md transition-all'
                            />
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="description" className='text-sm font-medium text-gray-700'>Description</label>
                        <textarea
                            id='description'
                            placeholder='Enter details about this gift card...'
                            value={data.description}
                            name='description'
                            onChange={handleOnChange}
                            rows={2}
                            className='bg-gray-50 p-2 border border-gray-200 outline-none focus:border-yellow-400 rounded-md transition-all resize-none'
                        />
                    </div>

                    <div className='grid gap-2'>
                        <p className='text-sm font-medium text-gray-700'>Gift Card Image</p>
                        <div className='flex gap-4 items-center'>
                            <div className='bg-gray-100 h-28 w-28 border border-dashed border-gray-300 flex items-center justify-center rounded-lg overflow-hidden relative group'>
                                {data.image ? (
                                    <img 
                                        alt='gift card' 
                                        src={data.image} 
                                        className='w-full h-full object-cover' 
                                    />
                                ) : (
                                    <div className='text-center'>
                                        <p className='text-[10px] text-gray-400'>1:1 Ratio Preferred</p>
                                    </div>
                                )}
                            </div>
                            <label htmlFor="uploadImage" className='flex-1'>
                                <div className={`px-4 py-2 rounded-md border text-center transition-all cursor-pointer font-medium text-sm
                                    ${!data.name ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'border-yellow-400 text-yellow-700 hover:bg-yellow-50'}
                                `}>
                                     {loading ? "Processing..." : "Choose Image"}
                                </div>
                                <input 
                                    disabled={!data.name || loading} 
                                    onChange={handleUploadImage} 
                                    type="file" 
                                    id='uploadImage' 
                                    className='hidden' 
                                    accept='image/*'
                                />
                            </label>
                        </div>
                    </div>

                    <button 
                        disabled={loading || !data.name || !data.image || !data.price}
                        className={`mt-2 py-2 rounded-md font-bold text-gray-800 transition-all shadow-md
                            ${(loading || !data.name || !data.image || !data.price) 
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                                : "bg-yellow-400 hover:bg-yellow-500 hover:shadow-lg active:scale-95 cursor-pointer"}
                        `}
                    >
                      {loading ? "Saving..." : "Create Gift Card"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default UploadGiftCardModel;
