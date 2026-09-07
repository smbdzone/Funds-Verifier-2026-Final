'use client'

import { IoCheckmarkSharp } from 'react-icons/io5'
import { getListingAmenities } from '@/libs/listingAmenities'
import { getEvaluatorListingContact } from './getEvaluatorListingContact'
import InputField from './InputField'

/** Asset holder name (cleaned), email, and listing phone. */
export function EvaluatorAssetHolderFields({ listing }) {
  const { fullName, email, phoneNumber } = getEvaluatorListingContact(listing)

  return (
    <>
      <div className='mb-4 grid gap-4 sm:grid-cols-2'>
        <InputField label='Asset Holder Full Name' value={fullName} />
        <InputField label='Email Address' value={email} />
      </div>
      <div className='mb-4 grid gap-4 sm:grid-cols-2'>
        <InputField label='Phone Number' value={phoneNumber} />
      </div>
    </>
  )
}

/** All amenities / facilities / extras for the listing. */
export function EvaluatorAmenitiesList({ listing, title = 'Amenities' }) {
  const amenities = getListingAmenities(listing)

  if (!amenities.length) {
    return (
      <div className='mb-4'>
        <p className='text-sm font-medium text-[#969696]'>{title}</p>
        <p className='mt-2 text-sm text-[#969696]'>No amenities listed.</p>
      </div>
    )
  }

  return (
    <div className='mb-4'>
      <p className='mb-2 text-sm font-medium text-[#969696]'>{title}</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        {amenities.map((item) => (
          <div key={item} className='col-span-1'>
            <div className='flex flex-row flex-wrap items-center space-x-2 p-2 text-base font-normal text-[#969696]'>
              <IoCheckmarkSharp className='mr-2 shrink-0' />
              <span>{item}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
