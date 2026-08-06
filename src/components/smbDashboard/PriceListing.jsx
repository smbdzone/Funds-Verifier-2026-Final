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
import DeleteModal from '../Modals/DeleteModal'
import { useProfile } from '../../context/UserContext'
import customAxios from '../../utils/apis/apis'

/** Must match backend EVALUATOR_SHARED_PRICE_UUID */
const EVALUATOR_SHARED_PRICE_UUID = 'EVALUATOR_SHARED'

function isPositivePrice(value) {
  const num = Number(value)
  return Number.isFinite(num) && num > 0
}

function handlePriceInputChange(value, setFormData) {
  if (value === '') {
    setFormData((prev) => ({ ...prev, price: '' }))
    return
  }
  const num = Number(value)
  if (!Number.isFinite(num) || num < 0) return
  setFormData((prev) => ({ ...prev, price: value }))
}

function resolvePriceOwnerUuid(user) {
  const role = String(user?.role || '')
    .replace(/[\s-_]/g, '')
    .toLowerCase()
  if (role === 'evaluator') return EVALUATOR_SHARED_PRICE_UUID
  return user?.uuid
}

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
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const { user, loading } = useProfile()
  const [fetchError, setFetchError] = useState('')
  const [isFetchingPrices, setIsFetchingPrices] = useState(false)
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
    // TEMP OPEN: still load shared price list when session is missing.
    if (loading) return
    fetchData()
  }, [user?.uuid, user?.role, loading])

  const fetchData = async () => {
    const ownerUuid = resolvePriceOwnerUuid(user) || EVALUATOR_SHARED_PRICE_UUID
    if (!ownerUuid) return

    setIsFetchingPrices(true)
    setFetchError('')
    try {
      const res = await customAxios.get(`/price/all/${ownerUuid}`)
      setData(Array.isArray(res?.data) ? res.data : [])
    } catch (error) {
      console.error('Error fetching price data:', error?.message)
      const message =
        error?.response?.data?.message || 'Could not load saved prices'
      setFetchError(message)
      toast.error(message)
      setData([])
    } finally {
      setIsFetchingPrices(false)
    }
  }

  const hanldeSubmit = async () => {
    if (assetType === 'Property For Sale') {
      if (
        !formData.assetType ||
        !formData.category ||
        !formData.subCategory ||
        !formData.value ||
        !formData.price
      ) {
        toast.error(
          'Please select property type, subcategory, bedrooms, and price',
        )
        return
      }
    } else if (!formData.assetType || !formData.category || !formData.price) {
      toast.error('Please enter all fields')
      return
    }

    if (!isPositivePrice(formData.price)) {
      toast.error('Price must be greater than zero')
      return
    }

    if (formData.assetType && formData.category && formData.price) {
      if (assetType === 'Property For Sale') {
        try {
          const res = await customAxios.post('/price', {
            ...formData,
            userUUID: resolvePriceOwnerUuid(user),
          })

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
          toast.success(res?.data?.message || 'Price saved successfully')
          fetchData()
        } catch (error) {
          console.error('Error updating price:', error?.message)
          toast.error(
            error?.response?.data?.message || 'Could not save price',
          )
        }
      } else {
        try {
          const res = await customAxios.post('/price', {
            price: formData.price,
            category: formData.category,
            assetType: formData.assetType,
            userUUID: resolvePriceOwnerUuid(user),
          })

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
          toast.success(res?.data?.message || 'Price saved successfully')
          fetchData()
        } catch (error) {
          console.error('Error creating price:', error?.message)
          toast.error(
            error?.response?.data?.message || 'Could not save price',
          )
        }
      }
    } else {
      toast.error('Please Enter All Fields')
    }
  }
  const handleDeleteClick = async (id) => {
    try {
      const res = await customAxios.delete(`/price/${id}`)
      fetchData()
      toast.success(res?.data?.message || 'Price deleted successfully')
    } catch (error) {
      console.error('Error deleting price:', error?.message)
      toast.error(
        error?.response?.data?.message || 'Could not delete price',
      )
    } finally {
      setDeleteTargetId(null)
    }
  }

  const openDeleteConfirm = (id) => {
    setDeleteTargetId(id)
  }

  const closeDeleteConfirm = () => {
    setDeleteTargetId(null)
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
    <div className='md:py-3 w-full max-w-full min-w-0 bg-white flex flex-col items-center border-b border-border'>
      <div className='w-full min-w-0'>
        <div className='primary-gradient flex items-center justify-between border border-black rounded py-2.5 px-3 overflow-x-auto'>
          <h2 className='text-white font-semibold text-sm lg:text-base'>
            Evaluation Price List
          </h2>
        </div>

        <div className='w-full min-w-0 py-4 text-prussianBlue'>
          <div className='flex lg:flex-row flex-col justify-between gap-2 items-stretch lg:items-center'>
            <div className='flex lg:flex-row flex-col w-full min-w-0'>
              <div className='border border-prussianBlue w-full px-4 py-2'>
                <h1 className='lg:text-base truncate sm:text-sm text-xs text-prussianBlue font-semibold'>
                  Select Asset Type
                </h1>
                <div className='w-full'>
                  <div className='relative'>
                    <button
                      onClick={toggleBedroomsDropdown}
                      className='text-left text-sm items-center text-prussianBlue font-medium gap-2 justify-between flex bg-white w-full focus:outline-none'
                    >
                      {assetType
                        ? assetUpdated?.find((a) => a.value === assetType)
                          ?.label || assetType
                        : 'Select'}
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
                            {item.label || item.value}
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
                      buttonClassName='text-sm text-prussianBlue font-medium'
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
                      buttonClassName='text-sm text-prussianBlue font-medium'
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
                      buttonClassName='text-sm text-prussianBlue font-medium'
                    />
                  </div>
                </div>
              )}

              <div className='border border-prussianBlue w-auto py-2'>
                <h1 className='lg:text-base sm:text-sm text-xs font-semibold text-prussianBlue px-4'>
                  Evaluation Fee (AED)
                </h1>
                <div className='flex justify-between items-center w-full bg-white'>
                  <input
                    type='number'
                    className='border-none outline-none pl-2 text-prussianBlue font-medium'
                    placeholder='Add price'
                    value={formData.price}
                    min={1}
                    step={1}
                    onChange={(e) => handlePriceInputChange(e.target.value, setFormData)}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => hanldeSubmit()}
              className='primary-gradient text-white rounded-md px-4 py-3 lg:py-4 shrink-0'
            >
              Save
            </button>
          </div>
          <div className='custom-shadow rounded mt-8 w-full max-w-full min-w-0 overflow-hidden'>
            <table className='w-full table-fixed text-xs sm:text-sm bg-white'>
              <thead>
                <tr className='primary-gradient text-white'>
                  <th className='py-2 px-2 text-left font-medium w-[17%]'>Asset Type</th>
                  <th className='py-2 px-2 text-left font-medium w-[15%]'>Category</th>
                  <th className='py-2 px-2 text-left font-medium w-[14%]'>Subcategory</th>
                  <th className='py-2 px-2 text-left font-medium w-[24%]'>Value</th>
                  <th className='py-2 px-2 text-left font-medium w-[12%]'>Price</th>
                  <th className='py-2 px-2 text-left font-medium w-[18%]'>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading || isFetchingPrices ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='py-8 px-2 text-center text-gray-500'
                    >
                      Loading prices…
                    </td>
                  </tr>
                ) : fetchError ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='py-8 px-2 text-center text-red-600'
                    >
                      {fetchError}
                    </td>
                  </tr>
                ) : !data?.length ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='py-8 px-2 text-center text-gray-500'
                    >
                      No saved prices yet.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.uuid}
                      className='border-t border-gray-200 hover:bg-gray-50'
                    >
                      <td className='py-2 px-2 capitalize text-prussianBlue font-medium truncate' title={item?.assetType}>
                        {item?.assetType}
                      </td>
                      <td className='py-2 px-2 capitalize text-prussianBlue truncate' title={item.category}>
                        {item.category}
                      </td>
                      <td className='py-2 px-2 capitalize text-prussianBlue truncate' title={item.subCategory}>
                        {item.subCategory}
                      </td>
                      <td
                        className='py-2 px-2 capitalize text-prussianBlue truncate'
                        title={
                          item.assetType === 'Property For Sale'
                            ? `${item.value} bedroom ${item.subCategory}`
                            : item.value
                        }
                      >
                        {item.assetType === 'Property For Sale'
                          ? `${item.value} bedroom ${item.subCategory}`
                          : item.value}
                      </td>
                      <td className='py-2 px-2 text-prussianBlue font-medium whitespace-nowrap'>
                        {item.price}
                      </td>
                      <td className='py-1 px-1 whitespace-nowrap'>
                        <IconButton
                          size='small'
                          style={{
                            background: 'transparent',
                          }}
                          onClick={() => {
                            openDeleteConfirm(item.uuid)
                          }}
                        >
                          <DeleteIcon className={'text-blue'} />
                        </IconButton>

                        <IconButton
                          size='small'
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
                          userUUID={resolvePriceOwnerUuid(user)}
                        />
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {deleteTargetId && (
        <DeleteModal
          onClose={closeDeleteConfirm}
          onDelete={() => handleDeleteClick(deleteTargetId)}
          title='Delete Price'
          message='Are you sure you want to delete this evaluation price?'
        />
      )}
    </div>
  )
}

export default PriceListing
