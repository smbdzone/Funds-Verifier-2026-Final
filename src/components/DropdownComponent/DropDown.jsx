import { useState } from "react";
import { SlArrowRight, SlArrowDown } from "react-icons/sl";

const DropDown = ({
  dropdown3D,
  setCategory,
  category,
  subCategory,
  setSubCategory,
  bedroomsDropDown,
  setFormData,
  formData,
  setValue,
  value,
  dropdown,
  fetchPrice,
  buttonClassName = 'text-sm text-black/60',
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [isBedroomsDropdownOpen, setIsBedroomsDropdownOpen] = useState(false);
  const [index, setIndex] = useState(-1);

  const toggleDropdown = () => setIsDropdownOpen((o) => !o);
  const toggleBedroomsDropdown = () => setIsBedroomsDropdownOpen((o) => !o);

  const toggleSubDropdown = (i, val) => {
    if (index === i && isSubDropdownOpen) {
      setIsSubDropdownOpen(false);
      setIndex(-1);
    } else {
      setIsSubDropdownOpen(true);
      setIndex(i);
    }
    setCategory(val);
    setFormData({ ...formData, category: val });
  };

  const toggleDropdown2 = (i, val) => {
    setIndex(i);
    setCategory(val);
    setIsDropdownOpen(false);
    setFormData({ ...formData, category: val });
    fetchPrice(val);
  };

  const handleSubCategory = (val) => {
    setIsSubDropdownOpen(false);
    setIsDropdownOpen(false);
    setSubCategory(val);
    setFormData({ ...formData, subCategory: val });
  };

  const handleBedroomChange = (bedrooms) => {
    setIsBedroomsDropdownOpen(false);
    setValue(bedrooms);
    setFormData((prevData) => ({ ...prevData, value: bedrooms }));
    fetchPrice(bedrooms);
  };

  return (
    <>
      {/* Property Type — two-level: Residential / Commercial then sub-items */}
      {dropdown3D && (
        <div className="relative w-full">
          <button
            onClick={toggleDropdown}
            type="button"
            className={`flex justify-between ${buttonClassName} items-center gap-2 w-full bg-white`}
          >
            <span className="truncate">{subCategory || "Select Category"}</span>
            <SlArrowDown
              className={`shrink-0 text-gray-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-[100]">
              {dropdown3D?.map((item, i) => (
                <div key={i}>
                  <button
                    type="button"
                    onClick={() => toggleSubDropdown(i, item.text)}
                    className="flex justify-between items-center w-full px-4 py-2.5 text-left text-gray-800 hover:bg-gray-50 focus:outline-none font-medium"
                  >
                    <span>{item.text}</span>
                    {item?.mapData && (
                      <SlArrowDown
                        className={`shrink-0 text-gray-500 transition-transform text-xs ${
                          isSubDropdownOpen && index === i ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Sub-items open below the parent row */}
                  {isSubDropdownOpen && index === i && item?.mapData && (
                    <div className="border-t border-gray-100 bg-gray-50 max-h-48 overflow-y-auto">
                      {item.mapData.map((subItem, j) => (
                        <button
                          key={j}
                          type="button"
                          onClick={() => handleSubCategory(subItem.value)}
                          className="block w-full px-6 py-2 text-sm text-gray-700 hover:bg-[#a2913e]/10 hover:text-[#002d4f] text-left"
                        >
                          {subItem.value}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Simple flat dropdown */}
      {dropdown && (
        <div className="relative w-full">
          <button
            type="button"
            onClick={toggleDropdown}
            className={`flex justify-between ${buttonClassName} items-center gap-2 w-full bg-white`}
          >
            <span className="truncate">{category || "Select Category"}</span>
            <SlArrowDown
              className={`shrink-0 text-gray-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-[100] max-h-60 overflow-y-auto">
              {dropdown?.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDropdown2(i, item.text)}
                  className="flex items-center w-full px-4 py-2.5 text-left text-gray-800 hover:bg-gray-50 focus:outline-none"
                >
                  {item.text}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bedrooms / simple list */}
      {bedroomsDropDown && (
        <div className="relative w-full">
          <button
            type="button"
            onClick={toggleBedroomsDropdown}
            className={`flex ${buttonClassName} justify-between items-center gap-2 w-full bg-white`}
          >
            <span className="truncate">{value || "Select"}</span>
            <SlArrowDown
              className={`shrink-0 text-gray-500 transition-transform ${
                isBedroomsDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isBedroomsDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-[100] max-h-60 overflow-y-auto">
              {bedroomsDropDown?.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleBedroomChange(item)}
                  className="w-full px-4 py-2.5 text-gray-800 hover:bg-gray-50 text-left"
                >
                  {item} bedroom
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DropDown;
