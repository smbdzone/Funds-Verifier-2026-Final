import Image from "next/image";
import React from "react";
import ConfirmationModal from "@/components/AddListing/ConfirmationModal";
import { IoReload } from "react-icons/io5";
import { isListingEvaluatorApprovedLocked } from "@/libs/listingEditLock";

const Facilities = React.memo(
  ({
    formData,
    listings,
    handleRadioChange,
    handleCheckboxChange,
    facilities,
    adImage,
    submitConfirmation,
    loading,
    confirmationModal,
    handleSubmit,
    setConfirmationModal,
    id,
  }) => {
    const fieldsLocked = isListingEvaluatorApprovedLocked(formData)
    // Private/Public stays editable after approval; show on edit so visibility can change.
    const showListingVisibility =
      Number(formData?.price) >= 5000000 || Boolean(id) || fieldsLocked

    return (
      <div className="pt-[30px]">
        <div className="px-[19px] space-y-3">
          {showListingVisibility ? (
            <>
              <h2 className="text-dark-black text-xl font-medium pt-5">
                Listing
              </h2>
              <form className="mt-[10px] grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1  justify-between gap-y-[10px]">
                {listings.map((listing, index) => (
                  <div key={index} className="radio-container flex">
                    <input
                      className="custom-radio visually-hidden custom-checkbox"
                      type="radio"
                      name="listing"
                      value={listing || ""}
                      id={`listing-${index}`}
                      checked={formData.listing === listing}
                      onChange={(e) => handleRadioChange(e, "listing")}
                    />
                    <label
                      className="custom-label"
                      htmlFor={`listing-${index}`}
                    >
                      {listing}
                    </label>
                  </div>
                ))}
              </form>
            </>
          ) : (
            <></>
          )}

          {/* 4 */}

          <h2 className="text-dark-black text-xl font-medium">Facilities</h2>
          <form className="mt-[10px] grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1  justify-between gap-y-[10px]">
            {facilities?.map((facilitie, index) => (
              <div className="flex" key={index}>
                <input
                  className="custom-checkbox"
                  type="checkbox"
                  value={facilitie || ""}
                  checked={formData.facilities?.includes(facilitie)}
                  onChange={(e) => handleCheckboxChange(e, "facilities")}
                  disabled={fieldsLocked}
                />
                <label className="custom-label">{facilitie}</label>
              </div>
            ))}
          </form>
        </div>

        {/* 4 end  */}
        <div className="grid place-items-center mt-[49px]">
          <Image
            width={1500}
            quality={90}
            className="w-[98%]"
            height={700}
            src={adImage}
            alt="car"
          />
        </div>
        {/* map  */}
        <div className="mt-[30px]">
          <iframe
            className="max-w-[1064px] w-full mx-auto h-[351px] rounded-[5px] shadow-neons"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231280.4131872353!2d55.06267954491565!3d25.0762424478002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1716351024030!5m2!1sen!2s"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="grid place-items-center mt-[30px] pb-[65px]">
          <button
            className={`text-whitee flex justify-center items-center text-xl font-medium w-[205px] h-[50px] rounded-[3px] bg-light-gold shadow-neons`}
            onClick={submitConfirmation}
            disabled={loading}
          >
            {loading ? (
              <IoReload size={24} className="animate-spin" />
            ) : id ? (
              "Update"
            ) : (
              "Submit"
            )}
          </button>
          {confirmationModal && (
            <ConfirmationModal
              show={confirmationModal}
              onSubmit={handleSubmit}
              title="Asset Verification"
              content={
                "Please note that all listings on our platform are subject to verification and evaluation. Your listing will remain pending until you obtain an evaluation certificate from one of the evaluators available in your country. Our platform displays only verified listings to potential buyers. Thank you for your understanding."
              }
              onClose={() => setConfirmationModal(false)}
            />
          )}
        </div>
      </div>
    );
  }
);
Facilities.displayName = "Facilities";

export default Facilities;
