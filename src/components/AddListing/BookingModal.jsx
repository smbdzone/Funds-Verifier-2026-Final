/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import Image from "next/image";
import CalenderModal from "./CalenderModal";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const BookingModal = ({
  isOpen,
  onClose,
  onSave,
  title,
  productSlug,
  phoneNumber,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showCheckboxError, setShowCheckboxError] = useState(false);
  const [formData, setFormData] = useState({
    modalName: title,
    name: "",
    email: "",
    dateTime: "",
    phone: phoneNumber,
    productId: "",
    product: productSlug,
  });

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.dateTime &&
    formData.phone &&
    isChecked;

  const handleSave = () => {
    if (!isChecked) {
      setShowCheckboxError(true);
      return;
    }

    setShowCheckboxError(false);
    onSave(formData);
    onClose();
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="relative bg-white p-5 rounded shadow-lg w-11/12 md:w-1/2 text-[#002D4F]">
          <h2 className="text-3xl font-semibold mb-4">{title}</h2>
          <p className="mb-8 md:w-[70%]">
            If you don't have one and you need one, please request to have one
            created for you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-xl">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.value)
                }
                className="w-full p-2 border rounded"
                placeholder="Full Name"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-xl">Email</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.value)
                }
                className="w-full p-2 border rounded"
                placeholder="Email"
              />
            </div>
            <div className="flex flex-col relative">
              <label className="mb-1 text-xl">Date & Time</label>
              <input
                type="text"
                name="dateTime"
                value={formData.dateTime}
                readOnly
                className="w-full p-2 border rounded"
                placeholder="Date & Time"
              />
              <Image
                src="/assets/images/clock.png"
                alt="Clock Icon"
                width={20}
                height={20}
                onClick={handleOpenModal}
                className="absolute right-2 top-10 cursor-pointer"
              />
              <CalenderModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                formData={formData}
                setFormData={setFormData}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-xl">Phone Number</label>
              <PhoneInput
                international
                defaultCountry="AE"
                name="phone"
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                className="w-full p-2 border rounded"
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <div className="flex items-center my-2 gap-2">
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label>
              We authorize you to access the building and / or the community
            </label>
          </div>
          {showCheckboxError && (
            <p className="text-red-500 mt-2">
              You must accept the conditions to proceed.
            </p>
          )}
          <div className="mt-8 mx-auto flex justify-center">
            <button
              className={`btn-gradient font-medium text-xl px-8 py-2 ${
                !isFormValid ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={handleSave}
              type="button"
              disabled={!isFormValid}
            >
              Book now
            </button>
          </div>
          <div className="absolute top-2 right-2 flex justify-end">
            <button
              className="px-4 py-2 bg-blue-500 text-prussianBlue rounded"
              onClick={onClose}
              type="button"
            >
              X
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default BookingModal;
