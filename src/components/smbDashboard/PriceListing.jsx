import React, { useEffect, useState } from 'react'
import DropDown from '../DropdownComponent/DropDown'
import {
  asset,
  propertyType,
  bedroomsOptions,
} from '../../constants/listing-data'
import { SlArrowRight } from 'react-icons/sl'
import { carTypes } from '../../constants/car-listings'
import { boatForSale } from '../../constants/sidebar'
import { jewelryForSale } from '../../constants/sidebar'
import { toast } from 'react-toastify'
import axios from 'axios'
import { IconButton } from '@mui/material'
import { EditIcon, DeleteIcon } from '@/components/Icons'
import EditPriceModal from './EditPriceModal'
import { useProfile } from '../../context/UserContext'
import customAxios from '../../utils/apis/apis'

const PriceListing = () => {
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [dropdownValue, setDropdownValue] = useState(propertyType)
  const [bedroomsDropDown, setBedroomsDropDown] = useState(bedroomsOptions)
  const [isBedroomsDropdownOpen, setIsBedroomsDropdownOpen] = useState(false)
  const [value, setValue] = useState()
  const [data, setData] = useState()
  const [match, setMatch] = useState()
  const [assetType, setAssetType] = useState('Property For Sale')
  const [formData, setFormData] = useState({
    assetType: assetType,
    category: '',
    subCategory: '',
    value: value,
    price: null,
  })
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useProfile()
  const toggleBedroomsDropdown = () =>
    setIsBedroomsDropdownOpen(!isBedroomsDropdownOpen)

  const handleAssetTypeChange = (value) => {
    if (value === 'Property For Sale') {
      setDropdownValue(propertyType)
      setBedroomsDropDown(bedroomsOptions)
      setFormData({
        assetType: '',
        category: '',
        subCategory: '',
        value: value,
        price: 0,
      })
      setCategory('')
      setSubCategory('')
      setValue('')
      fetchData()
    } else if (value === 'Car For Sale') {
      const groupedData = carTypes.map((item) => ({
        text: item,
      }))
      setDropdownValue(groupedData)
      setFormData({
        assetType: '',
        category: '',
        subCategory: '',
        value: value,
        price: 0,
      })
      setCategory('')
      setSubCategory('')
    } else if (value === 'Boats For Sale') {
      const groupedData = boatForSale.map(({ brand, models }) => ({
        text: brand,
        mapData: models.map((item) => ({ value: item })),
      }))
      setFormData({
        assetType: '',
        category: '',
        subCategory: '',
        value: value,
        price: 0,
      })

      setCategory('')
      setSubCategory('')

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
      setFormData({
        assetType: '',
        category: '',
        subCategory: '',
        value: value,
        price: 0,
      })
      setCategory('')
      setSubCategory('')
    }
    setAssetType(value)
    setFormData((prevData) => ({
      ...prevData,
      assetType: value,
    }))
    setIsBedroomsDropdownOpen(false)
  }
  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const res = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/price/all/${user?.uuid}`
      )
      if (res?.data) {
        setData(res?.data)
      }
    } catch (error) {
      console.error('Error fetching price data:', error?.message)
    }
  }

  const hanldeSubmit = async () => {
    if (formData.assetType && formData.category && formData.price) {
      if (assetType === 'Property For Sale') {
        try {
          const res = await customAxios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/price`,
            { ...formData, userUUID: user?.uuid }
          )

          if (res) {
            setFormData({
              assetType: '',
              category: '',
              subCategory: '',
              value: value,
              price: 0,
            })
            setAssetType('Property For Sale')
            setCategory('')
            setSubCategory('')
            setValue('')
            toast.success(res?.data?.message)
            fetchData()
          }
        } catch (error) {
          console.error('Error updating price:', error?.message)
        }
      } else {
        try {
          const res = await customAxios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/price`,
            {
              price: formData.price,
              category: formData.category,
              assetType: formData.assetType,
              userUUID: user?.uuid,
            }
          )

          if (res) {
            setFormData({
              assetType: '',
              category: '',
              subCategory: '',
              value: value,
              price: 0,
            })
            setAssetType('Property For Sale')
            setCategory('')
            setSubCategory('')
            setValue('')
            toast.success(res?.data?.message)
            fetchData()
          }
        } catch (error) {
          console.error('Error creating price:', error?.message)
        }
      }
    } else {
      toast.error('Please Enter All Fields')
    }
  }
  const handleDeleteClick = async (id) => {
    try {
      const res = await customAxios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/price/${id}`
      )
      if (res) {
        fetchData()
        toast.success(res?.data?.message)
      }
    } catch (error) {
      console.error('Error deleting price:', error?.message)
    }
  }
  const handleCloseModal = () => {
    setIsOpen(false)
  }
  const assetUpdated = asset.filter(
    (item) =>
      item.value !== 'Property For Lease' &&
      item.value !== 'Property Off Plan For Sale'
  )

  return (
    <div className=''>
      <h1 className='font-semibold text-prussianBlue sm:text-lg text-base lg:text-2xl'>
        List Your Price
      </h1>
      <div className='flex lg:flex-row flex-col justify-between gap-2 items-center mt-12'>
        <div className='flex lg:flex-row flex-col w-full'>
          <div className='border border-prussianBlue w-full px-4 py-2'>
            <h1 className='lg:text-base truncate sm:text-sm text-xs text-prussianBlue font-semibold'>
              Select Asset Type
            </h1>
            <div className='w-full'>
              <div className='relative'>
                <button
                  onClick={toggleBedroomsDropdown}
                  className='text-left text-sm items-center text-black/60 gap-2 justify-between flex bg-white w-full focus:outline-none'
                >
                  {assetType ? assetType : 'Select'}
                  <span className='rotate-90 mt-1'>
                    <SlArrowRight className='text-black/120' />
                  </span>
                </button>

                {isBedroomsDropdownOpen && (
                  <div className='absolute -left-4 mt-2 w-full bg-white border border-prussianBlue rounded-lg shadow-lg z-10 max-h-60'>
                    {assetUpdated?.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          handleAssetTypeChange(item.value)
                        }}
                        className='w-full truncate lg:text-base sm:text-sm text-xs px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
                      >
                        {item.value}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {assetType === 'Property For Sale' ? (
            <div className='border border-prussianBlue w-full px-4 py-2'>
              <h1 className='lg:text-base sm:text-sm text-xs text-prussianBlue font-semibold'>
                Select Category
              </h1>
              <div className='flex justify-between items-center w-full bg-white'>
                <DropDown
                  dropdown3D={dropdownValue}
                  setCategory={setCategory}
                  subCategory={subCategory}
                  category={category}
                  setSubCategory={setSubCategory}
                  setFormData={setFormData}
                  formData={formData}
                />
              </div>
            </div>
          ) : (
            <div className='border border-prussianBlue w-full px-4 py-2'>
              <h1 className='lg:text-base sm:text-sm text-xs text-prussianBlue font-semibold'>
                Select Category
              </h1>
              <div className='flex justify-between items-center bg-white'>
                <DropDown
                  dropdown={dropdownValue}
                  setCategory={setCategory}
                  subCategory={subCategory}
                  category={category}
                  setSubCategory={setSubCategory}
                  setFormData={setFormData}
                  formData={formData}
                />
              </div>
            </div>
          )}

          {assetType === 'Property For Sale' && (
            <div className='border border-prussianBlue w-full px-4 py-2'>
              <h1 className='lg:text-base sm:text-sm text-xs text-prussianBlue font-semibold'>
                Select Type
              </h1>
              <div className='flex justify-between items-center bg-white'>
                <DropDown
                  setValue={setValue}
                  value={value}
                  setFormData={setFormData}
                  formData={formData}
                  bedroomsDropDown={bedroomsDropDown}
                />
              </div>
            </div>
          )}

          <div className='border border-prussianBlue w-auto py-2'>
            <h1 className='lg:text-base sm:text-sm text-xs font-semibold text-prussianBlue px-4'>
              Add Price
            </h1>
            <div className='flex justify-between items-center w-full bg-white'>
              <input
                type='number'
                className='border-none outline-none pl-2'
                placeholder='Add price'
                value={formData.price}
                min={0}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <button
          onClick={() => hanldeSubmit()}
          className='bg-prussianBlue text-white rounded-md px-4 py-2'
        >
          Save
        </button>
      </div>
      <div className='border border-prussianBlue rounded-md mt-20'>
        <div className='relative overflow-x-auto'>
          <table className='w-full sm:text-sm text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 text-white uppercase bg-prussianBlue dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Asset Type
                </th>
                <th scope='col' className='px-6 py-3'>
                  Category
                </th>
                <th scope='col' className='px-6 py-3'>
                  Subcategory
                </th>
                <th scope='col' className='px-6 py-3'>
                  Value
                </th>
                <th scope='col' className='px-6 py-3'>
                  Price
                </th>
                <th scope='col' className='px-6 py-3'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, i) => (
                <tr
                  key={item.uuid}
                  className='bg-white border-b dark:bg-gray-800 dark:border-prussianBlue'
                >
                  <th
                    scope='row'
                    className='px-6 text-prussianBlue py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                  >
                    {item?.assetType}
                  </th>
                  <td className='px-6 text-prussianBlue py-4'>
                    {item.category}
                  </td>
                  <td className='px-6 text-prussianBlue py-4'>
                    {item.subCategory}
                  </td>
                  <td className='px-6 text-prussianBlue py-4'>
                    {item.assetType === 'Property For Sale'
                      ? `${item.value} bedroom ${item.subCategory}`
                      : item.value}
                  </td>
                  <td className='px-6 text-prussianBlue py-4'>{item.price}</td>
                  <td className='px-6 text-prussianBlue py-4'>
                    {/* Delete Icon */}
                    <IconButton
                      style={{
                        background: 'transparent',
                      }}
                      onClick={() => {
                        handleDeleteClick(item.uuid)
                      }}
                    >
                      <DeleteIcon className={'text-blue'} />
                    </IconButton>

                    {/* Edit Icon with IconButton */}
                    <IconButton
                      style={{
                        background: 'transparent',
                      }}
                      onClick={() => {
                        setIsOpen(true)
                        setMatch(item.uuid)
                      }}
                    >
                      <EditIcon className='text-blue' />
                    </IconButton>
                  </td>
                  {isOpen && match === item.uuid && (
                    <EditPriceModal
                      handleCloseModal={handleCloseModal}
                      id={item.uuid}
                      fetchData={fetchData}
                      userUUID={user?.uuid}
                    />
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PriceListing
