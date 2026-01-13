import { IoClose } from "react-icons/io5";
import { FaExclamationTriangle } from "react-icons/fa";

const ConfirmBox = ({ cancel, confirm, close }) => {
  return (
   <section className="
  fixed inset-0 z-50
  bg-neutral-800/60
  flex justify-center items-center
  px-3 sm:px-0
">
  <div className="
    bg-white w-full max-w-md
    p-4 sm:p-6
    rounded-lg shadow-lg
  ">

    {/* Close Button */}
    <div className="flex justify-end">
      <button
        onClick={close}
        className="text-gray-500 hover:text-gray-800 cursor-pointer"
      >
        <IoClose size={22} />
      </button>
    </div>

    {/* Warning Icon & Title */}
    <div className="flex flex-col items-center text-center">
      <FaExclamationTriangle className="text-red-500 text-3xl sm:text-4xl mb-2" />

      <h2 className="text-base sm:text-lg font-semibold text-gray-800">
        Confirm Deletion
      </h2>

      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
        Are you sure you want to permanently delete this item?
        This action cannot be undone.
      </p>
    </div>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
      <button
        onClick={cancel}
        className="w-full sm:w-auto px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 cursor-pointer"
      >
        Cancel
      </button>

      <button
        onClick={confirm}
        className="w-full sm:w-auto px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white cursor-pointer"
      >
        OK
      </button>
    </div>

  </div>
</section>

  );
};

export default ConfirmBox;
