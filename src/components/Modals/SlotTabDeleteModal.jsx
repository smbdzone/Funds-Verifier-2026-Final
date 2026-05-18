import React from "react";

const SlotTabDeleteModal = ({ handleConfirmDelete, closeDeleteModal }) => {
  return (
    <div className="fixed w-full inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-fit flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Confirm Deletion</h2>
        <p>Are you sure you want to delete this slot?</p>
        <div className="flex justify-end gap-4">
          <button
            className="primary-gradient text-white px-3 py-1 rounded-md"
            onClick={handleConfirmDelete}
          >
            Yes
          </button>
          <button
            className="bg-gray text-black px-3 py-1 rounded-md"
            onClick={closeDeleteModal}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotTabDeleteModal;
