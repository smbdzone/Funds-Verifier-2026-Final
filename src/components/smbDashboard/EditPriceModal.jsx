import React, { useEffect, useState } from 'react'
import DropDown from '../DropdownComponent/DropDown'
import {
  asset,
  propertyType,
  bedroomsOptions,
} from '../../constants/listing-data'
import { SlArrowRight } from 'react-icons/sl'
import { carForSale, carTypes } from '../../constants/car-listings'
import { boatForSale } from '../../constants/sidebar'
import { jewelryForSale } from '../../constants/sidebar'
import { toast } from 'react-toastify'
import axios from 'axios'
import customAxios from '../../utils/apis/apis'

const EditPriceModal = ({ handleCloseModal, id, fetchData, userUUID }) => {
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [dropdownValue, setDropdownValue] = useState(propertyType)
  const [bedroomsDropDown, setBedroomsDropDown] = useState(bedroomsOptions)
  const [isBedroomsDropdownOpen, setIsBedroomsDropdownOpen] = useState(false)
  const [value, setValue] = useState()
  const [data, setData] = useState()
  const [assetType, setAssetType] = useState('Property For Sale')
  const [formData, setFormData] = useState({
    assetType: 'Property For Sale',
    category: '',
    subCategory: '',
    value: '',
    price: null,
  })

  useEffect(() => {
    getDataById()
  }, [])
  const getDataById = async () => {
    try {
      const res = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/price/${id}`
      )
      if (res?.data) {
        setData(res?.data)
        setAssetType(res?.data.assetType)
        setSubCategory(res?.data?.subCategory)
        setValue(res?.data?.value)

        setFormData({
          assetType: res?.data.assetType,
          category: res?.data.category,
          subCategory: res?.data.subCategory,
          value: res?.data.value,
          price: res?.data.price,
        })
      }
    } catch (error) {
      console.log(error?.message)
    }
  }

  const toggleBedroomsDropdown = () =>
    setIsBedroomsDropdownOpen(!isBedroomsDropdownOpen)

  const handleAssetTypeChange = (value) => {
    if (value === 'Property For Sale') {
      setDropdownValue(propertyType)
      setBedroomsDropDown(bedroomsOptions)
    } else if (value === 'Car For Sale') {
      const groupedData = carForSale.map(({ brand, models }) => ({
        text: brand,
        mapData: models.map((item) => ({ value: item })),
      }))
      setDropdownValue(groupedData)
      setBedroomsDropDown(carTypes)
    } else if (value === 'Boats For Sale') {
      const groupedData = boatForSale.map(({ brand, models }) => ({
        text: brand,
        mapData: models.map((item) => ({ value: item })),
      }))
      const boatTypess = boatForSale.map(({ brand }) => brand)
      setDropdownValue(groupedData)
      setBedroomsDropDown(boatTypess)
    } else if (value === 'Jewellery For Sale') {
      const groupedData = jewelryForSale.map(({ brand, models }) => ({
        text: brand,
        mapData: models.map((item) => ({ value: item })),
      }))
      const boatTypess = jewelryForSale.map(({ brand }) => brand)
      setDropdownValue(groupedData)
      setBedroomsDropDown(boatTypess)
    }
    setAssetType(value)
    setFormData((prevData) => ({
      ...prevData,
      assetType: value,
    }))
    setIsBedroomsDropdownOpen(false)
  }
  const hanldeSubmit = async () => {
    try {
      const res = await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/price/${id}`,
        { ...formData, userUUID: userUUID }
      )
      if (res?.data) {
        toast.success(res?.data?.message)
        fetchData()
        handleCloseModal()
      }
    } catch (error) {
      console.log(error?.message)
    }
  }
  return (
    <div
      id='modalOverlay'
      className='fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center'
    >
      <div className='w-[50%] h-[50%] bg-white p-2 rounded-md relative'>
        <button
          className='absolute top-2 right-2 text-4xl'
          onClick={handleCloseModal}
        >
          &times;
        </button>
        <h1 className='font-semibold text-2xl'>List Your Price</h1>
        <div className='flex flex-col justify-between items-center mt-12'>
          <div className='flex '>
            <div className='border border-black/50 w-auto px-4 py-2'>
              <h1 className='text-lg font-semibold'>Select Asset Type</h1>
              <div>
                <div className='relative'>
                  <button
                    onClick={toggleBedroomsDropdown}
                    className='text-left items-center text-black/60 gap-2 justify-between flex bg-white w-full focus:outline-none'
                  >
                    {assetType ? assetType : 'Select'}
                    <span className='rotate-90 mt-1'>
                      <SlArrowRight className='text-black/120' />
                    </span>
                  </button>

                  {isBedroomsDropdownOpen && (
                    <div className='absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-scroll'>
                      {asset?.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            handleAssetTypeChange(item.value)
                          }}
                          className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
                        >
                          {item.value}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='border border-black/50 w-auto px-4 py-2'>
              <h1 className='text-lg font-semibold'>Select Category</h1>
              <div className='flex justify-between items-center w-full bg-white'>
                <DropDown
                  dropdown3D={dropdownValue}
                  setCategory={setCategory}
                  subCategory={subCategory}
                  setSubCategory={setSubCategory}
                  setFormData={setFormData}
                  formData={formData}
                />
              </div>
            </div>
            <div className='border border-black/50 w-auto px-4 py-2'>
              <h1 className='text-lg font-semibold'>Select Type</h1>
              <div className='flex justify-between items-center w-full bg-white'>
                <DropDown
                  setValue={setValue}
                  value={value}
                  setFormData={setFormData}
                  formData={formData}
                  bedroomsDropDown={bedroomsDropDown}
                />
              </div>
            </div>
            <div className='border border-black/50 w-auto py-2'>
              <h1 className='text-lg font-semibold px-4'>Add Price</h1>
              <div className='flex justify-between items-center w-full bg-white'>
                <input
                  type='number'
                  className='border-none outline-none pl-2'
                  placeholder='Add price'
                  value={formData?.price || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => hanldeSubmit()}
            className='bg-prussianBlue text-white rounded-md mt-12 px-4 py-2'
          >
            Save Price
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditPriceModal
