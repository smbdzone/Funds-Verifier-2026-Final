import React from "react";
import "./styles.css";

const ConfirmationPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-[#8D7C3B] p-6 rounded-[12px] w-[300px] text-center">
        <div className="text-white md:text-lg sm:text-base text-sm mb-4">
          Your viewing requirement has been noted. One of our admins will
          contact you within 4 hours.
        </div>
        <button
          onClick={onClose}
          className="md:mt-2 mt-1 md:text-base sm:text-sm text-xs py-1 px-3 text-[#8D7C3B] bg-[#FFFFFF] cursor-pointer rounded-[4px]"
        >
          Okay
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
