import { useEffect, useState } from 'react'
import UploadGiftCardModel from '../components/UploadGiftCardModel'
import EditGiftCardModel from '../components/EditGiftCardModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { FaEdit, FaTrash } from "react-icons/fa"; 
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const GiftCardAdmin = () => {
    const [openUpload, setOpenUpload] = useState(false)
    const [loading, setLoading] = useState(false)
    const [giftCards, setGiftCards] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState(null)
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false) 
    const [deleteData, setDeleteData] = useState(null)

    const fetchGiftCards = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getGiftCard
            })
            const { data: responseData } = response
            if (responseData.success) {
                setGiftCards(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGiftCards()
    }, [])

    const handleDelete = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteGiftCard,
                url: `${SummaryApi.deleteGiftCard.url}/${deleteData._id}`
            })
            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                setOpenConfirmDelete(false)
                fetchGiftCards()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='bg-white min-h-[80vh] rounded-lg shadow-sm'>
            <div className='p-4 border-b flex items-center justify-between'>
                <h2 className='font-bold text-xl text-gray-800'>Manage Gift Cards</h2>
                <button 
                    onClick={() => setOpenUpload(true)} 
                    className='bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-2 rounded-md font-semibold transition-all shadow-sm active:scale-95 cursor-pointer'
                >
                    Add Gift Card
                </button>
            </div>

            {loading && giftCards.length === 0 ? (
                <div className='p-10 flex justify-center'>
                    <Loading />
                </div>
            ) : giftCards.length === 0 ? (
                <div className='p-10'>
                    <NoData />
                </div>
            ) : (
                <div className='p-4 overflow-x-auto'>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>
                                <th className='px-4 py-3 border-b'>Image</th>
                                <th className='px-4 py-3 border-b'>Name</th>
                                <th className='px-4 py-3 border-b'>Price</th>
                                <th className='px-4 py-3 border-b'>Disc.</th>
                                <th className='px-4 py-3 border-b'>Status</th>
                                <th className='px-4 py-3 border-b text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {giftCards.map((card, index) => (
                                <tr key={card._id || index} className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-4 py-3'>
                                        <div className='w-12 h-12 rounded bg-gray-100 overflow-hidden flex items-center justify-center border'>
                                            <img src={card.image} alt={card.name} className='w-full h-full object-cover' />
                                        </div>
                                    </td>
                                    <td className='px-4 py-3 font-medium text-gray-700'>{card.name}</td>
                                    <td className='px-4 py-3 text-gray-600'>₹{card.price}</td>
                                    <td className='px-4 py-3 text-green-600 font-semibold'>{card.discount}%</td>
                                    <td className='px-4 py-3'>
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${card.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {card.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <div className='flex justify-center gap-3'>
                                            <button 
                                                onClick={() => {
                                                    setEditData(card)
                                                    setOpenEdit(true)
                                                }}
                                                className='text-blue-500 hover:text-blue-700 transition-colors cursor-pointer'
                                                title='Edit'
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setDeleteData(card)
                                                    setOpenConfirmDelete(true)
                                                }}
                                                className='text-red-500 hover:text-red-700 transition-colors cursor-pointer'
                                                title='Delete'
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {openUpload && (
                <UploadGiftCardModel 
                    fetchData={fetchGiftCards} 
                    close={() => setOpenUpload(false)} 
                />
            )}
            
            {openEdit && (
                <EditGiftCardModel 
                    editData={editData} 
                    fetchData={fetchGiftCards} 
                    close={() => setOpenEdit(false)} 
                />
            )}

            {openConfirmDelete && (
                <ConfirmBox 
                    close={() => setOpenConfirmDelete(false)} 
                    cancel={() => setOpenConfirmDelete(false)} 
                    confirm={handleDelete} 
                    title="Delete Gift Card?"
                    description={`Are you sure you want to delete "${deleteData?.name}"? This action cannot be undone.`}
                />
            )}
        </section>
    )
}

export default GiftCardAdmin;
