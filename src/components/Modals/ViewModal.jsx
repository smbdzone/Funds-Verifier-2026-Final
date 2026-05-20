import React from "react";
import { ExternalLinkPreview } from "@/components/product-modal/DocumentPdfPreview";

const ViewModal = ({ handleClickOutside, handleCloseModal, selectedMedia }) => {
  return (
    <div
      id="modalOverlay"
      className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleClickOutside}
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-lg bg-white p-4 shadow-lg">
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
          <ExternalLinkPreview
            href={selectedMedia}
            title="3D Walkthrough"
            onDone={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default ViewModal;
