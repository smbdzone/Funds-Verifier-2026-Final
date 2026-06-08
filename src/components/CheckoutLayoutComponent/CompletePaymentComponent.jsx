import React, { useState } from "react";
import Image from "next/image";
import PaymentMethodsModal from "./PaymentMethodsModal";
import { formatPriceUS } from "@/utils";
import PaymentChoiceModal from "@/components/payments/PaymentChoiceModal";
import { initiateClozerPayment, getClozerErrorMessage } from "@/libs/initiateClozerPayment";
import { applyFullPayDiscount } from "@/libs/paymentDiscount";
import { useProfile } from "@/context/UserContext";
import { toast } from "react-toastify";

const CompletePaymentComponent = ({
  title,
  data,
  previewMedia,
  priceInAed,
  feeInUsdt,
  priceInUsdt,
  setPaymentComplete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPaymentChoice, setShowPaymentChoice] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { user } = useProfile();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("crypto");
  const [feeAed, setFeeAed] = useState(
    data.assetType === "Car For Sale"
      ? 5510
      : data.assetType === "Boats For Sale"
        ? 7346
        : data.assetType === "Jewellery For Sale"
          ? 3670
          : 11020
  );
  const [feeUsd, setFeeUsd] = useState(
    data.assetType === "Car For Sale"
      ? 1500.14
      : data.assetType === "Boats For Sale"
        ? 2000
        : data.assetType === "Jewellery For Sale"
          ? 999.18
          : 3000.27
  );
  const handleClickOutside = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleCloseModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleStripeCheckout = async () => {
    const currentUrl = encodeURIComponent(window.location.href);

    try {
      setPaymentLoading(true);
      const response = await fetch("/api/stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: data.uuid,
          assetType:
            data.assetType === "Car For Sale"
              ? "car"
              : data.assetType === "Boats For Sale"
              ? "boat"
              : data.assetType === "Jewellery For Sale"
              ? "jewelry"
              : "property",
          pathName: currentUrl,
          previewMedia,
          applyFullPayDiscount: true,
        }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
      toast.error("Could not start card payment.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleClozerCheckout = async () => {
    if (!user?.uuid) {
      toast.error("Please log in to pay by installments.");
      return;
    }

    try {
      setPaymentLoading(true);
      const totalAed = Number(priceInAed) + Number(feeAed);
      const origin = window.location.origin;
      localStorage.setItem("clozerReturnUrl", window.location.href);

      const result = await initiateClozerPayment({
        userUUID: user.uuid,
        service: "purchase",
        price: totalAed,
        productTitle: title,
        productId: data.uuid,
        assetType: data.assetType,
        success_url: `${origin}/clozer-return`,
        purchaseMeta: {
          assetType: data.assetType,
          productId: data.uuid,
          totalAed,
        },
      });

      if (result?.redirectUrl) {
        localStorage.setItem("clozerTransactionId", result.transaction_id);
        window.location.href = result.redirectUrl;
      } else {
        toast.error(result?.message || "Installment payment could not be started.");
      }
    } catch (error) {
      toast.error(getClozerErrorMessage(error));
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleConfirmPurchase = () => {
    if (selectedPaymentMethod === "crypto") {
      setIsModalOpen(true);
      return;
    }
    setShowPaymentChoice(true);
  };

  const handleMethod = (method) => {
    if (method === "crypto") {
      return (
        <Image
          width={20}
          height={20}
          alt="Not found"
          src={"/icons/usdt-icon.svg"}
        />
      );
    } else {
      return "$";
    }
  };

  return (
    <div className="w-[90%] mx-auto">
      <p className="text-blue capitalize text-center text-[40px] font-bold">
        Complete Checkout
      </p>
      <div className="sm:flex xl:flex-nowrap items-start gap-6 lg:gap-8 flex-wrap mt-12">
        <div className="flex items-stretch sm:flex-row flex-col gap-4">
          {typeof previewMedia === "string" && previewMedia.endsWith(".mp4") ? (
            <video
              controls
              height={580}
              width={450}
              className="w-[70%] lg:w-[200px] h-[200px] object-cover rounded-lg"
              src={previewMedia}
            >
              Your browser does not support the video tag.
            </video>
          ) : typeof previewMedia === "string" &&
            previewMedia.startsWith("http") &&
            !previewMedia.endsWith(".jpg") ? (
            <Image
              src={previewMedia}
              height={680}
              alt="not found"
              width={450}
              className="w-[70%] lg:w-[200px] h-[200px] object-cover rounded-lg"
              frameBorder="0"
              allowFullScreen
              title="3D Walkthrough"
            />
          ) : (
            <Image
              alt={previewMedia || "not found"}
              quality={100}
              height={680}
              width={450}
              className="w-[70%] lg:w-[200px] h-[200px] object-cover rounded-lg"
              src={previewMedia || "/assets/images/room.jpg"}
            />
          )}
        </div>
        <div className="relative flex w-full h-[200px] items-start flex-col justify-between mt-6 sm:mt-0">
          <h1 className="text-blue capitalize text-[30px] font-semibold mb-1">
            {title}
          </h1>
          <div className="flex items-center w-full justify-between">
            <h1 className="text-[20px]">Current Price</h1>
            <p className="text-[15px] flex items-center gap-1">
              <span className="text-blue capitalize text-[25px] flex items-center gap-1 font-semibold mb-1">
                {handleMethod(selectedPaymentMethod)}
                {selectedPaymentMethod === "crypto"
                  ? formatPriceUS(priceInUsdt)
                  : formatPriceUS(data.price)}
              </span>{" "}
              {`AED(${formatPriceUS(priceInAed)})`}
            </p>
          </div>
          <div className="flex items-center w-full justify-between">
            <h1 className="text-[20px]">Fix Fee</h1>
            <p className="text-[15px] flex items-center gap-1">
              <span className="text-blue capitalize text-[25px] flex items-center gap-1 font-semibold mb-1">
                {handleMethod(selectedPaymentMethod)}
                {selectedPaymentMethod === "crypto"
                  ? formatPriceUS(feeInUsdt)
                  : formatPriceUS(feeUsd)}
              </span>{" "}
              {`AED(${formatPriceUS(feeAed)})`}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div
          className={`flex-grow text-blue capitalize text-[30px] mt-12 font-bold mb-1 w-full border-b-2 border-gold-800 flex justify-start py-1`}
        >
          Payment Method
        </div>
        <PaymentMethodsModal
          handleClickOutside={handleClickOutside}
          handleCloseModal={handleCloseModal}
          price={priceInUsdt + feeInUsdt}
          isOpen={isModalOpen}
          data={data}
        />
        <div className="flex justify-between items-center">
          <div className="my-9 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <label className="custom-radio-button">
                <input
                  checked={selectedPaymentMethod === "crypto"} // Check if this is the selected value
                  onChange={handlePaymentMethodChange}
                  value={"crypto"}
                  type="radio"
                  name="custom-radio-button"
                />
                <span className="radio-check"></span>
              </label>
              <Image
                alt="Not found"
                width={20}
                height={20}
                src={"/icons/usdt-icon.svg"}
              />
              Crypto
            </div>
            <div className="flex items-center gap-2">
              <label className="custom-radio-button">
                <input
                  checked={selectedPaymentMethod === "card"} // Check if this is the selected value
                  onChange={handlePaymentMethodChange}
                  type="radio"
                  value={"card"}
                  name="custom-radio-button"
                />
                <span className="radio-check"></span>
              </label>
              <Image
                width={25}
                height={25}
                src={"/icons/atm-cards.svg"}
                alt="Not found"
              />
              Card
            </div>
          </div>
          <div>
            <h1 className="text-[20px]">Total Price</h1>
            <p className="text-[15px] flex items-center gap-1">
              <span className="text-blue flex items-center gap-1 capitalize text-[25px] font-semibold mb-1">
                {handleMethod(selectedPaymentMethod)}
                {selectedPaymentMethod === "crypto"
                  ? formatPriceUS(priceInUsdt + feeInUsdt)
                  : formatPriceUS(data.price + feeUsd)}
              </span>{" "}
              {`AED(${formatPriceUS(priceInAed + feeAed)})`}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center">
        <div className="flex w-full justify-between items-center gap-5">
          <button
            onClick={() => setPaymentComplete(false)}
            className="w-[40px] mt-4 h-[56px] p-2 flex justify-center items-center text-gold-800 border  border-gold-800 flex-grow focus:outline-none text-[20px] font-semibold rounded "
          >
            Back
          </button>
          <button
            className="w-[40px]  mt-4 h-[56px] p-2 flex justify-center items-center text-white btn-gradient border-0 flex-grow focus:outline-none text-[20px] font-semibold rounded "
            onClick={handleConfirmPurchase}
          >
            {"Confirm Purchase"}
          </button>
        </div>
      </div>

      <PaymentChoiceModal
        show={showPaymentChoice}
        onClose={() => setShowPaymentChoice(false)}
        amount={Number(priceInAed) + Number(feeAed)}
        loading={paymentLoading}
        onPayFull={() => {
          setShowPaymentChoice(false);
          handleStripeCheckout();
        }}
        onPayInstallments={handleClozerCheckout}
      />
    </div>
  );
};

export default CompletePaymentComponent;
