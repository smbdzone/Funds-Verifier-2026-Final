import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

let asset = [
  {
    value: 'Property For Sale',
    label: 'Ready Property For Sale',
    link: 'property',
  },
  { value: 'Property For Lease', link: 'property' },
  { value: 'Property Off Plan For Sale', link: 'property' },
  { value: 'Car For Sale', link: 'car' },
  { value: 'Jewellery For Sale', link: 'jewelry' },
  { value: 'Boats For Sale', link: 'boat' },
]

const Listing = ({
  formData,
  handleSelectOption,
  dropdowns,
  toggleCityDropdown,
  toggleDropdownn,
  toggleModelDropdown,
  toggleNeighbourDropdown,
  handleToggleDropdown,
  isOpen,
  isCityDropdownOpen,
  isNeighbourDropdownOpen,
  toggleDropdown,
  selectedCategory,
  dropdownVisible,
  selectedModel,
  modelDropdownVisible,
  searchQuery,
  setSearchQuery,
  searchQueryCity,
  setSearchQueryCity,
  searchQueryNeighbourhood,
  setSearchQueryNeighbourhood,
  filteredCountries,
  categories,
  models,
  cities,
  handleCitySelect,
  handleModelClick,
  handleCategoryClick,
  handleNeighbour,
  handleCountrySelect,
  selectedCountry,
  selectedCity,
  handlePropertyTypeSelect,
  neighbourhoods,
  selectedNeighbourhood,
  selectType,
  property,
  car,
  boat,
  jewelry,
  handleMouseLeave,
  toggleMakeDropdown,
  selectedMake,
  makeDropdownVisible,
  makes,
  handleMakeClick,
}) => {
  const [type, setType] = useState(false)
  const [beds, setBeds] = useState(false)
  const [price, setPrice] = useState(false)
  const [residential, setResidential] = useState(false)
  const [commercial, setCommercial] = useState(false)

  const togglePropertTypeDropdown = () => {
    setType(!type)
  }
  const [filteredCities, setFilteredCities] = useState([])
  const [filterneighbours, setFilteredNeighbours] = useState([])

  useEffect(() => {
    // Filter cities based on the search query
    setFilteredCities(
      cities.filter((city) =>
        city.name.toLowerCase().includes(searchQueryCity.toLowerCase())
      )
    )
  }, [searchQueryCity, cities])

  useEffect(() => {
    // Filter neighbourhoods based on the search query
    setFilteredNeighbours(
      neighbourhoods?.filter((neighbour) =>
        neighbour?.name
          ?.toLowerCase()
          .includes(searchQueryNeighbourhood.toLowerCase())
      )
    )
  }, [searchQueryNeighbourhood, neighbourhoods])

  const toggleResidentialDropdown = () => {
    setResidential(!residential)
  }
  const toggleCommercialDropdown = () => {
    setCommercial(!commercial)
  }
  const Residential = [
    {
      id: 1,
      value: 'Apartment',
    },
    {
      id: 2,
      value: 'Villa',
    },
    {
      id: 3,
      value: 'Townhouse',
    },
    {
      id: 4,
      value: 'Multiple',
    },
    {
      id: 5,
      value: 'Penthouse',
    },
    {
      id: 6,
      value: 'Residential Building',
    },
    {
      id: 7,
      value: 'Residential Floor',
    },
    {
      id: 8,
      value: 'Villa Compound',
    },
  ]
  const Commercial = [
    {
      id: 1,
      value: 'Office',
    },
    {
      id: 2,
      value: 'Industrials',
    },
    {
      id: 3,
      value: 'Retail',
    },
    {
      id: 4,
      value: 'Staff',
    },
    {
      id: 5,
      value: 'Accommodation',
    },
    {
      id: 6,
      value: 'Shop',
    },
    {
      id: 7,
      value: 'Warehouse',
    },
    {
      id: 8,
      value: 'Commercial Floor',
    },
    {
      id: 6,
      value: 'Commercial Villa',
    },
    {
      id: 7,
      value: 'Bulk Unit',
    },
    {
      id: 8,
      value: 'Commercial Plot',
    },
    {
      id: 6,
      value: 'Factory',
    },
    {
      id: 7,
      value: 'Industrial Land',
    },
    {
      id: 8,
      value: 'Mixed Use Land',
    },
    {
      id: 6,
      value: 'Showroom',
    },
    {
      id: 7,
      value: 'Commercial',
    },
    {
      id: 8,
      value: 'Building',
    },
    {
      id: 8,
      value: 'Other',
    },
  ]
  const propertyType = [
    {
      text: 'Residential',
      state: residential,
      setState: setResidential,
      onclick: toggleResidentialDropdown,
      mapData: Residential,
    },
    {
      text: 'Commercial',
      state: commercial,
      setState: setResidential,
      onclick: toggleCommercialDropdown,
      mapData: Commercial,
    },
  ]

  const togglePriceDropdown = () => {
    setPrice(!price)
  }
  const toggleBedsDropdown = () => {
    setBeds(!beds)
  }

  return (
    <div className='px-5'>
      <div className='mt-[51px] flex md:flex md:flex-row sm:grid sm:grid-cols-3 xxs:grid xxs:grid-cols-2 md:justify-between xxs:justify-center md:gap-[11px] xxs:gap-5 max-w-[1300px] mx-auto shadow-neons bg-whitee rounded-[5px] py-[14px] pl-[10px] md:pr-[32px] xxs:pr-[10px] md:h-[70px] sm:h-[215px] xxs:h-[280px]'>
        {/* one  Asset Type*/}
        {(property || car || boat || jewelry) && (
          <div>
            <div className='relative dropdown-container'>
              <div
                className='dropdownButton flex flex-col items-center text-light-blue'
                type='button'
                onClick={() => handleToggleDropdown('assetType')}
              >
                <div className='flex'>
                  <p className='xl:text-lg lg:text-base md:text-[12px] xxs:text-sm font-medium text-dark-black text-center'>
                    Asset Type
                  </p>
                  <Image
                    width={12}
                    height={12}
                    src='/listing/arrowgold.svg'
                    alt='arrowblue'
                    className='xl:ml-[30px] lg:ml-[20px] xxs:ml-[10px]'
                  />
                </div>

                <p className='lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey'>
                  {formData?.assetType
                    ? asset.find((a) => a.value === formData.assetType)?.label ||
                      formData.assetType
                    : formData.assetType}
                </p>
                <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px] top-[-14px]' />
              </div>
              {dropdowns.assetType && (
                <div
                  onMouseLeave={() => {
                    handleMouseLeave('assetType')
                  }}
                  className=' absolute mt-2 w-44 bg-white rounded-lg shadow-neon z-10 -ml-3 py-2'
                >
                  {asset?.map((option, index) => (
                    <>
                      <Link href={`/dashboard/${option.link}-listing`}>
                        <div
                          key={index}
                          className='px-2 py-2 text-start hover:text-[#8D7C3B] hover:bg-[#F5F5F5]  text-gray-400'
                          onClick={() =>
                            handleSelectOption('assetType', option.value)
                          }
                        >
                          {option.label || option.value}
                        </div>
                      </Link>
                    </>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* two All Countries */}
        {(property || car || boat || jewelry) && (
          <div>
            <div className='relative'>
              <button
                className='dropdownButton cursor-pointer flex items-center text-light-blue'
                type='button'
                onClick={() => toggleDropdownn()}
              >
                <div>
                  <p className='xl:text-lg lg:text-base md:text-xs xxs:text-sm font-medium text-dark-black'>
                    All Countries
                  </p>
                  <p className='lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey'>
                    {formData?.country ? formData?.country : selectedCountry}
                  </p>
                </div>
                <Image
                  width={12}
                  height={12}
                  src='/listing/arrowgold.svg'
                  alt='arrowblue'
                  className='xl:ml-[30px] lg:ml-[20px] xxs:ml-[10px]'
                />
                <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px] top-[-14px]' />
              </button>
              {isOpen && (
                <div className='absolute top-8 left-0 w-full bg-white shadow-lg max-h-[280px] scroll-none overflow-y-auto z-10'>
                  <input
                    type='text'
                    placeholder='Search Country'
                    className='w-full p-2 bg-[#F5F5F5] outline-none text-[#8D7C3B]'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {filteredCountries?.map((country, index) => (
                    <div
                      key={index}
                      onClick={() => handleCountrySelect(country)}
                      className='cursor-pointer p-2 hover:bg-gray-100 px-2 py-2  hover:text-[#8D7C3B] hover:bg-[#F5F5F5]  text-gray-400'
                    >
                      {country.country}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* three  City*/}
        {(property || car || boat || jewelry) && (
          <div>
            <div className='relative cursor-pointer dropdown-container'>
              <div
                className='dropdownButton flex items-center text-light-blue'
                type='button'
                onClick={() => toggleCityDropdown()}
              >
                <div>
                  <p className='xl:text-lg lg:text-base md:text-[12px] xxs:text-sm font-medium text-dark-black text-center'>
                    City
                  </p>
                  <p className='lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-center text-dark-grey'>
                    {formData?.city ? formData?.city : selectedCity}
                  </p>
                </div>
                <Image
                  width={12}
                  height={12}
                  src='/listing/arrowgold.svg'
                  alt='arrowblue'
                  className='xl:ml-[30px] lg:ml-[20px] xxs:ml-[10px]'
                />
                <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px] top-[-14px]' />
              </div>
              {isCityDropdownOpen && (
                <div className=' absolute mt-2 w-44 max-h-[280px] scroll-none bg-white h-96 overflow-y-auto rounded-lg shadow-neon z-10 -ml-3 py-2'>
                  <input
                    type='text'
                    placeholder='Search City'
                    className='w-full p-2 bg-[#F5F5F5] outline-none text-[#8D7C3B]'
                    value={searchQueryCity}
                    onChange={(e) => setSearchQueryCity(e.target.value)}
                  />
                  {filteredCities?.map((city, index) => (
                    <div
                      key={index}
                      onClick={() => handleCitySelect(city.name)}
                      className='cursor-pointer p-2 hover:bg-gray-100 px-2 py-2  hover:text-[#8D7C3B] hover:bg-[#F5F5F5]  text-gray-400'
                    >
                      {city.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* four Neighbourhood */}
        {(property || car || boat || jewelry) && (
          <div>
            <div className='relative'>
              <button
                className='dropdownButton flex items-center text-light-blue'
                type='button'
                onClick={toggleNeighbourDropdown}
              >
                <span className='sr-only'>Open user menu</span>
                <div className>
                  <p className=' xl:text-lg lg:text-base md:text-xs xxs:text-sm font-medium text-dark-black'>
                    Neighbourhood
                  </p>
                  <p className=' lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey'>
                    {formData?.neighbourhood
                      ? formData?.neighbourhood
                      : selectedNeighbourhood}
                  </p>
                </div>
                <Image
                  width={12}
                  height={12}
                  src='/listing/arrowgold.svg'
                  alt='arrowblue'
                  className='xl:ml-[30px] lg:ml-[20px] xxs:ml-[10px]'
                />
                <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px] top-[-14px]' />
              </button>
              {/* Dropdown menu */}
              {isNeighbourDropdownOpen && (
                <div className='absolute top-full left-0 w-full bg-white shadow-lg max-h-[200px] overflow-y-auto z-10'>
                  <input
                    type='text'
                    placeholder='Search Neighbourhood'
                    className='w-full p-2 bg-[#F5F5F5] outline-none text-[#8D7C3B]'
                    value={searchQueryNeighbourhood}
                    onChange={(e) =>
                      setSearchQueryNeighbourhood(e.target.value)
                    }
                  />
                  {filterneighbours?.map((neighbour, index) => (
                    <div
                      key={index}
                      onClick={() => handleNeighbour(neighbour)}
                      className='cursor-pointer p-2 hover:bg-gray-100 px-2 py-2  hover:text-[#8D7C3B] hover:bg-[#F5F5F5]  text-gray-400'
                    >
                      {' '}
                      {neighbour.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* five Make */}
        {car && (
          <div className='relative'>
            <button
              className='dropdownButton flex items-center text-light-blue'
              type='button'
              onClick={toggleMakeDropdown}
            >
              <span className='sr-only'>Open user menu</span>
              <div>
                <p className='xl:text-lg lg:text-base md:text-xs xxs:text-sm font-medium text-dark-black'>
                  Make
                </p>
                <p className='lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey'>
                  {formData?.make ? formData?.make : selectedMake}
                </p>
              </div>
              <Image
                width={12}
                height={12}
                src='/listing/arrowgold.svg'
                alt='arrowblue'
                className='xl:ml-[30px] lg:ml-[10px] md:ml-[6px] xxs:ml-[10px]'
              />
              <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px] top-[-14px]' />
            </button>

            {makeDropdownVisible && (
              <div className='dropdownMenu h-96 overflow-y-auto absolute mt-2 w-40 -ml-8 bg-white  rounded-lg shadow-neon z-10 py-2'>
                {makes?.map((make, _) => (
                  <>
                    <p
                      key={make}
                      className='px-2 text-[15px] py-2 text-start hover:text-[#8D7C3B] hover:bg-[#F5F5F5]  text-gray-400'
                      onClick={() => handleMakeClick(make)}
                    >
                      {make}
                    </p>
                  </>
                ))}
              </div>
            )}
          </div>
        )}
        {/* six  Category*/}
        {(boat || jewelry) && (
          <div className='relative'>
            <button
              className='dropdownButton flex items-center text-light-blue w-full'
              type='button'
              onClick={toggleDropdown}
            >
              <span className='sr-only'>Open user menu</span>
              <div className='flex-grow'>
                <p className='xl:text-lg lg:text-base md:text-xs xxs:text-sm font-medium text-dark-black'>
                  Category
                </p>
                <p className='lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey'>
                  {formData?.category ? formData?.category : selectedCategory}
                </p>
              </div>
              <Image
                width={12}
                height={12}
                src='/listing/arrowgold.svg'
                alt='arrowblue'
                className='xl:ml-[30px] lg:ml-[20px] xxs:ml-[10px]'
              />
              <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px] top-[-14px]' />
            </button>

            {dropdownVisible && (
              <div className='dropdownMenu absolute mt-2 w-44 bg-white  rounded-lg shadow-neon z-10 -ml-7 py-2'>
                {Object?.keys(categories)?.map((category) => (
                  <p
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className='px-2 py-2 text-start hover:text-[#8D7C3B] hover:bg-[#F5F5F5]  text-gray-400'
                  >
                    {category}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
        {/* six subcategory */}
        {jewelry && (
          <div>
            <div className='relative'>
              <button
                className='dropdownButton flex items-center text-light-blue'
                type='button'
                onClick={toggleModelDropdown}
              >
                <span className='sr-only'>Open user menu</span>
                <div>
                  <p className='xl:text-lg lg:text-base md:text-xs xxs:text-sm font-medium text-dark-black'>
                    Subcategory
                  </p>
                  <p className='lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey'>
                    {formData?.model ? formData?.model : selectedModel}
                  </p>
                </div>
                <Image
                  width={12}
                  height={12}
                  src='/listing/arrowgold.svg'
                  alt='arrowblue'
                  className='xl:ml-[30px] lg:ml-[10px] md:ml-[6px] xxs:ml-[10px]'
                />
              </button>
              <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px]] top-[-14px]' />
              {/* Model Dropdown menu */}
              {modelDropdownVisible && (
                <div className='dropdownMenu absolute mt-2 w-40  bg-white  rounded-lg shadow-neon z-10 py-2'>
                  {models.map((model) => (
                    <p
                      key={model}
                      className='px-1 text-[15px] py-2 text-start hover:text-[#8D7C3B] hover:bg-[#F5F5F5]  text-gray-400'
                      onClick={() => handleModelClick(model)}
                    >
                      {model}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* seven Model */}
        {(car || boat) && (
          <div className='relative'>
            <button
              className='dropdownButton flex items-center text-light-blue'
              type='button'
              onClick={toggleModelDropdown}
            >
              <span className='sr-only'>Open user menu</span>
              <div>
                <p className='xl:text-lg lg:text-base md:text-xs xxs:text-sm font-medium text-dark-black'>
                  Model
                </p>
                <p className='lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey'>
                  {formData?.model ? formData?.model : selectedModel}
                </p>
              </div>
              <Image
                width={12}
                height={12}
                src='/listing/arrowgold.svg'
                alt='arrowblue'
                className='xl:ml-[30px] lg:ml-[10px] md:ml-[6px] xxs:ml-[10px]'
              />
              <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px] top-[-14px]' />
            </button>

            {modelDropdownVisible && (
              <div className='dropdownMenu absolute mt-2 w-40 -ml-8 bg-white  rounded-lg shadow-neon z-10 py-2'>
                {models?.map((model, _) => (
                  <>
                    <p
                      key={model}
                      className='px-2 text-[15px] py-2 text-start hover:text-[#8D7C3B] hover:bg-[#F5F5F5]  text-gray-400'
                      onClick={() => handleModelClick(model)}
                    >
                      {model}
                    </p>
                  </>
                ))}
              </div>
            )}
          </div>
        )}
        {/* eight  Property Type*/}
        {property && (
          <div>
            <div className='relative cursor-pointer dropdown-container'>
              <div
                className='dropdownButton flex items-center text-light-blue'
                type='button'
                onClick={togglePropertTypeDropdown}
              >
                <div>
                  <p className='xl:text-lg lg:text-base md:text-[12px] xxs:text-sm font-medium text-dark-black text-center'>
                    Property Type
                  </p>
                  <p className='lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-center text-dark-grey'>
                    {formData?.propertyType
                      ? formData?.propertyType
                      : selectType}
                  </p>
                </div>
                <Image
                  width={12}
                  height={12}
                  src='/listing/arrowgold.svg'
                  alt='arrowblue'
                  className='xl:ml-[30px] lg:ml-[20px] xxs:ml-[10px]'
                />
                <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px] top-[-14px]' />
              </div>
              {type && (
                <div
                  onMouseLeave={() => setType(false)}
                  className='absolute mt-2 w-44 bg-white rounded-lg shadow-neon z-10 -ml-3 py-2'
                >
                  {propertyType?.map((type, index) => (
                    <div key={index}>
                      <div
                        onClick={type.onclick}
                        className='relative flex justify-between items-center cursor-pointer p-2 hover:bg-gray-100  hover:text-[#8D7C3B] hover:bg-[#F5F5F5]  text-gray-400'
                      >
                        {type.text}
                        <Image
                          width={10}
                          height={10}
                          src='/listing/arrowgold.svg'
                          alt='arrowblue'
                          className='-rotate-90'
                        />
                      </div>
                      {type.state && (
                        <div
                          onMouseLeave={() => setLand(false)}
                          className='absolute text-xs left-[90%] top-2 !w-[135px] bg-white justify-center items-center flex flex-col rounded-lg shadow-neon z-20'
                        >
                          {type.mapData?.map((ele, i) => (
                            <p
                              onClick={() => {
                                handlePropertyTypeSelect(ele.value)
                                setType(false)
                              }}
                              className='cursor-pointer w-full text-center p-2 hover:bg-gray-100  hover:text-[#8D7C3B] hover:bg-[#F5F5F5]  text-gray-400'
                              key={ele.id}
                            >
                              {ele.value}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Listing
