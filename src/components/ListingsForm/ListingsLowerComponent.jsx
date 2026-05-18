"use client";
import { IoReload } from "react-icons/io5";
import Modal from "@/components/Boat-listing/Modal";
import FooterAdd from "@/components/advertisementComponent/FooterAdd";

const ListingsLowerComponent = ({
  image,
  submitConfirmation,
  loading,
  confirmationModal,
  handleSubmit,
  setConfirmationModal,
  id,
}) => {
  return (
    <>
      <div className="grid place-items-center mt-[49px]">
       
        <FooterAdd />
      </div>
      <div className="mt-[30px]">
        <iframe
          className="max-w-[1064px] w-full mx-auto sm:h-[351px] h-[300px] rounded-[5px] shadow-neons"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231280.4131872353!2d55.06267954491565!3d25.0762424478002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1716351024030!5m2!1sen!2s"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="grid place-items-center mt-[30px] pb-[65px]">
        <button
          className={`text-whitee flex justify-center items-center md:text-xl sm:text-lg text-base font-medium md:w-[205px] md:px-0 px-3 h-10 md:h-[50px] rounded-[3px] bg-light-gold shadow-neons`}
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
