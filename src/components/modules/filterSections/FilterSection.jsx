import { CloseDisclosure, OpenDisclosure } from "@/components/Icons";
import { Disclosure } from "@headlessui/react";
import React, { useState } from "react";

const FilterSection = ({ title, options, updateSorting }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelect = (value, e) => {
   
    e.preventDefault();
    switch (title) {
      case "Property For Sale":
      case "Property For Lease":
        updateSorting("property", e, value);
        break;
      case "Car For Sale":
        updateSorting("car", e, value, selectedCategory);
        break;
      case "Jewellery For Sale":
        updateSorting("jewelry", e, value, selectedCategory);
        break;
      case "Boats For Sale":
        updateSorting("boat", e, value, selectedCategory);
        break;
      default:
        break;
    }
  };
  const handleCategoryClick = (category) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? null : category
    );
  };

  return (
    <>
      {options[0]?.brand ? (
        <div className="w-full">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`w-full rounded justify-between flex flex-col gap-1 ${
                    open && "mb-3"
                  }`}
                >
                  <div className="bg-[#f5f5f5] rounded my-1 p-3 w-full flex items-center justify-between">
                    <p className={`${open ? "text-reefGold " : "text-black"}`}>
                      {title}
                    </p>
                    <span className="">
                      {open ? (
                        <OpenDisclosure className="text-[#8D7C3B]" />
                      ) : (
                        <CloseDisclosure className="text-[#8D7C3B]" />
                      )}
                    </span>
                  </div>
                </Disclosure.Button>

                <Disclosure.Panel
                  as="div"
                  className="px-4 max-h-80 overflow-y-auto text-sm md:text-base w-full"
                >
                  {/* Main Categories for objects */}
                  {options.map((category) => (
                    <div key={category.brand} className="mb-2">
                      <p
                        className={`cursor-pointer hover:bg-[#f5f5f5] hover:text-reefGold p-2 rounded w-full flex items-center justify-between ${
                          selectedCategory === category.brand
                            ? "text-reefGold"
                            : "text-black"
                        }`}
                        onClick={(e) => handleCategoryClick(category.brand, e)}
                      >
                        {category.brand}
                        <span>
                          {selectedCategory != category ? (
                            <CloseDisclosure className="text-[#8D7C3B]" />
                          ) : (
                            <OpenDisclosure className="text-[#8D7C3B]" />
                          )}
                        </span>
                      </p>

                      {/* Sub-options */}
                      {selectedCategory === category.brand &&
                        category.models.map((subOption) => (
                          <div
                            key={subOption}
                            className="ml-4 cursor-pointer hover:bg-light[#f5f5f5] hover:text-reefGold p-2 rounded"
                            onClick={(e) => handleSelect(subOption, e)}
                          >
                            {subOption}
                          </div>
                        ))}
                    </div>
                  ))}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      ) : (
        <div className="w-full">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`w-full rounded justify-between flex flex-col gap-1 ${
                    open && "mb-3"
                  }`}
                >
                  <div className="bg-[#f5f5f5] rounded my-1 p-3 w-full flex items-center justify-between">
                    <p className={`${open ? "text-reefGold " : "text-black"}`}>
                      {title}
                    </p>
                    <span className="">
                      {open ? (
                        <OpenDisclosure className="text-[#8D7C3B]" />
                      ) : (
                        <CloseDisclosure className="text-[#8D7C3B]" />
                      )}
                    </span>
                  </div>
                </Disclosure.Button>

                <Disclosure.Panel
                  as="div"
                  className="px-4 max-h-80 overflow-y-auto text-sm md:text-base w-full"
                >
                  {/* Main Categories for objects */}
                  {typeof options === "object" && !Array.isArray(options)
                    ? Object.keys(options).map((category) => (
                        <div key={category} className="mb-2">
                          <p
                            className={`cursor-pointer hover:bg-[#f5f5f5] hover:text-reefGold p-2 rounded w-full flex items-center justify-between ${
                              selectedCategory === category
                                ? "text-reefGold"
                                : "text-black"
                            }`}
                            onClick={(e) => handleCategoryClick(category, e)}
                          >
                            {category}
                            <span
                              className={`${
                                category === "Multiple" ? "hidden" : "block"
                              }`}
                            >
                              {selectedCategory != category ? (
                                <CloseDisclosure className="text-[#8D7C3B]" />
                              ) : (
                                <OpenDisclosure className="text-[#8D7C3B]" />
                              )}
                            </span>
                          </p>

                          {/* Sub-options */}
                          {selectedCategory === category &&
                            Array.isArray(options[category]) &&
                            options[category].map((subOption) => (
                              <div
                                key={subOption.value}
                                className="ml-4 cursor-pointer hover:bg-light[#f5f5f5] hover:text-reefGold p-2 rounded"
                                onClick={(e) =>
                                  handleSelect(subOption.value, e)
                                }
                              >
                                {subOption.value}
                              </div>
                            ))}
                        </div>
                      ))
                    : null}

                  {/* For 1D Array (e.g., carForSale, boatForSale) */}
                  {Array.isArray(options)
                    ? options.map((option, index) => (
                        <p
                          key={index}
                          className="cursor-pointer hover:bg-[#f5f5f5] hover:text-reefGold p-2 rounded w-full"
                          onClick={(e) =>
                            handleSelect(option.value || option, e)
                          }
                        >
                          {option.value || option}
                        </p>
                      ))
                    : null}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      )}
    </>
  );
};

export default FilterSection;
