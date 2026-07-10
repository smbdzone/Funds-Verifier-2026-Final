'use client'

import React from 'react'
import TextInput from '@/components/AddListing/TextInput'
import DropdownInput from '@/components/AddListing/DropdownInput'
import OffPlanPriceRange from '@/components/property-listing/OffPlanPriceRange'
import DeliveryTimeField from '@/components/property-listing/DeliveryTimeField'
import OffPlanLayoutFloorPlan from '@/components/property-listing/OffPlanLayoutFloorPlan'
import OffPlanPaymentPlan from '@/components/property-listing/OffPlanPaymentPlan'
import {
  bathroomsOptions,
  bedroomsOptions,
  deliveryQuarterOptions,
  deliveryYearOptions,
} from '@/constants/listing-data'

const AddAssetOffPlanFields = ({
  formData,
  errors,
  dropdownOpen,
  onDropdownOpen,
  onInputChange,
  onSelectOption,
  totalPriceFrom,
  totalPriceTo,
  offPlanMedia,
  onOffPlanImageChange,
  onOffPlanImageRemove,
  onPaymentPlanStepChange,
  onPaymentPlanStepRemove,
  onPaymentPlanStepAdd,
}) => {
  const dropdowns = {
    layout: dropdownOpen === 'layout',
    numberOfFloors: dropdownOpen === 'numberOfFloors',
    availableApartment: dropdownOpen === 'availableApartment',
    deliveryQuarter: dropdownOpen === 'deliveryQuarter',
    deliveryYear: dropdownOpen === 'deliveryYear',
  }

  const handleToggleDropdown = (name) => {
    onDropdownOpen(name)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    onInputChange(name, value)
  }

  return (
    <>
      <div className='col-span-2'>
        <OffPlanPriceRange
          priceFrom={totalPriceFrom}
          priceTo={totalPriceTo}
          handleChange={handleChange}
          errors={errors.price}
          errorsMessage={errors.price}
        />
      </div>

      <TextInput
        type='text'
        name='developer'
        placeholder='Developer'
        value={formData.developer || ''}
        onChange={(e) => onInputChange('developer', e.target.value)}
        required
        errors={errors}
      />

      <DropdownInput
        name='bedrooms'
        placeholder='Bedrooms'
        value={formData.bedrooms || ''}
        options={bedroomsOptions}
        onSelect={(value) => onSelectOption('bedrooms', value)}
        dropdownOpen={dropdownOpen}
        onDropdownOpen={onDropdownOpen}
        required
        errors={errors}
      />

      <DropdownInput
        name='bathrooms'
        placeholder='Bathrooms'
        value={formData.bathrooms || ''}
        options={bathroomsOptions}
        onSelect={(value) => onSelectOption('bathrooms', value)}
        dropdownOpen={dropdownOpen}
        onDropdownOpen={onDropdownOpen}
        required
        errors={errors}
      />

      <TextInput
        type='number'
        name='sizeSQFT'
        placeholder='Size in SQFT'
        value={formData.sizeSQFT || ''}
        onChange={(e) => onInputChange('sizeSQFT', e.target.value)}
        unit='SQFT'
        required
        errors={errors}
      />

      <div className='col-span-2'>
        <DeliveryTimeField
          deliveryQuarter={formData.deliveryQuarter}
          deliveryYear={formData.deliveryYear}
          quarterDropdownOpen={dropdowns.deliveryQuarter}
          yearDropdownOpen={dropdowns.deliveryYear}
          quarterOptions={deliveryQuarterOptions}
          yearOptions={deliveryYearOptions}
          onToggleQuarter={() => handleToggleDropdown('deliveryQuarter')}
          onToggleYear={() => handleToggleDropdown('deliveryYear')}
          onSelectQuarter={(option) => onSelectOption('deliveryQuarter', option)}
          onSelectYear={(option) => onSelectOption('deliveryYear', option)}
          errors={errors.deliveryTime}
          errorsMessage={errors.deliveryTime}
        />
      </div>

      <div className='col-span-2'>
        <TextInput
          type='textarea'
          name='additionalDescription'
          className='!col-span-2'
          placeholder='Additional properties (optional, max. 1000 characters)'
          value={formData.additionalDescription || ''}
          onChange={(e) => onInputChange('additionalDescription', e.target.value)}
          maxLength={1000}
          required={false}
          errors={errors}
        />
      </div>

      <div className='col-span-2'>
        <OffPlanLayoutFloorPlan
          formData={formData}
          errors={errors}
          dropdowns={dropdowns}
          handleToggleDropdown={handleToggleDropdown}
          handleSelectOption={(dropdownName, option) =>
            onSelectOption(dropdownName, option)
          }
          offPlanMedia={offPlanMedia}
          onOffPlanImageChange={onOffPlanImageChange}
          onOffPlanImageRemove={onOffPlanImageRemove}
        />
      </div>

      <div className='col-span-2'>
        <OffPlanPaymentPlan
          paymentPlan={formData.paymentPlan}
          errors={errors}
          onStepChange={onPaymentPlanStepChange}
          onStepRemove={onPaymentPlanStepRemove}
          onStepAdd={onPaymentPlanStepAdd}
        />
      </div>
    </>
  )
}

export default AddAssetOffPlanFields
