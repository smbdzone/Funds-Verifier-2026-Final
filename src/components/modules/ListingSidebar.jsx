'use client'
import { useAppContext } from '@/context/AppContext'
import useGlobalStore from '@/stores/store'
import { formatPriceUS } from '@/utils'
import { Disclosure } from '@headlessui/react'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import customAxios from '@/utils/apis/apis'
import {
  buildCountryCityNeighbourhoodMap,
  UAE_ONLY_COUNTRY_OPTIONS,
} from '@/libs/listingLocationUtils'
import { LISTING_COUNTRY_UAE_LABEL } from '@/libs/dummyLocationData'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  bedroomsOptions,
  boatExtrasData,
  boatForSale,
  carExtras,
  exteriorColors,
  grams,
  interiorColors,
  jewelryForSale,
  materials,
  propertyExtras,
  propertyForSale,
  technicalFeatures,
} from '../../constants/sidebar'
import Extras from './filterComponents/Extras'
import { CloseDisclosure, OpenDisclosure } from '../Icons'
import { carForSale } from '../../constants/car-listings'

const FilterSection = ({ title, options, updateSorting }) => {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleSelect = (value, e) => {
    e.preventDefault()
    switch (title) {
      case 'Property For Sale':
        updateSorting('property for sale', e, value)
        break
      case 'Property For Lease':
        updateSorting('property for lease', e, value)
        break
      case 'Car For Sale':
        updateSorting('car', e, value, selectedCategory)
        break
      case 'Jewellery For Sale':
        updateSorting('jewelry', e, value, selectedCategory)
        break
      case 'Boats For Sale':
        updateSorting('boat', e, value, selectedCategory)
        break
      default:
        break
    }
  }
  const handleCategoryClick = (category) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? null : category,
    )
  }

  return (
    <>
      {options[0]?.brand ? (
        <div className='w-full'>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`w-full rounded justify-between flex flex-col gap-1 ${
                    open && 'mb-3'
                  }`}
                >
                  <div className='bg-[#f5f5f5] rounded my-1 p-3 w-full flex items-center justify-between'>
                    <p className={`${open ? 'text-reefGold ' : 'text-black'}`}>
                      {title}
                    </p>
                    <span className=''>
                      {open ? (
                        <OpenDisclosure className='text-[#8D7C3B]' />
                      ) : (
                        <CloseDisclosure className='text-[#8D7C3B]' />
                      )}
                    </span>
                  </div>
                </Disclosure.Button>

                <Disclosure.Panel
                  as='div'
                  className='px-4 max-h-80 overflow-y-auto text-sm md:text-base w-full'
                >
                  {/* Main Categories for objects */}
                  {options.map((category) => (
                    <div key={category.brand} className='mb-2'>
                      <p
                        className={`cursor-pointer hover:bg-[#f5f5f5] hover:text-reefGold p-2 rounded w-full flex items-center justify-between ${
                          selectedCategory === category.brand
                            ? 'text-reefGold'
                            : 'text-black'
                        }`}
                        onClick={(e) => handleCategoryClick(category.brand, e)}
                      >
                        {category.brand}
                        <span>
                          {selectedCategory != category ? (
                            <CloseDisclosure className='text-[#8D7C3B]' />
                          ) : (
                            <OpenDisclosure className='text-[#8D7C3B]' />
                          )}
                        </span>
                      </p>

                      {/* Sub-options */}
                      {selectedCategory === category.brand &&
                        category.models.map((subOption) => (
                          <div
                            key={subOption}
                            className='ml-4 cursor-pointer hover:bg-light[#f5f5f5] hover:text-reefGold p-2 rounded'
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
        <div className='w-full'>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`w-full rounded justify-between flex flex-col gap-1 ${
                    open && 'mb-3'
                  }`}
                >
                  <div className='bg-[#f5f5f5] rounded my-1 p-3 w-full flex items-center justify-between'>
                    <p className={`${open ? 'text-reefGold ' : 'text-black'}`}>
                      {title}
                    </p>
                    <span className=''>
                      {open ? (
                        <OpenDisclosure className='text-[#8D7C3B]' />
                      ) : (
                        <CloseDisclosure className='text-[#8D7C3B]' />
                      )}
                    </span>
                  </div>
                </Disclosure.Button>

                <Disclosure.Panel
                  as='div'
                  className='px-4 max-h-80 overflow-y-auto text-sm md:text-base w-full'
                >
                  {/* Main Categories for objects */}
                  {typeof options === 'object' && !Array.isArray(options)
                    ? Object.keys(options).map((category) => (
                        <div key={category} className='mb-2'>
                          <p
                            className={`cursor-pointer hover:bg-[#f5f5f5] hover:text-reefGold p-2 rounded w-full flex items-center justify-between ${
                              selectedCategory === category
                                ? 'text-reefGold'
                                : 'text-black'
                            }`}
                            onClick={(e) => handleCategoryClick(category, e)}
                          >
                            {category}
                            <span
                              className={`${
                                category === 'Multiple' ? 'hidden' : 'block'
                              }`}
                            >
                              {selectedCategory != category ? (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </p>

                          {/* Sub-options */}
                          {selectedCategory === category &&
                            Array.isArray(options[category]) &&
                            options[category].map((subOption) => (
                              <div
                                key={subOption.value}
                                className='ml-4 cursor-pointer hover:bg-light[#f5f5f5] hover:text-reefGold p-2 rounded'
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
                          className='cursor-pointer hover:bg-[#f5f5f5] hover:text-reefGold p-2 rounded w-full'
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
  )
}

const FilterSection2 = ({ title, options, updateSorting }) => {
  const [defaultLabel, setDefaultLabel] = useState('Select')
  // console.log(title, options, updateSorting, 'checking')

  const handleSelect = (value, close) => {
    setDefaultLabel(value)
    updateSorting(value)
    close() // Close the dropdown after selecting an option
  }

  const renderOptions = (close) => {
    switch (title) {
      case 'Filter by City':
        return (
          <>
            <Disclosure.Panel
              as='div'
              className='px-4 max-h-80 text-black overflow-y-auto text-sm md:text-base w-full'
            >
              {options?.map((option) => (
                <p
                  key={option?.name || option?.country || option}
                  className='cursor-pointer hover:bg-[#f5f5f5] hover:text-reefGold p-2 rounded w-full'
                  onClick={() =>
                    handleSelect(option.name || option.country || option, close)
                  }
                >
                  {option.label || option.name || option.country || option}
                </p>
              ))}
            </Disclosure.Panel>
          </>
        )

      default:
        return (
          <Disclosure.Panel
            as='div'
            className='px-4 max-h-80 text-black overflow-y-auto text-sm md:text-base w-full'
          >
            {options?.map((option) => (
              <p
                key={option}
                className='cursor-pointer hover:bg-[#f5f5f5] hover:text-reefGold p-2 rounded w-full'
                onClick={() => handleSelect(option, close)}
              >
                {option}
              </p>
            ))}
          </Disclosure.Panel>
        )
    }
  }

  return (
    <div className='w-full'>
      <Disclosure>
        {({ open, close }) => (
          <>
            <p className='my-1'>{title}</p>
            <Disclosure.Button
              className={`my-1 w-full rounded justify-between flex flex-col gap-1 ${
                open && 'mb-3'
              }`}
            >
              <div className='bg-[#f5f5f5] rounded p-2 px-3 w-full flex items-center justify-between'>
                <span className='text-sm w-full text-start md:text-base'>
                  {defaultLabel}
                </span>
                <span className=''>
                  {open ? (
                    <OpenDisclosure className='text-[#8D7C3B]' />
                  ) : (
                    <CloseDisclosure className='text-[#8D7C3B]' />
                  )}
                </span>
              </div>
            </Disclosure.Button>
            {renderOptions(close)}
          </>
        )}
      </Disclosure>
    </div>
  )
}

export const ListingSidebar = ({ initialData, isSidebarVisible }) => {
  const { getPropertyPrice, getCarPrice, getBoatPrice, getJewellryPrice } =
    useAppContext()

  const [cities, setCities] = useState([])
  const [countries, setCountries] = useState([])
  const [totalcities, settotalcities] = useState([])
  const [neighbourhood, setNeighbourhood] = useState([])
  const [filterData, setFilterData] = useState({
    assetType: '',
    minPrice: null,
    maxPrice: null,
  })
  const [value, setValue] = useState([0, 1000])
  const [selectedFilters, setSelectedFilters] = useState({
    filters: [],
    filters2: [],
    filters3: [],
    filters4: [],
    filters5: [],
  })
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [maxPrice, setMaxPrice] = useState(null)
  const [minPrice, setMinPrice] = useState(null)
  const [category, setCategory] = useState('Property For Sale')
  const [countryCityMap, setCountryCityMap] = useState({})
  const [selectedCountry, setSelectedCountry] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  // const check = pathname.substring(1);
  const check = pathname?.split('/')?.[1] || ''
  const filterConfigs = [
    { title: 'Property For Sale', options: propertyForSale },
    { title: 'Car For Sale', options: carForSale },
    {
      title: 'Jewellery For Sale',
      options: jewelryForSale,
    },
    { title: 'Boats For Sale', options: boatForSale },
  ]
  //---------------------------------
  const setApiData = useGlobalStore((state) => state.setApiData)

  // const apiData = useGlobalStore((state) => state.apiData);

  const updateSearchParams = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value !== null && value !== undefined && value !== '') {
      params.set(key, value) // Update or add the parameter
    } else {
      params.delete(key) // Remove the parameter if value is null
    }
    const newPathname = `${pathname}?${params.toString()}`
    router.push(newPathname)

    // window.history.pushState(null, "", `?${params.toString()}`);
  }

  const [sortOrder, setSortOrder] = useState(
    searchParams ? searchParams.get('propertyType') : '',
  )

  useEffect(() => {
    if (!sortOrder) return

    const params = new URLSearchParams(searchParams)

    // ✅ prevent unnecessary router.push
    if (params.get('propertyType') === sortOrder) return

    params.set('propertyType', sortOrder)

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [sortOrder])

  //   useEffect(() => {
  //     setApiData(initialData)
  //     // Update search params when sortOrder changes
  //    if (sortOrder) {
  //   const params = new URLSearchParams(searchParams)
  //   // params.set('propertyType', sortOrder)

  //   router.push(`${pathname}?${params.toString()}`, { scroll: false })
  // }

  //     // if (typeof window !== 'undefined') {
  //     //   const currentUrl = window.location.href
  //     //   setUrl(currentUrl)
  //     // }

  //     // Set filter data from localStorage or initialize
  //     const localStorageFilterData = localStorage.getItem('filterData') || ''
  //     if (localStorageFilterData) {
  //       const filterData = JSON.parse(localStorageFilterData)
  //     } else {
  //       const data = {
  //         assetType: check,
  //         maxPrice,
  //         minPrice,
  //       }
  //       setFilterData(data)
  //       localStorage.setItem('filterData', JSON.stringify(data))
  //       setValue([handlemin(), handlemax()])
  //       setPriceRange([handlemin(), handlemax()])
  //     }

  //     if (maxPrice !== filterData.minPrice || minPrice !== filterData.maxPrice) {
  //       updateSortingForPrice()
  //     }
  //   }, [maxPrice, minPrice, sortOrder,initialData,  searchParams])

  const handleChangeCommitted = (event, newValue) => {
    event.preventDefault()
    if (Array.isArray(newValue)) {
      const data = {
        assetType: check,
        maxPrice: newValue[1],
        minPrice: newValue[0],
      }
      localStorage.setItem('filterData', JSON.stringify(data))
      setMaxPrice(newValue[1])
      setMinPrice(newValue[0])
      setPriceRange(newValue)
      updateSortingForPrice(newValue)
    }
  }

  const handlemin = () => {
    switch (check) {
      case 'property':
        return Number(getPropertyPrice?.lowestPrice) || 0
      case 'car':
        return Number(getCarPrice?.lowestPrice) || 0
      case 'boat':
        return Number(getBoatPrice?.lowestPrice) || 0
      case 'jewelry':
        return Number(getJewellryPrice?.lowestPrice) || 0
      default:
        return 0
    }
  }

  const handlemax = () => {
    switch (check) {
      case 'property':
        return Number(getPropertyPrice?.highestPrice) || 1000
      case 'car':
        return Number(getCarPrice?.highestPrice) || 1000
      case 'boat':
        return Number(getBoatPrice?.highestPrice) || 1000
      case 'jewelry':
        return Number(getJewellryPrice?.highestPrice) || 1000
      default:
        return 1000
    }
  }
  const updateSortingForPrice = (nextRange) => {
    const nextMin = Array.isArray(nextRange) ? nextRange[0] : value[0]
    const nextMax = Array.isArray(nextRange) ? nextRange[1] : value[1]
    const params = new URLSearchParams(searchParams)
    params.set('minPrice', String(nextMin))
    params.set('maxPrice', String(nextMax))
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  //------------------------------------
  // const propertytype1 = searchParams.get("propertyType");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        let response
        if (category === 'Boat') {
          response = await customAxios.get('/boat')
        } else if (
          category === 'Property For Sale' ||
          category === 'Property For Lease'
        ) {
          response = await customAxios.get('/property')
        } else if (category === 'Car') {
          response = await customAxios.get('/car')
        } else if (category === 'Jewelry') {
          response = await customAxios.get('/jewelry')
        }

        const products = response?.data?.products || []
        const formattedMap = buildCountryCityNeighbourhoodMap(products)

        setCountries(UAE_ONLY_COUNTRY_OPTIONS)
        setCountryCityMap(formattedMap)
        setSelectedCountry(LISTING_COUNTRY_UAE_LABEL)
        setCities(Object.keys(formattedMap[LISTING_COUNTRY_UAE_LABEL] || {}))
      } catch (error) {
        console.error('Error fetching countries data:', error)
      }
    }

    fetchCountries()
  }, [filterData])

  const fetchCities = async (countryName) => {
    try {
      const response = await axios.get(
        `/api/country?name=${countryName.replace(/ /g, '+')}`,
      )

      const filteredCities = response?.data?.cities?.filter((city) => {
        return totalcities.includes(city.name)
      })

      setCities(filteredCities)
      // setCities(response.data.cities);
    } catch (error) {
      console.error('Error fetching cities data:', error)
    }
  }

  const fetchNeighbourhoods = async (cityName) => {
    try {
      const res = await axios.get(
        `/api/city-coordinates?name=${cityName.replace(/ /g, '+')}`,
      )
      const { lat, lng } = res.data.location
      const response = await axios.get(
        `/api/neighbourhoods?lat=${lat}&lng=${lng}&city=${cityName.replace(
          / /g,
          '+',
        )}`,
      )
      const places = Array.isArray(response?.data?.places)
        ? response.data.places
        : Array.isArray(response?.data?.neighbourhoods)
          ? response.data.neighbourhoods
          : []
      setNeighbourhood(places)
    } catch (error) {
      console.error('Error fetching cities data:', error)
    }
  }

  const updateSortingForExtras = (selectedFilters, filterKey) => {
    updateSearchParams('facilities', selectedFilters[filterKey].join(','))
  }

  const handleChange = (event, newValue) => {
    event.preventDefault()

    setValue(newValue)
  }

  useEffect(() => {
    if (!check) return

    const boundsMin = handlemin()
    const boundsMax = handlemax()
    if (!Number.isFinite(boundsMin) || !Number.isFinite(boundsMax)) return

    let next = [boundsMin, boundsMax]

    const urlMinRaw = searchParams?.get?.('minPrice')
    const urlMaxRaw = searchParams?.get?.('maxPrice')
    const urlMin = urlMinRaw !== null ? Number(urlMinRaw) : NaN
    const urlMax = urlMaxRaw !== null ? Number(urlMaxRaw) : NaN

    if (Number.isFinite(urlMin) && Number.isFinite(urlMax)) {
      next = [urlMin, urlMax]
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('filterData')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          const storedMin = Number(parsed?.minPrice)
          const storedMax = Number(parsed?.maxPrice)
          if (
            parsed?.assetType === check &&
            Number.isFinite(storedMin) &&
            Number.isFinite(storedMax)
          ) {
            next = [storedMin, storedMax]
          }
        } catch (e) {
          // ignore malformed localStorage
        }
      }
    }

    // clamp into fetched bounds + keep ordering sane
    const clampedMin = Math.max(boundsMin, Math.min(next[0], boundsMax))
    const clampedMax = Math.min(boundsMax, Math.max(next[1], boundsMin))
    const finalRange =
      clampedMin <= clampedMax
        ? [clampedMin, clampedMax]
        : [boundsMin, boundsMax]

    setValue(finalRange)
    setPriceRange(finalRange)
    setMinPrice(finalRange[0])
    setMaxPrice(finalRange[1])
    setFilterData({
      assetType: check,
      minPrice: finalRange[0],
      maxPrice: finalRange[1],
    })
  }, [
    check,
    searchParams,
    getPropertyPrice,
    getCarPrice,
    getBoatPrice,
    getJewellryPrice,
  ])

  const handleClick = (value, e, item, make) => {
    // e.preventDefault();
    setCategory(value)
    localStorage.removeItem('filterData')
    switch (value) {
      case 'property for sale':
        router.push(
          `/property${
            item ? `?propertyType=${item}&assetType=Property For Sale` : ''
          }`,
        )
        break
      case 'property for lease':
        router.push(
          `/property${
            item ? `?propertyType=${item}&assetType=Property For Lease` : ''
          }`,
        )
        break
      case 'car':
        router.push(`/${value}${item ? `?make=${make}&model=${item}` : ''}`)
        break
      case 'boat':
        router.push(`/${value}${item ? `?category=${make}&model=${item}` : ''}`)
        break
      case 'jewelry':
        router.push(`/${value}${item ? `?category=${make}&model=${item}` : ''}`)
        break
      default:
        router.push(`/${value}`)
    }
  }

  const updateSortingForInteriorColor = () => {
    updateSearchParams('interiorColor', selectedFilters.filters2.join(','))
  }

  const updateSortingForExteriorColor = () => {
    updateSearchParams('exteriorColor', selectedFilters.filters.join(','))
  }

  const updateSortingForTechnicalFeatures = () => {
    updateSearchParams('technicalFeatures', selectedFilters.filters3.join(','))
  }

  const updateSortingForCarExtra = () => {
    updateSearchParams('extras', selectedFilters.filters4.join(','))
  }

  const updateSortingForMaterial = () => {
    updateSearchParams('materials', selectedFilters.filters5.join(','))
  }

  const updateSortingForCountry = (sortOrder) => {
    const country = sortOrder || LISTING_COUNTRY_UAE_LABEL
    setSelectedCountry(country)
    setCities(Object.keys(countryCityMap[country] || {}))
    updateSearchParams('city', null)
    updateSearchParams('country', country)
  }

  const updateSortingForCity = (sortOrder) => {
    const country = selectedCountry || LISTING_COUNTRY_UAE_LABEL
    setNeighbourhood(countryCityMap[country]?.[sortOrder] || [])

    updateSearchParams('city', sortOrder)
  }

  const updateSortingForNieghbourHood = (value) => {
    updateSearchParams('neighbourhood', value)
  }

  const updateSortingForBedrooms = (selectedFilters, filterKey) => {
    updateSearchParams('bedrooms', selectedFilters[filterKey].join(','))
  }

  const updateSortingForGrams = (sortOrder) => {
    updateSearchParams('grams', sortOrder)
  }
  console.log('new URL =>', `${pathname}?${searchParams.toString()}`)

  return (
    <div className='rounded-[12px] w-[300px] sm:w-[385px] flex flex-wrap lg:flex-nowrap gap-5 px-0 shadow-xl'>
      <aside className='custom-shadow w-full lg:w-[385px]'>
        <div className='flex justify-between border-b items-center px-5'>
          <span className=' block px-5 py-4 text-lg md:text-xl text-darkGray '>
            Side Menu
          </span>
          <button className='text-base lg:hidden' onClick={isSidebarVisible}>
            x
          </button>
        </div>
        <div className='border-b px-5 py-3'>
          {filterConfigs.map(({ title, options, defaultLabel }) => (
            <FilterSection
              key={title}
              title={title}
              options={options}
              updateSorting={handleClick}
              defaultLabel={defaultLabel}
            />
          ))}
        </div>
        <div className='border-b p-3 px-5'>
          <div className=''>Filter by Price</div>
          <div className='pl-1'>
            <Box sx={{ width: 300 }}>
              <Slider
                getAriaLabel={() => 'Minimum distance'}
                value={value}
                max={handlemax()}
                min={handlemin()}
                onChange={handleChange}
                onChangeCommitted={handleChangeCommitted}
                step={10}
                valueLabelDisplay='auto'
                getAriaValueText={() => 'Price range'}
              />
            </Box>
          </div>
          <p className='text-xs'>
            Price : AED {formatPriceUS(Number(value?.[0]) || handlemin())} - AED{' '}
            {formatPriceUS(Number(value?.[1]) || handlemax())}
          </p>
        </div>

        <div className='border-b py-3 px-5'>
          <FilterSection2
            title='Filter by Country'
            options={countries}
            updateSorting={updateSortingForCountry}
          />
        </div>

        <div className='border-b py-3 px-5'>
          <FilterSection2
            title='Filter by City'
            options={cities}
            updateSorting={updateSortingForCity}
          />
        </div>

        <div className='border-b py-3 px-5'>
          <FilterSection2
            title='Filter by Neighbourhood'
            options={neighbourhood}
            updateSorting={updateSortingForNieghbourHood}
          />
        </div>

        {pathname === '/property' && (
          <>
            <Extras
              title='Bedrooms'
              extras={bedroomsOptions}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              filterKey='filters'
              updateSortingForExtras={updateSortingForBedrooms}
            />
            <Extras
              title='Extras'
              extras={propertyExtras}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              filterKey='filters'
              updateSortingForExtras={updateSortingForExtras}
            />
          </>
        )}

        {pathname === '/car' || pathname === '/boat' ? (
          <>
            <Extras
              title='Exterior Colors'
              extras={exteriorColors}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              filterKey='filters'
              updateSortingForExtras={updateSortingForExteriorColor}
            />
            <Extras
              title='Interior Colors'
              extras={interiorColors}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              filterKey='filters2'
              updateSortingForExtras={updateSortingForInteriorColor}
            />
          </>
        ) : null}

        {pathname === '/car' && (
          <>
            <Extras
              title='Technical Features'
              extras={technicalFeatures}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              filterKey='filters3'
              updateSortingForExtras={updateSortingForTechnicalFeatures}
            />
            <Extras
              title='Car Extras'
              extras={carExtras}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              filterKey='filters4'
              updateSortingForExtras={updateSortingForCarExtra}
            />
          </>
        )}

        {pathname === '/boat' && (
          <Extras
            title='Boat Extras'
            extras={boatExtrasData}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            filterKey='filters4'
            updateSortingForExtras={updateSortingForCarExtra}
          />
        )}

        {pathname === '/jewelry' ? (
          <>
            {/* Grams Section */}
            <div className='border-b py-3 px-5'>
              <FilterSection2
                title='Grams'
                options={grams}
                updateSorting={updateSortingForGrams}
              />
            </div>

            <div className='py-3 px-5'>
              <Extras
                title='Materials'
                extras={materials}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                filterKey='filters5'
                updateSortingForExtras={updateSortingForMaterial}
              />
            </div>
          </>
        ) : null}
      </aside>
    </div>
  )
}
