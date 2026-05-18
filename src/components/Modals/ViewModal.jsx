import React from "react";

const ViewModal = ({ handleClickOutside, handleCloseModal, selectedMedia }) => {
  return (
    <div
      id="modalOverlay"
      className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleClickOutside}
    >
      <div className="w-[50%] h-[70%] bg-white p-2 rounded-md relative">
        <button
          className="absolute top-2 right-2 text-4xl"
          onClick={handleCloseModal}
        >
          &times;
        </button>
        {selectedMedia.includes(".mp4") ? (
          <video
            src={selectedMedia}
            controls
            className="w-full h-full object-contain"
          />
        ) : selectedMedia.includes(".jpg" || ".png") ? (
          <img
            src={selectedMedia}
            alt="Selected"
            className="w-full h-full object-contain"
          />
        ) : (
          <iframe
            src={selectedMedia}
            className="w-full h-full object-contain"
            frameBorder="0"
            allowFullScreen
            title="3D Walkthrough"
          />
        )}
      </div>
    </div>
  );
};

export default ViewModal;
