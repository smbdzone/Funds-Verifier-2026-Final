'use client'

import React from 'react'
import TextInput from '@/components/AddListing/TextInput'
import DropdownInput from '@/components/AddListing/DropdownInput'
import OffPlanPriceRange from '@/components/property-listing/OffPlanPriceRange'
import OffPlanSizeRange from '@/components/property-listing/OffPlanSizeRange'
import DeliveryTimeField from '@/components/property-listing/DeliveryTimeField'
import OffPlanLayoutFloorPlan from '@/components/property-listing/OffPlanLayoutFloorPlan'
import OffPlanPaymentPlan from '@/components/property-listing/OffPlanPaymentPlan'
import OffPlanAgencyAgreementUpload from '@/components/property-listing/OffPlanAgencyAgreementUpload'
import OffPlanPaymentPlanTypeField from '@/components/property-listing/OffPlanPaymentPlanTypeField'
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
  agencyAgreementFile,
  onAgencyAgreementChange,
  onAgencyAgreementRemove,
}) => {
  const dropdowns = {
    layout: dropdownOpen === 'layout',
    numberOfFloors: dropdownOpen === 'numberOfFloors',
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
        name='projectName'
        placeholder='Project Name'
        value={formData.projectName || ''}
        onChange={(e) => onInputChange('projectName', e.target.value)}
        required
        errors={errors}
      />

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

      <OffPlanSizeRange
        label='Property size'
        sizeSQFTFrom={formData.sizeSQFTFrom || formData.sizeSQFT}
        sizeSQFTTo={formData.sizeSQFTTo}
        sizeSQMFrom={formData.sizeSQMFrom || formData.sizeSQM}
        sizeSQMTo={formData.sizeSQMTo}
        sizeUnit={formData.sizeUnit || formData.sizeType || 'SQFT'}
        errors={errors.sizeSQFT}
        errorsMessage={errors.sizeSQFT}
        onSizeChange={({
          sizeSQFTFrom,
          sizeSQFTTo,
          sizeSQMFrom,
          sizeSQMTo,
          sizeUnit,
          sizeType,
          sizeSQFT,
          sizeSQM,
        }) => {
          if (sizeSQFTFrom !== undefined) onInputChange('sizeSQFTFrom', sizeSQFTFrom)
          if (sizeSQFTTo !== undefined) onInputChange('sizeSQFTTo', sizeSQFTTo)
          if (sizeSQMFrom !== undefined) onInputChange('sizeSQMFrom', sizeSQMFrom)
          if (sizeSQMTo !== undefined) onInputChange('sizeSQMTo', sizeSQMTo)
          if (sizeUnit !== undefined) onInputChange('sizeUnit', sizeUnit)
          if (sizeType !== undefined) onInputChange('sizeType', sizeType)
          if (sizeSQFT !== undefined) onInputChange('sizeSQFT', sizeSQFT)
          else if (sizeSQFTFrom !== undefined) onInputChange('sizeSQFT', sizeSQFTFrom)
          if (sizeSQM !== undefined) onInputChange('sizeSQM', sizeSQM)
          else if (sizeSQMFrom !== undefined) onInputChange('sizeSQM', sizeSQMFrom)
        }}
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

      <div className='col-span-2 sm:col-span-1'>
        <OffPlanPaymentPlanTypeField
          value={formData.paymentPlanType || ''}
          errors={Boolean(errors?.paymentPlanType)}
          errorMessage={errors?.paymentPlanType}
          onChange={(next) => onInputChange('paymentPlanType', next)}
          required={false}
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

      <div className='col-span-2'>
        <OffPlanAgencyAgreementUpload
          file={agencyAgreementFile}
          existingDoc={agencyAgreementFile ? null : formData?.agencyAgreement}
          onChange={onAgencyAgreementChange}
          onRemove={onAgencyAgreementRemove}
        />
      </div>
    </>
  )
}

export default AddAssetOffPlanFields
