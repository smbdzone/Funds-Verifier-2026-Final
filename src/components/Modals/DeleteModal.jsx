
const DeleteModal = ({ onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 z-50 flex w-full h-full items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-[12px] shadow-lg w-96">
        <h2 className="text-lg text-[#8D7C3B] font-semibold mb-4">
          Delete Confirmation
        </h2>
        <p>Are you sure you want to delete this listing?</p>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="mr-4 px-4 py-2 bg-gray-200 text-gray-800 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-[#8D7C3B] text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
