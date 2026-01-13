import { useState } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../components/AddAddress";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditAddressDetail from "../components/EditAddressDetail";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";

const Addresses = () => {
  const addressList = useSelector((state) => state?.address?.addressList) || [];
  const {fetchAddress}=useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  

  const handleDelete = async(id) => {
    try {
      const response= await Axios({
        ...SummaryApi.disableAddress,
       data: { _id: id },
      })

      if(response?.data?.success){
        toast.success(response?.data?.message);
         
        if(fetchAddress){
           fetchAddress();
        }
       
      }
      
    } catch (error) {
      AxiosToastError(error)
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen py-4 sm:py-6">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm max-w-3xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h3 className="text-base sm:text-lg font-semibold">
              Delivery Address
            </h3>

            {addressList.length > 0 && (
              <button
                onClick={() => setOpenAddress(true)}
                className="text-sm text-green-700 font-medium hover:underline cursor-pointer self-start sm:self-auto"
              >
                + Add Address
              </button>
            )}
          </div>

          {/* BODY */}
          {addressList.length === 0 ? (
            <div className="border-2 border-dashed rounded-xl p-5 sm:p-6 text-center">
              <p className="text-gray-600 mb-3 text-sm sm:text-base">
                No address added yet
              </p>
              <button
                onClick={() => setOpenAddress(true)}
                className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg cursor-pointer text-sm font-medium"
              >
                + Add New Address
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {addressList.map((address) => (
                <div
                  key={address._id}
                  className={` group border rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 hover:border-green-600 transition ${!address.status && "hidden"}`}
                >
                  {/* ADDRESS INFO */}
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">
                      {address.fullName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {address.address_line}, {address.city}, {address.state} -{" "}
                      {address.pincode}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Mobile: {address.mobile}
                    </p>
                  </div>

                  {/* ACTION ICONS */}
                  <div className="flex gap-4 sm:gap-3 self-end sm:self-auto sm:opacity-0 sm:group-hover:opacity-100 transition">
                    <button
                      onClick={() => setEditAddress(address)}
                      className="text-blue-500 hover:text-blue-600 cursor-pointer"
                      title="Edit Address"
                    >
                      <FaEdit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(address._id)}
                      className="text-red-500 hover:text-red-600 cursor-pointer"
                      title="Delete Address"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADD ADDRESS MODAL */}
        {openAddress && <AddAddress close={() => setOpenAddress(false)} />}

        {/* EDIT ADDRESS MODAL */}
        {editAddress && (
          <EditAddressDetail
            close={() => setEditAddress(null)}
            data={editAddress} // ✅ FIXED
          />
        )}
      </div>
    </section>
  );
};

export default Addresses;
