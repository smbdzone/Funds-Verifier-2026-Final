import React from "react";
import Image from "next/image";
import { CloseIcon } from "@/components/Icons";
import "./style.css";

const Modal = ({ show, onClose, selectedImage, setSelectedImage }) => {
  if (!show) {
    return null;
  }

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const images = [
    "/avatar/Mask group (4).png",
    "/avatar/Mask group (5).png",
    "/avatar/Mask group (6).png",
    "/avatar/Mask group (7).png",
    "/avatar/Mask group (8).png",
    "/avatar/Mask group (9).png",
    "/avatar/Mask group (10).png",
    "/avatar/Mask group (11).png",
    "/avatar/Mask group (12).png",
    "/avatar/Mask group (13).png",
    "/avatar/Mask group (15).png",
    "/avatar/Mask group (16).png",
    "/avatar/Mask group (17).png",
    "/avatar/Mask group (18).png",
    "/avatar/Mask group (20).png",
    "/avatar/Mask group (21).png",
    "/avatar/Mask group (22).png",
    "/avatar/Avatars 2.png",
  ];

  return (
    <>
      <div className="fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-10"></div>
      <div className="fixed inset-0 z-20 flex items-center justify-center">
        <div className="bg-white rounded-lg w-[60%] sm:h-[70%] lg:my-0 my-3 max-h-full overflow-y-auto z-30 p-3">
          <div className="flex items-center justify-end">
            <span className="cursor-pointer" onClick={onClose}>
              <CloseIcon />
            </span>
          </div>
          <h2 className="text-black lg:text-2xl sm:text-lg text-base font-bold text-center pt-2 mb-4">
            Profile Picture
          </h2>

          <h3 className="text-black sm:text-base text-sm font-semibold mb-3">
            Choose an Avatar
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg">
                <Image
                  src={image}
                  alt={`Profile Image ${index + 1}`}
                  width={120}
                  height={120}
                />
                <input
                  type="checkbox"
                  checked={selectedImage === image}
                  onChange={() => handleImageSelect(image)}
                  className="absolute top-0 right-1 h-3 w-3 cursor-pointer accent-[#A2913E] checked:bg-[#A2913E]"
                />
              </div>
            ))}
          </div>
          <div className="justify-center flex gap-4 mt-4">
            <button
              className="text-sm sm:py-2.5 lg:px-5 sm:px-3 p-2 border-2 rounded-md text-white primary-gradient"
              onClick={onClose}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
