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
          <div className="flex h-full min-h-0 w-full flex-col gap-2">
            <iframe
              src={selectedMedia}
              className="min-h-0 w-full flex-1 object-contain"
              frameBorder="0"
              allowFullScreen
              title="3D Walkthrough"
            />
            <a
              href={selectedMedia}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-center text-sm text-[#002d4f] underline"
            >
              Open in new tab
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewModal;
