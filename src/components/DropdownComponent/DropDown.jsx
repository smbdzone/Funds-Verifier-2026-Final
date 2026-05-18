import { useState } from "react";
import { SlArrowRight } from "react-icons/sl";

const DropDown = ({
  dropdown3D,
  setCategory,
  category,
  subCategory,
  setSubCategory,
  bedroomsDropDown,
  // setBedroomCount,
  setFormData,
  formData,
  setValue,
  value,
  dropdown,
  fetchPrice,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [isBedroomsDropdownOpen, setIsBedroomsDropdownOpen] = useState(false);
  const [index, setIndex] = useState(-1);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleBedroomsDropdown = () =>
    setIsBedroomsDropdownOpen(!isBedroomsDropdownOpen);

  const toggleSubDropdown = (i, value) => {
    setIsSubDropdownOpen(!isSubDropdownOpen);
    setIndex(i);
    setCategory(value);
    setFormData({ ...formData, category: value });
  };

  const toggleDropdown2 = (i, value) => {
    setIndex(i);
    setCategory(value);
    setIsDropdownOpen(false);
    setFormData({ ...formData, category: value });
    fetchPrice(value);
  };

  const handleSubCategory = (value) => {
    setIsSubDropdownOpen(false);
    setIsDropdownOpen(false);
    setSubCategory(value);
    setFormData({ ...formData, subCategory: value });
  };

  const handleBedroomChange = (bedrooms) => {
    setIsBedroomsDropdownOpen(false);
    setValue(bedrooms);
    setFormData((prevData) => ({
      ...prevData,
      value: bedrooms,
    }));
    fetchPrice(bedrooms);
  };

  return (
    <>
      {/* Dropdown with Submenu */}
      {dropdown3D && (
        <div className="relative w-full overflow-visible">
          <button
            onClick={toggleDropdown}
            type="button"
            className="flex justify-between text-sm text-black/60 items-center gap-2 w-full bg-white"
          >
            {subCategory || "Select Category"}
            <SlArrowRight
              className={`text-gray-500 transition-transform mt-1 ${
                isDropdownOpen ? "-rotate-90" : "rotate-90"
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              {dropdown3D?.map((item, i) => (
                <div key={i} className="relative group">
                  <button
                    type="button"
                    onClick={() => toggleSubDropdown(i, item.text)}
                    className="flex justify-between items-center w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100 focus:outline-none"
                  >
                    {item.text}
                    {item?.mapData && (
                      <SlArrowRight className="text-gray-500 group-hover:text-gray-700" />
                    )}
                  </button>

                  {/* Render Sub-dropdown */}
                  {isSubDropdownOpen && index === i && item?.mapData && (
                    <div className="absolute top-0 left-full mt-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto">
                      {item.mapData.map((subItem, j) => (
                        <button
                          key={j}
                          onClick={() => handleSubCategory(subItem.value)}
                          className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left truncate"
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

      {/* Dropdown with Submenu */}
      {dropdown && (
        <div className="relative overflow-visible">
          <button
            type="button"
            onClick={toggleDropdown}
            className="flex justify-between text-sm text-black/60 items-center gap-2 w-full bg-white"
          >
            {category || "Select Category"}
            <SlArrowRight
              className={`text-gray-500 transition-transform mt-1 ${
                isDropdownOpen ? "-rotate-90" : "rotate-90"
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              {dropdown?.map((item, i) => (
                <div key={i} className="relative group">
                  <button
                    type="button"
                    onClick={() => toggleDropdown2(i, item.text)}
                    className="flex justify-between items-center w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100 focus:outline-none"
                  >
                    {item.text}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dropdown Without Submenu */}
      {bedroomsDropDown && (
        <div className="relative">
          <button
            type="button"
            onClick={toggleBedroomsDropdown}
            className="flex text-sm justify-between text-black/60 items-center gap-2 bg-white "
          >
            {value || "Select"}
            <SlArrowRight
              className={`text-gray-500 transition-transform mt-1 ${
                isBedroomsDropdownOpen ? "-rotate-90" : "rotate-90 "
              }`}
            />
          </button>

          {isBedroomsDropdownOpen && (
            <div className="absolute -left-4 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
              {bedroomsDropDown?.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleBedroomChange(item)}
                  className="w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
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