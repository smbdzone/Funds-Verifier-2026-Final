import React from "react";

const CheckboxInput = ({ label, value, checked, onChange }) => {
  return (
    <div className="w-full flex items-center space-x-2">
      <input
        className="custom-checkbox"
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label className="custom-label whitespace-nowrap truncate">{label}</label>
    </div>
  );
};
export default CheckboxInput;
