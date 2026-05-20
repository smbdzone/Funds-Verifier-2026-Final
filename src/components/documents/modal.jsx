import React from "react";
import { DocumentPreviewBody } from "@/components/product-modal/DocumentPdfPreview";

const Modal = ({ isOpen, onClose, fileUrl, fileName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-3">
      <div className="flex h-[85vh] max-h-[900px] w-full max-w-4xl flex-col overflow-hidden rounded-md bg-white shadow-md">
        <div className="flex shrink-0 justify-end border-b border-gray-100 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Close"
          >
            X
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-4">
          <DocumentPreviewBody
            fileUrl={fileUrl}
            alt={fileName || "Document"}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
