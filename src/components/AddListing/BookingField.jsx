"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import CalenderModal from "./CalenderModal";
import BookingModal from "./BookingModal";

const BookingField = ({
  name,
  label,
  formData,
  modalData,
  errors,
  handleChange,
  handleOpenModal,
  isModalOpen,
  handleCloseModal,
  handleRequestModalData,
  placeholderText,
  maxLength = 50,
  iconSrc,
  required = false,
}) => {
  const [currentModalData, setCurrentModalData] = useState("");
  useEffect(() => {
    if (name === "evaluationDateTime") {
      setCurrentModalData(formData.evaluationDateTime || "");
    } else {
      const data = modalData.find((modal) => modal.modalName === name);
      setCurrentModalData(data?.dateTime || "");
    }
  }, [formData, modalData, name]);
  return (
    <div className="relative-placeholder w-full relative">
      <input
        type="text"
        maxLength={maxLength}
        className="shadow-neons w-full h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal"
        name={name}
        value={currentModalData || ""}
        onChange={handleChange}
        placeholder={placeholderText}
        required={required}
        disabled
      />
      <div
        className={` text-sm absolute right-10 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200 ease-in-out`}
      >
        {!required && (
          <span className="text-xs text-yellow-600">{" (Optional)"}</span>
        )}
      </div>
      {errors && errors[name] && (
        <span className="text-red-500 lg:text-sm text-xs font-medium absolute left-0 -bottom-5">
          **{errors[name]}
        </span>
      )}
      <button type="button" onClick={handleOpenModal}>
        {currentModalData ? (
          <Image
            width={23}
            height={23}
            src={iconSrc}
            alt="request"
            className="absolute right-[15px] top-[15px]"
          />
        ) : (
          <Image
            width={23}
            height={23}
            src="/icons/calender.png"
            alt="request"
            className="absolute right-[15px] top-[15px]"
          />
        )}
      </button>
      {isModalOpen &&
        (name === "evaluationDateTime" ? (
          <CalenderModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            formData={formData}
            setFormData={handleChange}
            parent={"evaluation"}
          />
        ) : (
          <BookingModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={(updatedData) =>
              handleRequestModalData({ ...updatedData, modalName: name })
            }
            productSlug={formData.slug}
            title={label}
            phoneNumber={formData.phoneNumber}
            formData={currentModalData}
            parent={"technicalN3d"}
          />
        ))}
    </div>
  );
};

export default BookingField;
