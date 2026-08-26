"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import ListingDropdown from "@/components/AddListing/ListingDropdown";
import {
  boatCategories,
  propertyType,
  carBrands,
  jeweleryCategories,
} from "@/constants/listing-data";
import { normalizeCountriesResponse } from "@/libs/normalizeCountriesResponse";
import {
  filterCountriesToUaeOnly,
  LISTING_COUNTRY_UAE_LABEL,
} from "@/libs/dummyLocationData";
import {
  fetchCatalogCountries,
  mergeCountryOptions,
} from "@/libs/listingLocationCatalog";

const NewListing = ({ formData, setFormData }) => {
  //Static Data

  const [models] = useState(["2024", "2023", "2022", "2021", "2020"]);
  const [makes] = useState([...carBrands]);

  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activePropertyType, setActivePropertyType] = useState(null); // Track active property type (Residential/Commercial)

  // Toggle dropdowns and ensure only one dropdown is open at a time
  const handleToggle = (dropdownName) => {
    setDropdownOpen({
      [dropdownName]: !dropdownOpen[dropdownName], // Toggle the selected dropdown
    });
  };

  // Handle Property Type selection and manage nested sub-options
  const handlePropertyTypeToggle = (type) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      propertyType: true,
    }));
    setActivePropertyType(type);
  };

  // Handle selection of sub-property type (like Apartment, Villa, etc.)
  const handlePropertySubTypeSelect = (subType) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      propertyType: subType,
    }));
    setDropdownOpen({ propertyType: false }); // Close the dropdown after selection
  };
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [neighbourhoods, setNeighbourhoods] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState("");
  const [searchQueries, setSearchQueries] = useState({});

  // Fetch all countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/countries", {
          next: { revalidate: 10 },
        });
        const data = await response.json();
        const catalogCountries = await fetchCatalogCountries();
        setCountries(
          mergeCountryOptions(
            filterCountriesToUaeOnly(normalizeCountriesResponse(data)),
            catalogCountries,
          ),
        );
      } catch (error) {
        console.error("Error fetching countries data:", error);
        const catalogCountries = await fetchCatalogCountries();
        setCountries(
          mergeCountryOptions(filterCountriesToUaeOnly([]), catalogCountries),
        );
      }
    };
    fetchCountries();
  }, []);

  const fetchCities = async (countryName) => {
    try {
      const bboxResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          countryName
        )}&format=json&addressdetails=1&limit=1`
      );

      const country = bboxResponse.data[0];

      if (!country || !country.boundingbox) {
        throw new Error("Bounding box not found for country.");
      }

      const overpassQuery = `
        [out:json];
        (
          node["place"="city"](around:600000, ${country.lat}, ${country.lon});
          way["place"="city"](around:600000, ${country.lat}, ${country.lon});
          relation["place"="city"](around:600000, ${country.lat}, ${country.lon});
        );
        out body;
      `;

      const overpassResponse = await axios.post(
        "https://overpass-api.de/api/interpreter",
        overpassQuery
      );

      const cities = overpassResponse.data.elements;

      const citiesWithCoordinates = cities?.map((city) => ({
        name: city.tags
          ? city.tags["name:en"] || city.tags.name || "Unnamed city"
          : "Unnamed city",
        lat: city.lat,
        lng: city.lon,
      }));

      setCities(citiesWithCoordinates);
    } catch (error) {
      console.error("Error fetching cities data:", error);
    }
  };

  const fetchNeighbourhoods = async (cityName) => {
    try {
      const bboxResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          cityName
        )}&format=json&addressdetails=1&limit=1`
      );
      const city = bboxResponse.data[0];

      if (!city || !city.boundingbox) {
        throw new Error("Bounding box not found for city.");
      }

      const overpassQuery = `
        [out:json];
        (
          node["place"](around:10000, ${city.lat}, ${city.lon});
          way["place"](around:10000, ${city.lat}, ${city.lon});
          relation["place"](around:10000, ${city.lat}, ${city.lon});
        );
        out body;
      `;

      const overpassResponse = await axios.post(
        "https://overpass-api.de/api/interpreter",
        overpassQuery
      );

      const places = overpassResponse.data.elements;
      const placesWithCoordinates = places.map((place) => ({
        name: place.tags
          ? place.tags["name:en"] || place.tags.name || "Unnamed place"
          : "Unnamed place",
      }));

      setNeighbourhoods(placesWithCoordinates);
    } catch (error) {
      console.error("Error fetching places data:", error);
    }
  };

  // Handle country selection
  const handleCountrySelect = (countryName) => {
    setSelectedCountry(countryName);
    setDropdownOpen((prevState) => ({ ...prevState, country: false }));
    fetchCities(countryName);
    setFormData((prevFormData) => ({
      ...prevFormData,
      country: countryName,
    }));
  };

  // Handle city selection
  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setDropdownOpen((prevState) => ({ ...prevState, city: false }));
    fetchNeighbourhoods(cityName);
    setFormData((prevFormData) => ({
      ...prevFormData,
      city: cityName,
    }));
  };

  // Handle neighbourhood selection
  const handleNeighbourSelect = (neighbourName) => {
    setSelectedNeighbourhood(neighbourName);
    setDropdownOpen((prevState) => ({ ...prevState, neighbourhood: false }));
    setFormData((prevFormData) => ({
      ...prevFormData,
      neighbourhood: neighbourName,
    }));
  };

  // Set search query
  const setSearchQuery = (dropdownName, query) => {
    setSearchQueries((prevState) => ({
      ...prevState,
      [dropdownName]: query,
    }));
  };

  // Filtered options based on search query
  const filteredCountries = countries.filter((country) =>
    country.country
      .toLowerCase()
      .includes((searchQueries["country"] || "").toLowerCase())
  );

  const filteredCities = cities.filter((city) =>
    city.name
      .toLowerCase()
      .includes((searchQueries["city"] || "").toLowerCase())
  );

  const filteredNeighbourhoods = neighbourhoods.filter((neighbourhood) =>
    neighbourhood.name
      .toLowerCase()
      .includes((searchQueries["neighbourhood"] || "").toLowerCase())
  );
  return (
    <div className="w-full">
      <div className="flex justify-around gap-5 shadow-neons bg-white rounded-[5px] ">
        {/* Asset Type Dropdown */}
        <ListingDropdown
          label="Asset Type"
          value={
            formData?.assetType === "Property For Sale"
              ? "Ready Property For Sale"
              : formData?.assetType || "Select Asset Type"
          }
          options={[
            { value: "Property For Sale", label: "Ready Property For Sale" },
            "Property For Lease",
            "Property Off Plan For Sale",
            "Car For Sale",
            "Boats For Sale",
            "Jewellery For Sale",
          ]}
          isOpen={dropdownOpen["assetType"]}
          onToggle={() => handleToggle("assetType")}
          onSelect={(option) => {
            setFormData({ ...formData, assetType: option });
            setDropdownOpen((prevState) => ({
              ...prevState,
              assetType: false,
            }));
          }}
        />

        {/* Country Dropdown */}
        <ListingDropdown
          label="All Countries"
          value={formData?.country || "Select Country"}
          options={filteredCountries.map((country) => country.country)}
          isOpen={dropdownOpen["country"]}
          onToggle={() => handleToggle("country")}
          searchQuery={searchQueries["country"] || ""}
          setSearchQuery={(query) => setSearchQuery("country", query)}
          onSelect={handleCountrySelect}
        />

        {/* City Dropdown */}
        <ListingDropdown
          label="City"
          value={formData?.city || "Select City"}
          options={filteredCities?.map((city) => city.name)}
          isOpen={dropdownOpen["city"]}
          onToggle={() => handleToggle("city")}
          searchQuery={searchQueries["city"] || ""}
          setSearchQuery={(query) => setSearchQuery("city", query)}
          onSelect={handleCitySelect}
        />

        {/* Neighbourhood Dropdown */}
        <ListingDropdown
          label="Neighbourhood"
          value={formData?.neighbourhood || "Select Neighbourhood"}
          options={filteredNeighbourhoods.map(
            (neighbourhood) => neighbourhood.name
          )}
          isOpen={dropdownOpen["neighbourhood"]}
          onToggle={() => handleToggle("neighbourhood")}
          searchQuery={searchQueries["neighbourhood"] || ""}
          setSearchQuery={(query) => setSearchQuery("neighbourhood", query)}
          onSelect={handleNeighbourSelect}
        />

        {/* Additional Fields Based on Asset Type */}
        {/* Car Specific Fields */}
        {formData.assetType === "Car For Sale" && (
          <>
            <ListingDropdown
              label="Make"
              value={formData?.make || "Select Make"}
              options={carBrands}
              isOpen={dropdownOpen["make"]}
              onToggle={() => handleToggle("make")}
              onSelect={(make) => {
                setFormData({ ...formData, make });
                setDropdownOpen((prevState) => ({
                  ...prevState,
                  make: false,
                }));
              }}
            />

            {/* Car Model Dropdown */}
            <ListingDropdown
              label="Model"
              value={formData?.model || "Select Model"}
              options={models.map((model) => model)}
              isOpen={dropdownOpen["model"]}
              onToggle={() => handleToggle("model")}
              onSelect={(model) => {
                setFormData({ ...formData, model });
                setDropdownOpen((prevState) => ({
                  ...prevState,
                  model: false,
                }));
              }}
            />
          </>
        )}

        {/* Boat Specific Fields */}
        {formData.assetType === "Boats For Sale" && (
          <>
            <ListingDropdown
              label="Category"
              value={formData?.category || "Select Category"}
              options={boatCategories}
              isOpen={dropdownOpen["category"]}
              onToggle={() => handleToggle("category")}
              onSelect={(category) => {
                setFormData({ ...formData, category });
                setDropdownOpen((prevState) => ({
                  ...prevState,
                  category: false,
                }));
              }}
            />

            {/* Boat Model Dropdown */}
            <ListingDropdown
              label="Model"
              value={formData?.model || "Select Model"}
              options={models.map((model) => model)}
              isOpen={dropdownOpen["model"]}
              onToggle={() => handleToggle("model")}
              onSelect={(model) => {
                setFormData({ ...formData, model });
                setDropdownOpen((prevState) => ({
                  ...prevState,
                  model: false,
                }));
              }}
            />
          </>
        )}

        {/* Jewellery Specific Fields */}
        {formData.assetType === "Jewellery For Sale" && (
          <>
            {/* Category Dropdown */}
            <ListingDropdown
              label="Category"
              value={formData?.category || "Select Category"}
              options={jeweleryCategories.map((category) => category.name)} // Get category names
              isOpen={dropdownOpen["category"]}
              onToggle={() => handleToggle("category")}
              onSelect={(category) => {
                const selectedCategory = jeweleryCategories.find(
                  (cat) => cat.name === category
                );
                // Update the form data with the selected category and reset the subcategory
                setFormData({
                  ...formData,
                  category: selectedCategory,
                  subcategory: "",
                });
                // Close the dropdown
                setDropdownOpen({ category: false });
              }}
            />

            {/* Subcategory Dropdown */}
            <ListingDropdown
              label="Subcategory"
              value={formData?.subcategory || "Select Subcategory"}
              options={
                formData?.category?.sub || [] // Get subcategories from the selected category
              }
              isOpen={dropdownOpen["subcategory"]}
              onToggle={() => handleToggle("subcategory")}
              onSelect={(subcategory) => {
                setFormData({ ...formData, subcategory });
                setDropdownOpen({ subcategory: false });
              }}
            />
          </>
        )}

        {/* Property Specific Fields */}
        {(formData.assetType === "Property For Sale" ||
          formData.assetType === "Property For Lease" ||
          formData.assetType === "Property Off Plan For Sale") && (
          <div className="relative border-r py-3 pr-4 w-full flex flex-col items-center justify-center">
            <button
              className="dropdownButton flex flex-col items-center text-light-blue"
              type="button"
              onClick={() => handleToggle("propertyType")}
            >
              <div className="flex gap-3 xl:text-lg lg:text-base md:text-xs xxs:text-sm font-medium text-dark-black">
                Property Type
                <Image
                  width={12}
                  height={12}
                  src="/listing/arrowgold.svg"
                  alt="arrowblue"
                  className="xl:ml-[30px] lg:ml-[10px] md:ml-[6px] xxs:ml-[10px]"
                />
              </div>
              <p className="lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey">
                {formData?.propertyType
                  ? formData?.propertyType
                  : "Select Property Type"}
              </p>
            </button>
            {dropdownOpen["propertyType"] && (
              <div className="absolute mt-2 top-[100%] w-36 bg-white rounded-lg shadow-neon z-10 -ml-3 py-2">
                {/* Map over propertyType data */}
                {propertyType?.map((type, index) => (
                  <div key={index}>
                    <div
                      onClick={() => handlePropertyTypeToggle(type.text)}
                      className="relative flex justify-between items-center cursor-pointer p-2 hover:bg-gray-100 hover:text-[#8D7C3B] text-gray-400"
                    >
                      {type.text}
                      <Image
                        width={10}
                        height={10}
                        src="/listing/arrowgold.svg"
                        alt="arrowblue"
                        className={
                          activePropertyType === type.text
                            ? "rotate-0"
                            : "-rotate-90"
                        }
                      />
                    </div>
                    {activePropertyType === type.text && (
                      <div className="absolute left-full top-0 w-[135px] bg-white rounded-lg shadow-neon z-20">
                        {type?.mapData?.map((subType) => (
                          <p
                            key={subType.id}
                            className="cursor-pointer w-full text-center p-2 hover:bg-gray-100 hover:text-[#8D7C3B] text-gray-400"
                            onClick={() =>
                              handlePropertySubTypeSelect(subType.value)
                            }
                          >
                            {subType.value}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewListing;
