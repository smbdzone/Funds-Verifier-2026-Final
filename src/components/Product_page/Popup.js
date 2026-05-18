import React, { useState } from 'react';

function Popup({ checkedItems }) {
  const { secureTransaction, propertyInsurance, contentInsurance } = checkedItems;
  const [isOpen, setIsOpen] = useState(true);

  const handleClosePopup = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {secureTransaction && isOpen && (
        <div className="popup-container fixed top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="fixed top-1/2 w-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-l-3xl rounded-b-3xl bg-white p-8 rounded shadow-lg">
            <button
              onClick={handleClosePopup}
              className="absolute top-0 right-0 m-2 bg-red-500 text-gold-400 py-2 px-4 rounded"
            >
              X
            </button>
            <h1 className="text-gold-400 text-center font-medium text-2xl">Secure My Transaction</h1>
            <p className="text-base text-gray-700 font-normal py-2">
              For a small fee, enhance the security of your transaction with our added protection feature, providing peace
              of mind throughout your purchase process
            </p>
          </div>
        </div>
      )}
      {propertyInsurance && isOpen && (
        <div className="popup-container fixed top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="fixed top-1/2 w-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-l-3xl rounded-b-3xl bg-white p-8 rounded shadow-lg">
            <button
              onClick={handleClosePopup}
              className="absolute top-0 right-0 m-2 bg-red-500 text-gold-400 py-2 px-4 rounded"
            >
              X
            </button>
            <h1 className="text-gold-400 text-center font-medium text-2xl">Property Insurance</h1>
            <p className="text-base text-gray-700 font-normal py-2">
            Safeguard your asset against unforeseen events or damage post-purchase, providing financial protection for your property.
            </p>
          </div>
        </div>
      )}
      {contentInsurance && isOpen && (
        <div className="popup-container fixed top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="fixed top-1/2 w-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-l-3xl rounded-b-3xl bg-white p-8 rounded shadow-lg">
            <button
              onClick={handleClosePopup}
              className="absolute top-0 right-0 m-2 bg-red-500 text-gold-400 py-2 px-4 rounded"
            >
              X
            </button>
            <h1 className="text-gold-400 text-center font-medium text-2xl">Content Insurance</h1>
            <p className="text-base text-gray-700 font-normal py-2">
            Protect the contents within your property, car, or boat against damage, theft, or loss.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Popup;
