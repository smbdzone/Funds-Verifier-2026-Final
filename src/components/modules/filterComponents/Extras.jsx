import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { CloseDisclosure, OpenDisclosure } from "../../Icons";
import FormCheck from "../../CheckBoxComponent/FormCheck";

const Extras = ({
  title,
  extras,
  selectedFilters,
  setSelectedFilters,
  filterKey,
  updateSortingForExtras,
}) => {
  const [viewMore, setViewMore] = useState(false);
  const itemsToShow = 12;

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey].includes(value)
        ? prev[filterKey].filter((item) => item !== value)
        : [...prev[filterKey], value],
    }));
  };

  const toggleViewMore = () => {
    setViewMore(!viewMore);
  };

  return (
    <Disclosure as="div" className="my-3 mx-5" defaultOpen={true}>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`w-full rounded py-3 pr-3 gap-4 justify-between items-center flex ${
              open && ""
            }`}
          >
            <span className="text-base">{title}</span>
            <span className="flex-shrink-0">
              {open ? (
                <CloseDisclosure className="text-[#8D7C3B]" />
              ) : (
                <OpenDisclosure className="text-[#8D7C3B]" />
              )}
            </span>
          </Disclosure.Button>
          <Disclosure.Panel
            as="div"
            className="rounded-md text-xs flex flex-col gap-3"
          >
            <div className="p-4 rounded-md bg-[#f5f5f5]">
              <div className="grid grid-cols-2 gap-3">
                {extras
                  .slice(0, viewMore ? extras.length : itemsToShow)
                  .map((item) => (
                    <div key={item.id}>
                      <FormCheck
                        onChange={handleCheckboxChange}
                        label={item.value}
                        value={item.value}
                        id={item.id}
                      />
                    </div>
                  ))}
              </div>

              {extras.length > itemsToShow && (
                <div className="w-full flex justify-center">
                  <button
                    onClick={toggleViewMore}
                    className="bg-white py-2 px-6 rounded mt-3 underline text-reefGold"
                  >
                    {viewMore ? "View Less" : "View More"}
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() =>
                  updateSortingForExtras(selectedFilters, filterKey)
                }
                className="bg-reefGold py-2 px-6 rounded mt-3 text-white"
              >
                Filter
              </button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Extras;
