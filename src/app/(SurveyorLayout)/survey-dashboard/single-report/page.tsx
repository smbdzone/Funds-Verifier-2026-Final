'use client'

import { useState } from 'react'
import {
  FilePlus2,
  FileText,
  User,
  Mail,
  Phone,
  UploadCloud,
  Tag,
} from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import customAxios from '@/utils/apis/apis'

const ReportForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateTime: '',
    assetType: '',
    productTitle: '',
    category: '',
    subcategory: '',
    estimatedValue: '',
    price: '',
    paymentStatus: 'unpaid',
  })

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const assetOptions = [
    'Property For Sale',
    'Car For Sale',
    'Jewellery For Sale',
    'Boats For Sale',
  ]

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    setLoading(true)
    try {
      // 1. Submit form data to create report
      const { data } = await customAxios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/report/technical-report`,
        formData
      )

      toast.success('Report saved successfully!')

      // 2. Upload the file if selected
      if (file && data?.uuid) {
        const fileForm = new FormData()
        fileForm.append('file', file)

        await customAxios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/report/technical-report/${data.uuid}`,
          fileForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        toast.success('File uploaded successfully!')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit report or upload file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-white rounded-xl p-6 shadow-lg max-w-3xl mx-auto mt-10'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
        Submit Technical Report
      </h2>

      <form className='space-y-6' onSubmit={handleSubmit}>
        {/* Full Name */}
        <div>
          <label className='block text-gray-700 font-medium mb-1'>
            Full Name
          </label>
          <div className='flex items-center border border-gray-300 rounded-lg p-2'>
            <User className='mr-2 text-gray-500' size={18} />
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Your Name'
              required
              className='w-full outline-none'
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className='block text-gray-700 font-medium mb-1'>Email</label>
          <div className='flex items-center border border-gray-300 rounded-lg p-2'>
            <Mail className='mr-2 text-gray-500' size={18} />
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='you@example.com'
              required
              className='w-full outline-none'
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className='block text-gray-700 font-medium mb-1'>
            Phone Number
          </label>
          <div className='flex items-center border border-gray-300 rounded-lg p-2'>
            <Phone className='mr-2 text-gray-500' size={18} />
            <input
              type='tel'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              placeholder='+92-300-1234567'
              required
              className='w-full outline-none'
            />
          </div>
        </div>

        {/* Date & Time */}
        <div>
          <label className='block text-gray-700 font-medium mb-1'>
            Preferred Date & Time
          </label>
          <input
            type='datetime-local'
            name='dateTime'
            value={formData.dateTime}
            onChange={handleChange}
            required
            className='w-full border border-gray-300 rounded-lg p-2'
          />
        </div>

        {/* Asset Type */}
        <div>
          <label className='block text-gray-700 font-medium mb-1'>
            Asset Type
          </label>
          <select
            name='assetType'
            value={formData.assetType}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-lg p-2'
          >
            <option value=''>Select Asset Type</option>
            {assetOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Product Title */}
        <div>
          <label className='block text-gray-700 font-medium mb-1'>
            Product Title (optional)
          </label>
          <input
            type='text'
            name='productTitle'
            value={formData.productTitle}
            onChange={handleChange}
            placeholder='e.g. 2 Kanal Plot in DHA'
            className='w-full border border-gray-300 rounded-lg p-2'
          />
        </div>

        {/* Report File Upload */}
        <div>
          <label className='block text-gray-700 font-medium mb-1'>
            Upload Report (optional)
          </label>
          <div className='flex items-center gap-2 border border-dashed border-gray-400 rounded-lg p-4 bg-gray-50'>
            <UploadCloud size={20} />
            <input
              type='file'
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0])
                } else {
                  setFile(null)
                }
              }}
              className='w-full bg-transparent'
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className='block text-gray-700 font-medium mb-1'>
            Category
          </label>
          <input
            type='text'
            name='category'
            value={formData.category}
            onChange={handleChange}
            placeholder='Category'
            className='w-full border border-gray-300 rounded-lg p-2'
          />
        </div>

        {/* Subcategory */}
        <div>
          <label className='block text-gray-700 font-medium mb-1'>
            Subcategory
          </label>
          <input
            type='text'
            name='subcategory'
            value={formData.subcategory}
            onChange={handleChange}
            placeholder='Subcategory'
            className='w-full border border-gray-300 rounded-lg p-2'
          />
        </div>

        {/* Estimated Value */}
        <div>
          <label className='block text-gray-700 font-medium mb-1'>
            Estimated Value
          </label>
          <input
            type='text'
            name='estimatedValue'
            value={formData.estimatedValue}
            onChange={handleChange}
            placeholder='e.g. $50,000'
            className='w-full border border-gray-300 rounded-lg p-2'
          />
        </div>

        {/* Price */}
        <div>
          <label className='block text-gray-700 font-medium mb-1'>Price</label>
          <input
            type='number'
            name='price'
            value={formData.price}
            onChange={handleChange}
            placeholder='e.g. 200000'
            className='w-full border border-gray-300 rounded-lg p-2'
          />
        </div>

        {/* Payment Method Status */}
        <div>
          <label className='block text-gray-700 font-medium mb-1'>
            Payment Status
          </label>
          <select
            name='paymentStatus'
            value={formData.paymentStatus}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-lg p-2'
          >
            <option value='unpaid'>Unpaid</option>
            <option value='paid'>Paid</option>
          </select>
        </div>

        {/* Submit Buttons */}
        <div className='flex justify-end gap-3 pt-4'>
          <button
            type='reset'
            className='px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={loading}
            className='px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700'
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReportForm
