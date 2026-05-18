import { CloseDisclosure, OpenDisclosure } from "@/components/Icons";
import { Disclosure } from "@headlessui/react";
import React, { useState } from "react";

const FilterSection2 = ({ title, options, updateSorting }) => {
  const [defaultLabel, setDefaultLabel] = useState("Select");

  const handleSelect = (value, close) => {
    setDefaultLabel(value);
    updateSorting(value);
    close(); // Close the dropdown after selecting an option
  };

  const renderOptions = (close) => {
    switch (title) {
      case "Filter by City":
        return (
          <>
            <Disclosure.Panel
              as="div"
              className="px-4 max-h-80 text-black overflow-y-auto text-sm md:text-base w-full"
            >
              {options?.map((option) => (
                <p
                  key={option.name || option.country}
                  className="cursor-pointer hover:bg-[#f5f5f5] hover:text-reefGold p-2 rounded w-full"
                  onClick={() =>
                    handleSelect(option.name || option.country, close)
                  }
                >
                  {option.label || option.name || option.country}
                </p>
              ))}
            </Disclosure.Panel>
          </>
        );

      default:
        return (
          <Disclosure.Panel
            as="div"
            className="px-4 max-h-80 text-black overflow-y-auto text-sm md:text-base w-full"
          >
            {options?.map((option) => (
              <p
                key={option}
                className="cursor-pointer hover:bg-[#f5f5f5] hover:text-reefGold p-2 rounded w-full"
                onClick={() => handleSelect(option, close)}
              >
                {option}
              </p>
            ))}
          </Disclosure.Panel>
        );
    }
  };

  return (
    <div className="w-full">
      <Disclosure>
        {({ open, close }) => (
          <>
            <p className="my-1">{title}</p>
            <Disclosure.Button
              className={`my-1 w-full rounded justify-between flex flex-col gap-1 ${
                open && "mb-3"
              }`}
            >
              <div className="bg-[#f5f5f5] rounded p-2 px-3 w-full flex items-center justify-between">
                <span className="text-sm w-full text-start md:text-base">
                  {defaultLabel}
                </span>
                <span className="">
                  {open ? (
                    <OpenDisclosure className="text-[#8D7C3B]" />
                  ) : (
                    <CloseDisclosure className="text-[#8D7C3B]" />
                  )}
                </span>
              </div>
            </Disclosure.Button>
            {renderOptions(close)}
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default FilterSection2;
