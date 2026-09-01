import React from 'react'
import FacilitiesChecklist from '@/components/property-listing/FacilitiesChecklist'
import ColorTwoToneField from '@/components/ListingFormInput/ColorTwoToneField'
import { shouldShowListingVisibility } from '@/libs/listingVisibilityThresholds'
import { isListingEvaluatorApprovedLocked } from '@/libs/listingEditLock'

const colorGridClassName =
  'mt-[10px] grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 xxs:grid-cols-2 justify-between gap-y-[10px]'

const ChecksLayoutComponent = ({
  carListings,
  colors,
  technicalFeatures,
  extras,
  handleRadioChange,
  handleCheckboxChange,
  formData,
  setFormData,
}) => {
  const fieldsLocked = isListingEvaluatorApprovedLocked(formData)
  return (
    <>
      <div className='px-[19px]'>
        {shouldShowListingVisibility('car', formData.price, formData.listing) ? (
          <>
            <h2 className='text-dark-black text-xl font-medium pt-5'>
              Listing
            </h2>
            <form className='mt-[10px] grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1  justify-between gap-y-[10px]'>
              {carListings.map((listing, index) => (
                <div key={index} className='radio-container flex'>
                  <input
                    className='custom-radio visually-hidden custom-checkbox'
                    type='radio'
                    name='listing'
                    value={listing}
                    id={`listing-${index}`}
                    checked={formData.listing === listing}
                    onChange={(e) => handleRadioChange(e, 'listing')}
                  />
                  <label className='custom-label' htmlFor={`listing-${index}`}>
                    {listing}
                  </label>
                </div>
              ))}
            </form>
            <br />
          </>
        ) : (
          <></>
        )}

        <FacilitiesChecklist
          title='Exterior Color'
          presetFacilities={colors}
          selectedFacilities={formData.exteriorColor || []}
          customFacilities={formData.customExteriorColors || []}
          onCheckboxChange={(e) => handleCheckboxChange(e, 'exteriorColor')}
          setFormData={(updater) => {
            if (typeof setFormData !== 'function') return
            setFormData((prev) => {
              const next =
                typeof updater === 'function'
                  ? updater({
                    facilities: prev.exteriorColor || [],
                    customFacilities: prev.customExteriorColors || [],
                  })
                  : updater
              return {
                ...prev,
                exteriorColor: next.facilities ?? prev.exteriorColor,
                customExteriorColors:
                  next.customFacilities ?? prev.customExteriorColors,
              }
            })
          }}
          gridClassName={colorGridClassName}
          disabled={fieldsLocked}
        />

        <ColorTwoToneField
          title='Exterior Two Tone'
          values={formData.exteriorTwoTone || []}
          onChange={(next) =>
            setFormData?.((prev) => ({
              ...prev,
              exteriorTwoTone: next,
            }))
          }
          placeholder='e.g. red/black'
          disabled={fieldsLocked}
        />

        <div className='pt-5'>
          <FacilitiesChecklist
            title='Interior Color'
            presetFacilities={colors}
            selectedFacilities={formData.interiorColor || []}
            customFacilities={formData.customInteriorColors || []}
            onCheckboxChange={(e) => handleCheckboxChange(e, 'interiorColor')}
            setFormData={(updater) => {
              if (typeof setFormData !== 'function') return
              setFormData((prev) => {
                const next =
                  typeof updater === 'function'
                    ? updater({
                      facilities: prev.interiorColor || [],
                      customFacilities: prev.customInteriorColors || [],
                    })
                    : updater
                return {
                  ...prev,
                  interiorColor: next.facilities ?? prev.interiorColor,
                  customInteriorColors:
                    next.customFacilities ?? prev.customInteriorColors,
                }
              })
            }}
            gridClassName={colorGridClassName}
            disabled={fieldsLocked}
          />
        </div>

        <ColorTwoToneField
          title='Interior Two Tone'
          values={formData.interiorTwoTone || []}
          onChange={(next) =>
            setFormData?.((prev) => ({
              ...prev,
              interiorTwoTone: next,
            }))
          }
          placeholder='e.g. red/black'
          disabled={fieldsLocked}
        />

        <h2 className='text-dark-black text-xl font-medium pt-5'>
          Technical Features
        </h2>
        <form className='mt-[10px] grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1  justify-between gap-y-[10px]'>
          {technicalFeatures.map((technicalFeature, index) => (
            <div key={index}>
              <input
                className='custom-checkbox'
                type='checkbox'
                value={technicalFeature}
                checked={(formData.technicalFeatures || []).includes(
                  technicalFeature,
                )}
                onChange={(e) => handleCheckboxChange(e, 'technicalFeatures')}
                disabled={fieldsLocked}
              />
              <label className='custom-label'>{technicalFeature}</label>
            </div>
          ))}
        </form>

        <FacilitiesChecklist
          title='Extras'
          presetFacilities={extras}
          selectedFacilities={formData.extras || []}
          customFacilities={formData.customExtras || []}
          onCheckboxChange={(e) => handleCheckboxChange(e, 'extras')}
          setFormData={(updater) => {
            if (typeof setFormData !== 'function') return
            setFormData((prev) => {
              const next =
                typeof updater === 'function'
                  ? updater({
                    facilities: prev.extras || [],
                    customFacilities: prev.customExtras || [],
                  })
                  : updater
              return {
                ...prev,
                extras: next.facilities ?? prev.extras,
                customExtras: next.customFacilities ?? prev.customExtras,
              }
            })
          }}
          gridClassName='grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1'
          disabled={fieldsLocked}
        />
      </div>
    </>
  )
}

export default ChecksLayoutComponent
