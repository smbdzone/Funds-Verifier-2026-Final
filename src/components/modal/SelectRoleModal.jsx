import { useState } from 'react'

const SelectRoleModal = ({
  role = 'DealHunter',
  onSelect,
  onClose,
  handleSubmit,
}) => {
  return (
    <div className='fixed inset-0 flex  z-50 items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h2 className='text-xl font-semibold mb-4'>Select Your Role</h2>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Select Role:
          </label>
          <select
            value={role}
            onChange={(e) => onSelect(e.target.value)}
            className='mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='DealHunter'>DealHunter</option>
            <option value='AssetHolder'>AssetHolder</option>
          </select>
        </div>

        <div className='mt-4 flex justify-between'>
          <button onClick={onClose} className='text-gray-500'>
            Cancel
          </button>
          <button
            onClick={() => {
              handleSubmit()
            }}
            className='primary-gradient text-white px-4 py-2 rounded'
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default SelectRoleModal
