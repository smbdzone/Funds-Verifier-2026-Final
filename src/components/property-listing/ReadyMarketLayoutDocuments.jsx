'use client'

import React from 'react'
import OffPlanImageUploadBox from '@/components/property-listing/OffPlanImageUploadBox'
import { OFF_PLAN_LAYOUT_IMAGE_FORMATS_LABEL } from '@/constants/listing-data'

/**
 * Ready-market property docs section: Title Deed, Unit Layout, Floor Plan.
 * Placed before amenities on the property listing page.
 */
const ReadyMarketLayoutDocuments = ({
  media = {},
  onImageChange,
  onImageRemove,
  errors = {},
  disabled = false,
}) => {
  return (
    <section className='mt-10 w-full border border-light-gold/50 bg-white px-4 py-8 sm:px-8 sm:py-10'>
      <h3 className='mb-6 text-center text-[15px] font-normal leading-[18px] text-black'>
        Title Deed, Unit Layout &amp; Floor Plan
      </h3>

      <div className='flex w-full flex-col gap-5'>
        <OffPlanImageUploadBox
          formats={OFF_PLAN_LAYOUT_IMAGE_FORMATS_LABEL}
          inputId='ready-market-title-deed'
          label='Upload Title Deed'
          image={media?.titleDeed}
          onChange={onImageChange?.('titleDeed')}
          onRemove={() => onImageRemove?.('titleDeed')}
          disabled={disabled}
          errors={errors.titleDeed}
          errorMessage={errors.titleDeed}
        />

        <div className='md:grid md:grid-cols-2 md:gap-[138px] gap-5'>
          <OffPlanImageUploadBox
            formats={OFF_PLAN_LAYOUT_IMAGE_FORMATS_LABEL}
            inputId='ready-market-unit-layout'
            label='Upload Unit Layout'
            image={media?.unitLayout}
            onChange={onImageChange?.('unitLayout')}
            onRemove={() => onImageRemove?.('unitLayout')}
            disabled={disabled}
            errors={errors.unitLayout}
            errorMessage={errors.unitLayout}
          />
          <OffPlanImageUploadBox
            formats={OFF_PLAN_LAYOUT_IMAGE_FORMATS_LABEL}
            inputId='ready-market-floor-plan'
            label='Upload Floor Plan'
            image={media?.floorPlan}
            onChange={onImageChange?.('floorPlan')}
            onRemove={() => onImageRemove?.('floorPlan')}
            disabled={disabled}
            errors={errors.floorPlan}
            errorMessage={errors.floorPlan}
          />
        </div>
      </div>
    </section>
  )
}

export default ReadyMarketLayoutDocuments
