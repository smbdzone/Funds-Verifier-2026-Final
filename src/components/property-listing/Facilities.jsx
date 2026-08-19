'use client'

import Image from 'next/image'
import React, { useContext } from 'react'
import ConfirmationModal from '@/components/AddListing/ConfirmationModal'
import ListingMapSection from '@/components/ListingsForm/ListingMapSection'
import FacilitiesChecklist from '@/components/property-listing/FacilitiesChecklist'
import { IoReload } from 'react-icons/io5'
import { isListingEvaluatorApprovedLocked } from '@/libs/listingEditLock'
import { ListingContext } from '@/components/ListingContext/ListingsProvider'

const Facilities = React.memo(
  ({
    formData,
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
    const { isCompressing } = useContext(ListingContext) || {}
    const fieldsLocked = isListingEvaluatorApprovedLocked(formData)
    const busy = Boolean(loading || isCompressing)

    return (
      <div className='pt-[30px]'>
        <div className='px-[19px] space-y-3'>
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
            disabled={busy}
          >
            {busy ? (
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
  },
)
Facilities.displayName = 'Facilities'

export default Facilities
