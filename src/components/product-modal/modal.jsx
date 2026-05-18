import React, { useState } from "react";
import PDFViewer from "./pdfviewer";
import { FaDownload } from "react-icons/fa6";
import Image from "next/image";
import { getFileExtensionFromUrl } from "@/utils";

const Modal = ({ isOpen, onClose, fileUrl }) => {
  if (!isOpen) return null;

  const fileExtension = getFileExtensionFromUrl(fileUrl);
  const handleOpenAndDownload = () => {
    if (fileUrl) {
      // Open the file in a new tab
      const newTab = window.open(fileUrl, "_blank");

      if (newTab) {
        // Add a delay before triggering the download to ensure the new tab is fully opened
        setTimeout(() => {
          const link = document.createElement("a");
          link.href = fileUrl;
          link.download = fileUrl.split("/").pop(); // Extract file name from the URL
          // Append link to the new tab's document to avoid affecting the current tab
          newTab.document.body.appendChild(link);
          link.click();
          newTab.document.body.removeChild(link); // Clean up
        }, 500); // Adjust delay as needed
      } else {
        console.error("Failed to open new tab. Check popup blocker settings.");
      }
    } else {
      console.error("File URL is not provided.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-md shadow- md:max-w-[60%] w-[95%] h-[80vh] overflow-y-hidden">
        <div className="w-full p-6 relative">
          <div className="absolute top-3 right-4 flex justify-end items-center mb-0">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              X
            </button>
          </div>
          <div className="flex justify-between mt-4 items-center mb-2">
            <div className="flex items-center justify-center">
              <Image
                src="/assets/images/logo.svg"
                alt="logo"
                height={100}
                width={100}
                className="md:h-auto md:w-auto h-10 w-10"
              />
              <h3 className="lg:text-xl md:text-lg text-sm text-blue">
                Funds Verifier
              </h3>
            </div>
            <div className="flex gap-2 items-center">
              <div className="lg:text-xl md:text-lg truncate text-sm text-blue font-bold">
                <h3>Technincal Report</h3>
              </div>
              <div className="flex justify-center items-center mt-0">
                <button
                  className=" px-1 rounded-md"
                  onClick={handleOpenAndDownload}
                >
                  <FaDownload color="#002d4f" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-gray-700 mb-0 h-full overflow-auto">
          {fileExtension === "pdf" ? (
            <PDFViewer fileUrl={fileUrl} />
          ) : fileExtension === "jpg" ||
            fileExtension === "jpeg" ||
            fileExtension === "png" ? (
            <img
              src={fileUrl}
              alt="Uploaded file"
              style={{ maxWidth: "100%", maxHeight: "500px" }}
            />
          ) : fileExtension === "doc" ||
            fileExtension === "docx" ||
            fileExtension === "xlsx" ? (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View or Download {fileExtension === "xlsx" ? "Excel" : "Document"}
            </a>
          ) : (
            <p className="text-center w-full p-2">Unsupported file type.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
