import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  ChartPieIcon,
  CircleAlertIcon,
  ClockIcon,
  PencilIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";
import EditAdvertisementPopup from "./EditAdvertisementPopup";

const AdvertisementList = ({
  getUserAdvertisement,
  handleEditAdvertisementPopup,
  locations,
  token,
  setIsRended,
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [advertisementIdForDelete, setAdvertisementIdForDelete] =
    useState(null);
  const [creativeIdForDelete, setCreativeIdForDelete] = useState(null);
  const [isEditable, setIsEditable] = useState(null);
  const [EditableData, setEditableData] = useState({
    ads: null,
    creative: null,
  });

  const showDeletePopup = (adsId, creativeId) => {
    setAdvertisementIdForDelete(adsId);
    setCreativeIdForDelete(creativeId);
    setIsPopupVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (advertisementIdForDelete && creativeIdForDelete) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/advertisement/${advertisementIdForDelete}`,
          {
            params: { creativeId: creativeIdForDelete },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setIsRended(true);
          toast.success("Advertisement deleted successfully!");
        } else {
          toast.error("Failed to delete the advertisement.");
        }
      } catch (error) {
        toast.error("Error deleting advertisement: " + error.message);
      }
    }

    setIsPopupVisible(false);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      return "";
    }
  };

  const getSurveyStatus = (startAt, endAt) => {
    const currentDate = new Date();
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (currentDate < startDate) {
      return "Scheduled";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return "In Progress";
    } else {
      return "Completed";
    }
  };

  return (
    <div className="survey-listings-container !mt-0 mx-auto w-full !max-w-[88%]">
      <div className="bg-[#ffffff] w-full rounded-[12px] overflow-auto hide-scrollbar">
        <table className=" text-[#000000] w-full table-auto ">
          <thead>
            <tr className="table-head">
              <th className="pl-5 pr-4 text-start py-2">Image</th>
              <th className="pr-4 pl-5 text-start py-2">Type</th>
              <th className="px-4 text-start py-2">Start Date</th>
              <th className="px-4 text-start py-2">End Date</th>
              <th className="px-4 text-start py-2">Status</th>
              <th className="px-4 text-start py-2">Approval</th>
              <th className="px-4 text-start py-2">Payment Status</th>
              <th className="px-4 text-start py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {getUserAdvertisement && getUserAdvertisement.length > 0 ? (
              getUserAdvertisement.map((ads, index) =>
                ads.creatives.map((e) => {
                  const isCompleted =
                    getSurveyStatus(
                      ads.targetedAudience.startAt[0],
                      ads.targetedAudience.endAt[0]
                    ) === "Completed";
                  return (
                    <tr key={e.uuid}>
                      <td className="pl-3 py-2 h-[64px] w-[64px] text-start">
                        <Link href={e?.adLink} target="_blank">
                          <img
                            className=" object-cover h-full w-full rounded-[8px]"
                            src={e?.img}
                            alt=""
                          />
                        </Link>
                      </td>
                      <td className="pl-5 pr-4 whitespace-nowrap py-2 text-start">
                        {e.format}
                      </td>
                      <td className="px-4 whitespace-nowrap py-2 text-start">
                        {formatDate(ads.targetedAudience.startAt)}
                      </td>
                      <td className="px-4 whitespace-nowrap py-2 text-start">
                        {formatDate(ads.targetedAudience.endAt)}
                      </td>

                      <td
                        className="px-4 whitespace-nowrap py-2 text-start"
                        style={{ color: isCompleted ? "black" : "black" }}
                      >
                        {getSurveyStatus(
                          ads.targetedAudience.startAt[0],
                          ads.targetedAudience.endAt[0]
                        )}
                      </td>

                      <td
                        className="px-4 whitespace-nowrap py-2 text-start"
                        style={{ color: isCompleted ? "black" : "black" }}
                      >
                        {ShowApprovalStatus(ads)}
                      </td>
                      <td
                        className="px-4 whitespace-nowrap py-2 text-start"
                        style={{ color: isCompleted ? "black" : "black" }}
                      >
                        {ads.paymentStatus === 1
                          ? `Paid (${ads?.budget || "0"} AED)`
                          : "unpaid"}
                      </td>

                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/advertise-with-us/analytics?id=${ads.uuid}&creative=${e.uuid}`}
                            className="relative border group px-2 py-1 rounded-[4px] border-[#A2913E]"
                          >
                            <span className="absolute mt-1 -top-10 -left-3 whitespace-nowrap px-2 py-1 text-xs shadow-md bg-white rounded hidden group-hover:flex z-10">
                              Analytics
                            </span>
                            <ChartPieIcon className="size-5 text-[#A2913E]" />
                          </Link>
                          <button
                            onClick={() => showDeletePopup(ads.uuid, e.uuid)}
                            className="relative group border px-2 py-1 rounded-[4px] border-[#A2913E]"
                          >
                            <Trash2Icon className="size-5 text-[#A2913E]" />
                            <span className="absolute mt-1 -top-10 -left-3 whitespace-nowrap px-2 py-1 text-xs shadow-md bg-white rounded hidden group-hover:flex z-10">
                              Delete
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setIsEditable(true);
                              setEditableData({ ads: ads, creative: e });
                            }}
                            className="border px-2 py-1 rounded-[4px] border-[#A2913E]"
                          >
                            <PencilIcon className="size-5 text-[#A2913E]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )
            ) : getUserAdvertisement && getUserAdvertisement.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center h-32 px-4 py-2">
                  <span>No advertisements found.</span>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="8" className="text-center px-4 py-2">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isPopupVisible && (
        <DeleteConfirmationPopup
          isVisible={isPopupVisible}
          onClose={handleClosePopup}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {isEditable && (
        <EditPopup
          EditableData={EditableData}
          isVisible={isEditable}
          locations={locations}
          onClose={() => setIsEditable(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

const ShowApprovalStatus = (ad) => {
  switch (ad?.Approval) {
    case "Rejected":
      return (
        <span className="flex items-center gap-2">
          <span>Rejected</span>
          <span className="relative group">
            <CircleAlertIcon className="size-5 text-[#A2913E] cursor-pointer" />
            <span className="absolute left-0 -translate-x-1/2 bottom-full mb-2 z-10 hidden w-max max-w-[300px] break-words text-wrap rounded bg-white px-2 py-1 text-xs shadow-md group-hover:flex">
              {ad?.RejectedReason || "Rejected"}
            </span>
          </span>
        </span>
      );

    case "Pending":
      return (
        <span className="flex items-center gap-2">
          <span>Pending</span>
          <span className="relative group">
            <ClockIcon className="size-5 text-[#A2913E] cursor-pointer" />
            <span className="absolute left-0 -translate-x-1/2 bottom-full mb-2 z-10 hidden w-max max-w-[300px] break-words text-wrap rounded bg-white px-2 py-1 text-xs shadow-md group-hover:flex">
              {"Your advertisement will be reviewed within 1 to 24 hours."}
            </span>
          </span>
        </span>
      );

    case "Approved":
      return <span className="flex items-center gap-2">Approved</span>;

    default:
      <span className="flex items-center gap-2">
        <span>Pending</span>
        <span className="relative group">
          <ClockIcon className="size-5 text-[#A2913E] cursor-pointer" />
          <span className="absolute left-0 -translate-x-1/2 bottom-full mb-2 z-10 hidden w-max max-w-[300px] break-words text-wrap rounded bg-white px-2 py-1 text-xs shadow-md group-hover:flex">
            {"Your advertisement will be reviewed within 1 to 24 hours."}
          </span>
        </span>
      </span>;
  }
};

const DeleteConfirmationPopup = ({ isVisible, onClose, onConfirm }) => {
  if (!isVisible) return null;

  return (
    <div className="popup-container fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/[.3] from-black to-transparent bg-blend-multiply z-50">
      <div className="relative bg-white w-[90%] md:w-[50%] lg:w-[30%] p-6 rounded-[15px] shadow-lg">
        <div className="flex items-center justify-between w-full mb-3">
          <h2 className="text-[#002D4F] !font-medium !text-[24px] mt-4 mb-2">
            Are you sure you want to delete?
          </h2>
        </div>
        <div className="flex items-center flex-col gap-4 w-full">
          <div className="flex gap-4 w-full justify-center">
            <button
              style={{
                height: "47px",
                width: "100px",
              }}
              onClick={onConfirm}
              className="BuyTokenBtn text-black hover:bg-[#A2913E] hover:text-white px-2 py-1 rounded-[4px] border border-[#A2913E] transition duration-300"
            >
              Yes
            </button>
            <button
              style={{
                height: "47px",
                width: "100px",
              }}
              onClick={onClose}
              className="BuyTokenBtn border px-2 py-1 rounded-[4px]  bg-[#002D4F] text-white transition duration-300"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditPopup = ({
  isVisible,
  onClose,
  locations,
  onConfirm,
  EditableData,
}) => {
  if (!isVisible) return null;
  return (
    <EditAdvertisementPopup onClose={onClose} EditableData={EditableData} />
  );
};

export default AdvertisementList;
