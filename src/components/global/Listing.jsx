'use client'
import React, { useState, useEffect } from 'react'
import {
  asset,
  carForSale,
  Commercial,
  Residential,
} from '@/constants/listing-data'
import { toUnitedArabEmiratesListingCountryName } from '@/libs/dummyLocationData'
import { isListingEvaluatorApprovedLocked } from '@/libs/listingEditLock'
import DropdownComponent from '../../components/DropdownComponent/DropdownComponent'

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
  setModels,
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
  setLand,
  errors,
}) => {
  const [type, setType] = useState(false)

  const [residential, setResidential] = useState(false)
  const [commercial, setCommercial] = useState(false)
  const [multiple, setMultiple] = useState(false)

  const togglePropertTypeDropdown = () => {
    setType(!type)
  }
  const [filteredCities, setFilteredCities] = useState([])
  const [filterneighbours, setFilteredNeighbours] = useState([])

  useEffect(() => {
    setFilteredCities(
      (cities ?? [])
        .map((item) =>
          typeof item === 'string' ? item : item?.description,
        )
        .filter(Boolean),
    )
  }, [searchQueryCity, cities])

  useEffect(() => {
    const query = (searchQueryNeighbourhood || '').toLowerCase()
    const filtered = (neighbourhoods ?? []).filter((item) => {
      const name = item?.name
      if (!name) return false
      return name.toLowerCase().includes(query)
    })

    setFilteredNeighbours(filtered.map((item) => item.name))
  }, [searchQueryNeighbourhood, neighbourhoods])

  const toggleResidentialDropdown = () => {
    setResidential(!residential)
  }
  const toggleCommercialDropdown = () => {
    setCommercial(!commercial)
  }
  const toggleMultipleDropdown = () => {
    setMultiple(!multiple)
  }

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

    {
      text: 'Multiple',
      state: commercial,
      setState: setResidential,
      onclick: toggleMultipleDropdown,
    },
  ]

  const togglePriceDropdown = () => {}
  const toggleBedsDropdown = () => {}
  const handleMake = (make) => {
    handleMakeClick(make.brand)
    setModels(make.models)
  }

  const handleProperty = (ele) => {
    handlePropertyTypeSelect(ele)
    setType(false)
  }

  const isEvaluatorApprovedLocked = isListingEvaluatorApprovedLocked(formData)

  const dropdownConfigs = [
    {
      label: 'Asset Type',
      isListings: property || car || boat || jewelry,
      handleToggleDropdown: () => handleToggleDropdown('assetType'),
      formData: formData?.assetType,
      handleMouseLeave: () => handleMouseLeave('assetType'),
      handleSelectOption: handleSelectOption,
      dropdowns: dropdowns.assetType,
      dropdownOptions: asset,
      error: errors.assetType && formData.assetType === 'Select Asset Type',
      errorMessage: errors.assetType,
      disabled: isEvaluatorApprovedLocked,
    },
    {
      label: 'All Countries',
      isListings: property || car || boat || jewelry,
      handleToggleDropdown: toggleDropdownn,
      formData: toUnitedArabEmiratesListingCountryName(
        formData?.country || selectedCountry,
      ),
      handleSelectOption: handleCountrySelect,
      dropdowns: isOpen,
      dropdownOptions: filteredCountries,
      searchQuery,
      setSearchQuery,
      placeholder: 'Search Country',
      error: errors.country && !formData.country,
      errorMessage: errors.country,
      disabled: isEvaluatorApprovedLocked,
    },
    {
      label: 'City',
      isListings: property || car || boat || jewelry,
      handleToggleDropdown: toggleCityDropdown,
      formData: formData?.city || selectedCity,
      handleSelectOption: handleCitySelect,
      dropdowns: isCityDropdownOpen,
      dropdownOptions: filteredCities,
      searchQuery: searchQueryCity,
      setSearchQuery: setSearchQueryCity,
      placeholder: 'Search City',
      error: errors.city && !formData.city,
      errorMessage: errors.city,
      disabled: isEvaluatorApprovedLocked,
    },
    {
      label: 'Neighbourhood',
      isListings: property || car || boat || jewelry,
      handleToggleDropdown: toggleNeighbourDropdown,
      formData: formData?.neighbourhood || selectedNeighbourhood,
      handleSelectOption: handleNeighbour,
      dropdowns: isNeighbourDropdownOpen,
      dropdownOptions: filterneighbours,
      searchQuery: searchQueryNeighbourhood,
      setSearchQuery: setSearchQueryNeighbourhood,
      placeholder: 'Search Neighbourhood',
      error: errors.city && !formData.neighbourhood,
      errorMessage: errors.neighbourhood,
      disabled: isEvaluatorApprovedLocked,
    },
    {
      label: 'Make',
      isListings: car,
      handleToggleDropdown: toggleMakeDropdown,
      formData: formData?.make || selectedMake,
      handleSelectOption: handleMake,
      dropdowns: makeDropdownVisible,
      setSearchQuery,
      dropdownOptions: carForSale,
      error: errors.make && !formData.make,
      errorMessage: errors.make,
      disabled: isEvaluatorApprovedLocked,
    },
    {
      label: 'Category',
      isListings: boat || jewelry,
      handleToggleDropdown: toggleDropdown,
      formData: formData?.category || selectedCategory,
      handleSelectOption: handleCategoryClick,
      dropdowns: dropdownVisible,
      dropdownOptions: categories && Object.keys(categories),
      error: errors.category && !formData.category,
      errorMessage: errors.category,
      disabled: isEvaluatorApprovedLocked,
    },
    {
      label: 'Subcategory',
      isListings: jewelry,
      handleToggleDropdown: toggleModelDropdown,
      formData: formData?.model || selectedModel,
      handleSelectOption: handleModelClick,
      dropdowns: modelDropdownVisible,
      dropdownOptions: models,
      error: errors.model && !formData.model,
      errorMessage: errors.model,
      disabled: isEvaluatorApprovedLocked,
    },
    {
      label: 'Model',
      isListings: car || boat,
      handleToggleDropdown: toggleModelDropdown,
      formData: formData?.model || selectedModel,
      handleSelectOption: handleModelClick,
      dropdowns: modelDropdownVisible,
      dropdownOptions: models,
      error: errors.model && !formData.model,
      errorMessage: errors.model,
      disabled: isEvaluatorApprovedLocked,
    },
    {
      label: 'Property Type',
      isListings: property,
      handleToggleDropdown: togglePropertTypeDropdown,
      formData: formData?.propertyType || selectType,
      handleMouseLeave: () => setType(false),
      handleSelectOption: handleProperty,
      dropdowns: type,
      dropdownOptions: propertyType,
      setLand: setLand,
      error: errors.propertyType && !formData.propertyType,
      errorMessage: errors.propertyType,
      disabled: isEvaluatorApprovedLocked,
    },
  ]

  return (
    <div className='px-5 mt-[51px]'>
      <div className=' flex md:flex md:flex-row flex-col xxs:justify-center max-w-[1300px] my-5 md:my-0 mx-auto shadow-neons bg-whitee rounded-[5px] xxs:pr-[10px] md:h-[70px] sm:h-[215px] xxs:h-[280px]'>
        {dropdownConfigs.map((config, index) => (
          <DropdownComponent key={index} {...config} />
        ))}
      </div>
    </div>
  )
}

export default Listing
