import React, { useState } from "react";
import PropTypes from "prop-types";

const ProfileModal = ({ handleClose, userData, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!validateEmail(formData.email)) {
        alert("Invalid email");
        setLoading(false);
        return;
      }
      if (!validatePhone(formData.phone)) {
        alert("Invalid phone number");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return;
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9\b]+$/;
    return re.test(phone);
  };

  return (
    <div className="w-[700px] h-[95%] overflow-y-auto hide-scrollbar rounded-2xl">
      <div className="w-full h-[20%] bg-[#f1efef] rounded-t-2xl"></div>
      <div className="w-full flex flex-col gap-5 bg-white rounded-b-2xl relative py-5 px-10 text-prussianBlue">
        <div className="w-[100px] h-[100px] -mt-[74px] absolute pt-3 rounded-full bg-[#D9d9d9] flex items-end justify-end overflow-hidden">
          <img className="" src="/avatar/Avatars 2.png" alt="User Avatar" />
        </div>
        <button className="w-fit self-end text-sm rounded-lg border border-[#D9D9D9] p-2 font-semibold">
          View Profile
        </button>
        <div className="">
          <h2 className="font-semibold text-xl">
            {userData?.name || "John Smith"}
          </h2>
          <p className="text-sm text-black">
            {userData?.email || "jIb5y@example.com"}
          </p>
        </div>
        <div>
          <div className="w-full grid grid-cols-2 gap-10 items-center border-t border-[#D9D9D9] py-5 pl-5">
            <label className="text-lg font-semibold">Username</label>
            <div className="flex">
              <input
                className="p-3 rounded-l-lg border border-r-0 border-[#D9D9D9] w-full text-sm"
                placeholder="untitles/ui.com"
                value="untitles/ui.com"
                disabled
              />
              <input
                name="username"
                className="p-3 rounded-r-lg border border-[#D9D9D9] w-full font-semibold text-sm focus:outline focus:outline-1 focus:outline-prussianBlue"
                placeholder="John Smith"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-10 items-center border-t border-[#D9D9D9] py-5 pl-5">
            <label className="text-lg font-semibold">Email</label>
            <input
              name="email"
              className="p-3 rounded-lg border border-[#D9D9D9] w-full font-semibold text-sm focus:outline focus:outline-1 focus:outline-prussianBlue"
              placeholder="johndoe@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="w-full grid grid-cols-2 gap-10 items-center border-t border-[#D9D9D9] py-5 pl-5">
            <label className="text-lg font-semibold">Phone Number</label>
            <input
              name="phone"
              className="p-3 rounded-lg border border-[#D9D9D9] w-full font-semibold text-sm focus:outline focus:outline-1 focus:outline-prussianBlue"
              placeholder="(933) 93 39 933"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="w-full flex justify-between items-center border-t border-[#D9D9D9] py-8">
          <button
            onClick={handleClose}
            className="w-fit text-sm rounded-lg border border-[#D9D9D9] p-2 font-semibold text-red flex gap-2"
          >
            <img src="/icons/delete.svg" alt="Delete Icon" />
            Delete
          </button>
          <div className="flex gap-4">
            <button
              onClick={handleClose}
              className="w-fit text-sm rounded-lg border border-[#D9D9D9] text-prussianBlue p-2 px-5 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`w-fit text-sm rounded-lg text-white bg-prussianBlue p-2 font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfileModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func,
};

export default ProfileModal;
