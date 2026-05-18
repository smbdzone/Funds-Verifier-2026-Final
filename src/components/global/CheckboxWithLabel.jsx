import React from "react";

const CheckboxWithLabel = ({ id, label, setSelectedCategories }) => {
  const handleCheckboxChange = (event) => {
    const { checked, id } = event.target;

    setSelectedCategories((prevCategories) =>
      checked
        ? [...prevCategories, id]
        : prevCategories.filter((category) => category !== id)
    );
  };

  return (
    <div className="flex items-center mb-2.5 gap-2">
      <input
        id={id}
        type="checkbox"
        value={id}
        className="w-4 h-4 text-blue bg-light border-lightgrey focus:ring-blue dark:focus:ring-blue"
        onChange={handleCheckboxChange}
      />
      <label htmlFor={id} className="text-base font-light whitespace-nowrap">
        {label}
      </label>
    </div>
  );
};

export default CheckboxWithLabel;
