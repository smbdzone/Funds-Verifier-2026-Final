import React from "react";
import ListingFieldLabel from "@/components/ListingsForm/ListingFieldLabel";

const ListingImageUploadLayout = ({ children, errors, formats, label, required = false }) => {
  return (
    <div
      className={`${errors ? "border-red-500 border" : "shadow-neons"
        } relative flex h-[191px] flex-col overflow-hidden px-[20px] pt-[13px] pb-[12px]`}
    >
      {label ? <ListingFieldLabel label={label} required={required} className="mb-1 shrink-0" /> : null}
      <h2 className="shrink-0 text-dark-grey text-[15px] font-normal leading-[22px]">
        Accepted formats:
      </h2>
      <p className="mb-2 shrink-0 text-dark-grey text-[10px] font-normal leading-[140%] line-clamp-2">
        {formats}
      </p>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
};

export default ListingImageUploadLayout;
