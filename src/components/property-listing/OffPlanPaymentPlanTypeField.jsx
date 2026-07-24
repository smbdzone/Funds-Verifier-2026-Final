'use client'

import ListingFormInput from '@/components/ListingFormInput/ListingFormInput'
import ListingsDropdownInputComponents from '@/components/ListingsImageComponent/ListingsDropdownInputComponents'
import {
  PAYMENT_PLAN_TYPE_OTHER,
  getPaymentPlanTypeCustomValue,
  getPaymentPlanTypeDropdownValue,
  isPaymentPlanTypeOtherMode,
  paymentPlanTypeOptions,
} from '@/constants/listing-data'

/**
 * Payment Plan dropdown with an "Others" option that reveals a free-text field.
 */
const OffPlanPaymentPlanTypeField = ({
  value = '',
  errors = false,
  errorMessage = '',
  dropdown = false,
  onToggleDropdown,
  onSelect,
  onCustomChange,
  disabled = false,
  readOnly = false,
  required = false,
}) => {
  const dropdownValue = getPaymentPlanTypeDropdownValue(value)
  const showCustomInput = isPaymentPlanTypeOtherMode(value)
  const customValue = getPaymentPlanTypeCustomValue(value)

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='relative w-full dropdown-container'>
        <ListingsDropdownInputComponents
          errors={errors}
          errorMessage={errorMessage}
          value={dropdownValue}
          placeholder='Payment Plan'
          name='paymentPlanType'
          handleToggleDropdown={onToggleDropdown}
          dropdown={dropdown}
          dropdownType='paymentPlanType'
          dropdownOptions={paymentPlanTypeOptions}
          handleSelectOption={(_, option) => onSelect?.(option)}
          readOnly={readOnly}
          disabled={disabled}
          required={required}
        />
      </div>

      {showCustomInput ? (
        <ListingFormInput
          name='paymentPlanTypeCustom'
          value={customValue}
          handleChange={(e) => onCustomChange?.(e.target.value)}
          placeholder='Enter payment plan (e.g. 30/70)'
          fieldLabel='Custom Payment Plan'
          required={false}
          type='text'
          maxLength={40}
          disabled={disabled}
        />
      ) : null}
    </div>
  )
}

export { PAYMENT_PLAN_TYPE_OTHER }
export default OffPlanPaymentPlanTypeField
