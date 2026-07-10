'use client'

import React from 'react'
import ListingsDropdownInputComponents from '@/components/ListingsImageComponent/ListingsDropdownInputComponents'
import OffPlanImageUploadBox from '@/components/property-listing/OffPlanImageUploadBox'
import OffPlanSingleImageUpload from '@/components/property-listing/OffPlanSingleImageUpload'
import {
  OFF_PLAN_LAYOUT_IMAGE_FORMATS_LABEL,
  apartmentLayoutUploads,
  availableApartmentOptions,
  layoutOptions,
  numberOfFloorsOptions,
} from '@/constants/listing-data'

const OffPlanLayoutFloorPlan = ({
  formData,
  errors,
  dropdowns,
  handleToggleDropdown,
  handleSelectOption,
  disabled,
  offPlanMedia,
  onOffPlanImageChange,
  onOffPlanImageRemove,
}) => {
  const showApartmentLayouts = Boolean(formData?.availableApartment)

  return (
    <section className='col-span-2 mt-10 w-full border border-light-gold/50 bg-white px-4 py-8 sm:px-8 sm:py-10'>
      <h3 className='mb-6 text-center text-[15px] font-normal leading-[18px] text-black'>
        Layout &amp; Floor Plan
      </h3>

      <div className='flex w-full flex-col gap-5'>
        <div className='md:grid md:grid-cols-2 md:gap-[138px] gap-5'>
          <div className='relative w-full dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.layout && !formData.layout}
              errorMessage={errors.layout}
              value={formData.layout || ''}
              placeholder='Layout'
              name='layout'
              handleToggleDropdown={() => handleToggleDropdown('layout')}
              dropdown={dropdowns.layout}
              dropdownType='layout'
              dropdownOptions={layoutOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('layout', option)
              }
              readOnly={disabled}
              disabled={disabled}
            />
          </div>
          <div className='relative w-full dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.numberOfFloors && !formData.numberOfFloors}
              errorMessage={errors.numberOfFloors}
              value={formData.numberOfFloors || ''}
              placeholder='No: of Floor'
              name='numberOfFloors'
              handleToggleDropdown={() => handleToggleDropdown('numberOfFloors')}
              dropdown={dropdowns.numberOfFloors}
              dropdownType='numberOfFloors'
              dropdownOptions={numberOfFloorsOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('numberOfFloors', option)
              }
              readOnly={disabled}
              disabled={disabled}
            />
          </div>
        </div>

        <div className='md:grid md:grid-cols-2 md:gap-[138px] gap-5'>
          <div className='relative w-full dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.availableApartment && !formData.availableApartment}
              errorMessage={errors.availableApartment}
              value={formData.availableApartment || ''}
              placeholder='Select Available Apartment'
              name='availableApartment'
              handleToggleDropdown={() =>
                handleToggleDropdown('availableApartment')
              }
              dropdown={dropdowns.availableApartment}
              dropdownType='availableApartment'
              dropdownOptions={availableApartmentOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('availableApartment', option)
              }
              readOnly={disabled}
              disabled={disabled}
            />
          </div>
        </div>

        <div className='md:grid md:grid-cols-2 md:gap-[138px] gap-5'>
          <OffPlanImageUploadBox
            formats={OFF_PLAN_LAYOUT_IMAGE_FORMATS_LABEL}
            inputId='offplan-unit-layout'
            label='Upload Unit Layout'
            image={offPlanMedia?.unitLayout}
            onChange={onOffPlanImageChange('unitLayout')}
            onRemove={() => onOffPlanImageRemove('unitLayout')}
            disabled={disabled}
            errors={errors.unitLayout}
            errorMessage={errors.unitLayout}
          />
          <OffPlanImageUploadBox
            formats={OFF_PLAN_LAYOUT_IMAGE_FORMATS_LABEL}
            inputId='offplan-floor-plan'
            label='Upload Floor Plan'
            image={offPlanMedia?.floorPlan}
            onChange={onOffPlanImageChange('floorPlan')}
            onRemove={() => onOffPlanImageRemove('floorPlan')}
            disabled={disabled}
            errors={errors.floorPlan}
            errorMessage={errors.floorPlan}
          />
        </div>

        {showApartmentLayouts ? (
          <div className='flex flex-col items-center gap-4'>
            <div className='text-center'>
              <h3 className='text-[15px] font-normal leading-[18px] text-black'>
                Available Apartment Layout
              </h3>
              <p className='mt-2 text-[10px] leading-[136%] text-dark-grey'>
                {OFF_PLAN_LAYOUT_IMAGE_FORMATS_LABEL}
              </p>
            </div>
            <div className='grid w-full grid-cols-2 gap-[18px] sm:grid-cols-3 lg:grid-cols-6 lg:justify-between'>
              {apartmentLayoutUploads.map(({ key, label }) => (
                <div
                  key={key}
                  className='relative flex aspect-square w-full max-w-[150px] flex-col items-center justify-center bg-white p-3 shadow-neons'
                >
                  <OffPlanSingleImageUpload
                    inputId={`offplan-${key}`}
                    label={label}
                    image={offPlanMedia?.[key]}
                    onChange={onOffPlanImageChange(key)}
                    onRemove={() => onOffPlanImageRemove(key)}
                    disabled={disabled}
                    compact
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default OffPlanLayoutFloorPlan
