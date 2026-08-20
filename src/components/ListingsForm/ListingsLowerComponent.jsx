"use client";
import { useContext } from "react";
import { IoReload } from "react-icons/io5";
import Modal from "@/components/Boat-listing/Modal";
import FooterAdd from "@/components/advertisementComponent/FooterAdd";
import ListingMapSection from "@/components/ListingsForm/ListingMapSection";
import { ListingContext } from "@/components/ListingContext/ListingsProvider";
import { isListingEvaluatorApprovedLocked } from "@/libs/listingEditLock";

const ListingsLowerComponent = ({
  image,
  submitConfirmation,
  loading,
  confirmationModal,
  handleSubmit,
  setConfirmationModal,
  id,
  mapUrl,
  handleChange,
  formData,
}) => {
  // Block submission while oversized images are being compressed via the API.
  const { isCompressing } = useContext(ListingContext) || {};
  const busy = loading || isCompressing;
  const fieldsLocked = isListingEvaluatorApprovedLocked(formData);

  return (
    <>
      <div className="grid place-items-center mt-[49px]">

        <FooterAdd />
      </div>
      <ListingMapSection
        mapUrl={mapUrl ?? formData?.mapUrl}
        handleChange={handleChange}
        disabled={fieldsLocked}
      />
      <div className="grid place-items-center mt-[30px] pb-[65px]">
        <button
          className={`text-whitee flex justify-center items-center md:text-xl sm:text-lg text-base font-medium md:w-[205px] md:px-0 px-3 h-10 md:h-[50px] rounded-[3px] bg-light-gold shadow-neons disabled:opacity-60 disabled:cursor-not-allowed`}
          onClick={submitConfirmation}
          disabled={busy}
        >
          {busy ? (
            <IoReload size={24} className="animate-spin" />
          ) : id ? (
            "Update"
          ) : (
            "Submit"
          )}
        </button>
        {confirmationModal && (
          <Modal
            show={confirmationModal}
            onSubmit={handleSubmit}
            onClose={() => setConfirmationModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default ListingsLowerComponent;
