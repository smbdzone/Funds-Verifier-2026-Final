'use client'

import React from 'react'
import ListingsDropdownInputComponents from '@/components/ListingsImageComponent/ListingsDropdownInputComponents'
import OffPlanImageUploadBox from '@/components/property-listing/OffPlanImageUploadBox'
import {
  OFF_PLAN_LAYOUT_IMAGE_FORMATS_LABEL,
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
      </div>
    </section>
  )
}

export default OffPlanLayoutFloorPlan
