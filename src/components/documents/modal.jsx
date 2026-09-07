import React from "react";
import { DocumentPreviewBody } from "@/components/product-modal/DocumentPdfPreview";

const Modal = ({ isOpen, onClose, fileUrl, fileName }) => {
  if (!isOpen) return null;

  const downloadName =
    fileName?.trim() ||
    fileUrl?.split("/")?.pop()?.split("?")[0] ||
    "document.pdf";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-3">
      <div className="w-full max-w-lg overflow-hidden rounded-md bg-white shadow-md">
        <div className="flex justify-end border-b border-gray-100 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded border-2 border-light-gold text-light-gold font-semibold hover:bg-light-gold/10"
            aria-label="Close"
          >
            X
          </button>
        </div>
        <DocumentPreviewBody
          fileUrl={fileUrl}
          alt={fileName || "Document"}
          downloadFileName={downloadName}
          onDone={onClose}
        />
      </div>
    </div>
  );
};

export default Modal;
