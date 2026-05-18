import React from "react";
import PDFViewer from "../product-modal/pdfviewer";
import { getFileExtensionFromUrl } from "@/utils";

const Modal = ({ isOpen, onClose, fileUrl, fileName }) => {
  if (!isOpen) return null;

  // Plain filenames (no query) still parse correctly through the URL helper.
  const fileExtension = getFileExtensionFromUrl(fileName || fileUrl);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-[80%] sm:h-[85vh]">
        <div className="flex justify-end items-center mb-0">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            X
          </button>
        </div>
        <div className="text-gray-700 mb-0 h-full overflow-auto">
          {fileExtension === "pdf" ? (
            <PDFViewer fileUrl={fileUrl} />
          ) : (
            <p className="text-center w-full p-2">Unsupported file type.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
