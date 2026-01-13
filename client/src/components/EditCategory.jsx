import { useState } from 'react';
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage.js';
import SummaryApi from '../common/SummaryApi.js';
import Axios from '../utils/Axios.js';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError.js';

const EditCategory = ({ data: CategoryData={} , close, fetchData }) => {
    const [data, setData] = useState({
        _id:CategoryData._id  ,
        name: CategoryData.name,
        image: CategoryData.image 
    });
    const [loading,setLoading]=useState(false)

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.updateCategory,
                data: data,
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
    

    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true)
        try {
            const response = await uploadImage(file);
            const { data: ImageResponse } = response;
            setLoading(false)
            setData((prev) => ({
                ...prev,
                image: ImageResponse.data.url
            }));
        } catch (error) {
            console.error("Image upload failed", error);
        }
    };
  return (
    <section className='fixed top-0 left-0 bottom-0 right-0 z-50 bg-neutral-800/60 flex items-center justify-center'>
            <div className='bg-white max-w-5xl w-full p-4 rounded'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-semibold text-black'> Update Category</h1>
                    <button onClick={close} className='w-fit block ml-auto cursor-pointer'>
                        <IoClose size={25} />
                    </button>
                </div>
                <form className='my-3 grid gap-2' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor="categoryName" className='text-neutral-800'>Name</label>
                        <input
                            type='text'
                            id='categoryName'
                            placeholder='Enter Category name'
                            value={data.name}
                            name='name'
                            onChange={handleOnChange}
                            className='bg-blue-50 p-2 border border-blue-100 outline-none focus-within:border-yellow-200 rounded'
                        />
                    </div>
                    <div>
                        <p className='text-neutral-800'>Image</p>
                        <div className='flex gap-4 flex-col lg:flex-row items-center'>
                            <div className='bg-blue-50 h-36 w-full lg:w-36 border flex items-center justify-center rounded overflow-hidden'>
                                {data.image ? (
                                    <img 
                                        alt='category' 
                                        src={data.image} 
                                        className='w-full h-full object-scale-down' 
                                    />
                                ) : (
                                    <p className='text-sm text-neutral-500'>No Image</p>
                                )}
                            </div>
                            <label htmlFor="uploadCategoryImage">
                                <div className={`${!data.name ? 'bg-gray-200' : 'border-yellow-400 hover:bg-yellow-400'} 
                                px-4 py-2 rounded cursor-pointer border text-neutral-800 font-medium`}>
                                    {loading ? "Loading..." : "Upload Image"}
                                </div>
                                <input 
                                    disabled={!data.name} 
                                    onChange={handleUploadCategoryImage} 
                                    type="file" 
                                    id='uploadCategoryImage' 
                                    className='hidden' 
                                    accept='image/*'
                                />
                            </label>
                        </div>
                    </div>
                    <button type='submit' className={
                        `
                        ${data.name && data.image ? " bg-yellow-400 hover:bg-yellow-300":" bg-gray-200"}
                        py-2 rounded font-semibold text-neutral-800 cursor-pointer 
                        `
                    }>
                       Update Category
                    </button>
                </form>
            </div>
        </section>
  )
}

export default EditCategory
