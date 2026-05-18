import React from "react";

const InputField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-[#969696]">{label}</label>
    <input
      type="text"
      value={value || ""}
      className="focus:outline-none mt-1 block w-full pl-5 py-3 rounded-md bg-white text-[#969696] text-sm border border-[#969696]"
      readOnly
    />
  </div>
);

export default InputField;
