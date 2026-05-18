import React from "react";

const ChecksLayoutComponent = ({
  carListings,
  colors,
  technicalFeatures,
  extras,
  handleRadioChange,
  handleCheckboxChange,
  formData,
}) => {
  return (
    <>
      <div className="px-[19px]">
        {formData.price >= 200000 ? (
          <>
            <h2 className="text-dark-black text-xl font-medium pt-5">
              Listing
            </h2>
            <form className="mt-[10px] grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1  justify-between gap-y-[10px]">
              {carListings.map((listing, index) => (
                <div key={index} className="radio-container flex">
                  <input
                    className="custom-radio visually-hidden custom-checkbox"
                    type="radio"
                    name="listing"
                    value={listing}
                    id={`listing-${index}`}
                    checked={formData.listing === listing}
                    onChange={(e) => handleRadioChange(e, "listing")}
                  />
                  <label className="custom-label" htmlFor={`listing-${index}`}>
                    {listing}
                  </label>
                </div>
              ))}
            </form>
            <br />
          </>
        ) : (
          <></>
        )}
        <h2 className="text-dark-black text-xl font-medium">Exterior Color</h2>
        <form className="mt-[10px] grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 xxs:grid-cols-2 justify-between gap-y-[10px]">
          {colors.map((color, index) => (
            <div key={index}>
              <input
                className="custom-checkbox"
                type="checkbox"
                value={color}
                checked={(formData.exteriorColor || []).includes(color)}
                onChange={(e) => handleCheckboxChange(e, "exteriorColor")}
              />
              <label className="custom-label">{color}</label>
            </div>
          ))}
        </form>

        {/* 2  */}
        <h2 className="text-dark-black text-xl font-medium pt-5">
          Interior Color
        </h2>
        <form className="mt-[10px] grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 xxs:grid-cols-2 justify-between gap-y-[10px]">
          {colors.map((color, index) => (
            <div key={index}>
              <input
                className="custom-checkbox"
                type="checkbox"
                value={color}
                checked={(formData.interiorColor || []).includes(color)}
                onChange={(e) => handleCheckboxChange(e, "interiorColor")}
              />
              <label className="custom-label">{color}</label>
            </div>
          ))}
        </form>

        <h2 className="text-dark-black text-xl font-medium pt-5">
          Technical Features
        </h2>
        <form className="mt-[10px] grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1  justify-between gap-y-[10px]">
          {technicalFeatures.map((technicalFeature, index) => (
            <div key={index}>
              <input
                className="custom-checkbox"
                type="checkbox"
                value={technicalFeature}
                checked={(formData.technicalFeatures || []).includes(
                  technicalFeature
                )}
                onChange={(e) => handleCheckboxChange(e, "technicalFeatures")}
              />
              <label className="custom-label">{technicalFeature}</label>
            </div>
          ))}
        </form>
        {/* 4 */}
        <h2 className="text-dark-black text-xl font-medium pt-5">Extras</h2>
        <form className="mt-[10px] grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1 justify-between gap-y-[10px]">
          {extras.map((extra, index) => (
            <div className="flex items-center" key={index}>
              <input
                className="custom-checkbox"
                type="checkbox"
                value={extra}
                checked={(formData.extras || []).includes(extra)}
                onChange={(e) => handleCheckboxChange(e, "extras")}
              />
              <label className="custom-label">{extra}</label>
            </div>
          ))}
        </form>
      </div>
    </>
  );
};

export default ChecksLayoutComponent;
