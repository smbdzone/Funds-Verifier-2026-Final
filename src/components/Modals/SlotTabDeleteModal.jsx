import React from "react";

const SlotTabDeleteModal = ({ handleConfirmDelete, closeDeleteModal, loading = false }) => {
  return (
    <div className="fixed w-full inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-fit flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Confirm Deletion</h2>
        <p>Are you sure you want to delete this slot?</p>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="primary-gradient text-white px-3 py-1 rounded-md disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes'}
          </button>
          <button
            type="button"
            className="bg-gray text-black px-3 py-1 rounded-md disabled:cursor-not-allowed disabled:opacity-60"
            onClick={closeDeleteModal}
            disabled={loading}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotTabDeleteModal;
