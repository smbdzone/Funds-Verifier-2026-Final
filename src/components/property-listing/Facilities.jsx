'use client'

import Image from 'next/image'
import React from 'react'
import ConfirmationModal from '@/components/AddListing/ConfirmationModal'
import ListingMapSection from '@/components/ListingsForm/ListingMapSection'
import FacilitiesChecklist from '@/components/property-listing/FacilitiesChecklist'
import { IoReload } from 'react-icons/io5'
import { isListingEvaluatorApprovedLocked } from '@/libs/listingEditLock'

const Facilities = React.memo(
  ({
    formData,
    listings,
    handleRadioChange,
    handleCheckboxChange,
    handleChange,
    setFormData,
    facilities,
    adImage,
    submitConfirmation,
    loading,
    confirmationModal,
    handleSubmit,
    setConfirmationModal,
    id,
  }) => {
    const fieldsLocked = isListingEvaluatorApprovedLocked(formData)
    const showListingVisibility =
      Number(formData?.price) >= 5000000 || Boolean(id) || fieldsLocked

    return (
      <div className='pt-[30px]'>
        <div className='px-[19px] space-y-3'>
          {showListingVisibility ? (
            <>
              <h2 className='text-dark-black text-xl font-medium pt-5'>
                Listing
              </h2>
              <form className='mt-[10px] grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1  justify-between gap-y-[10px]'>
                {listings.map((listing, index) => (
                  <div key={index} className='radio-container flex'>
                    <input
                      className='custom-radio visually-hidden custom-checkbox'
                      type='radio'
                      name='listing'
                      value={listing || ''}
                      id={`listing-${index}`}
                      checked={formData.listing === listing}
                      onChange={(e) => handleRadioChange(e, 'listing')}
                    />
                    <label
                      className='custom-label'
                      htmlFor={`listing-${index}`}
                    >
                      {listing}
                    </label>
                  </div>
                ))}
              </form>
            </>
          ) : null}

          <FacilitiesChecklist
            title='Facilities'
            presetFacilities={facilities}
            selectedFacilities={formData?.facilities}
            customFacilities={formData?.customFacilities}
            onCheckboxChange={handleCheckboxChange}
            setFormData={setFormData}
            disabled={fieldsLocked}
          />
        </div>

        <div className='grid place-items-center mt-[49px]'>
          <Image
            width={1500}
            quality={90}
            className='w-[98%]'
            height={700}
            src={adImage}
            alt='car'
          />
        </div>
        <ListingMapSection
          mapUrl={formData?.mapUrl}
          handleChange={handleChange}
          disabled={fieldsLocked}
        />
        <div className='grid place-items-center mt-[30px] pb-[65px]'>
          <button
            className={`text-whitee flex justify-center items-center text-xl font-medium w-[205px] h-[50px] rounded-[3px] bg-light-gold shadow-neons`}
            onClick={submitConfirmation}
            disabled={loading}
          >
            {loading ? (
              <IoReload size={24} className='animate-spin' />
            ) : id ? (
              'Update'
            ) : (
              'Submit'
            )}
          </button>
          {confirmationModal && (
            <ConfirmationModal
              show={confirmationModal}
              onSubmit={handleSubmit}
              title='Asset Verification'
              content={
                'Please note that all listings on our platform are subject to verification and evaluation. Your listing will remain pending until you obtain an evaluation certificate from one of the evaluators available in your country. Our platform displays only verified listings to potential buyers. Thank you for your understanding.'
              }
              onClose={() => setConfirmationModal(false)}
            />
          )}
        </div>
      </div>
    )
  }
)
Facilities.displayName = 'Facilities'

export default Facilities
