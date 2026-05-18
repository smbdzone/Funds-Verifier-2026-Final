import React from "react";

const ListingImageUploadLayout = ({ children, errors, formats }) => {
  return (
    <div
      className={`${
        errors ? "border-red-500 border" : "shadow-neons"
      } h-[191px] relative px-[20px] pt-[13px]`}
    >
      <h2 className="text-dark-grey text-[15px] font-normal leading-[26px]">
        Accepted formats:
      </h2>
      <p className="text-dark-grey text-[10px] font-normal leading-[177%]">
        {formats}
      </p>
      {children}
    </div>
  );
};

export default ListingImageUploadLayout;
