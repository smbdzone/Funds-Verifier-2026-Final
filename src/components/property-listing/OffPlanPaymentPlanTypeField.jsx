'use client'

import ListingFormInput from '@/components/ListingFormInput/ListingFormInput'
import { formatPaymentPlanRatioInput } from '@/constants/listing-data'

/**
 * Payment plan ratio input — auto formats as 20/80 while typing.
 */
const OffPlanPaymentPlanTypeField = ({
  value = '',
  errors = false,
  errorMessage = '',
  onChange,
  onSelect,
  onCustomChange,
  disabled = false,
  readOnly = false,
  required = false,
}) => {
  const emit = (next) => {
    onChange?.(next)
    onSelect?.(next)
    onCustomChange?.(next)
  }

  const handleChange = (e) => {
    if (readOnly || disabled) return
    emit(formatPaymentPlanRatioInput(e.target.value))
  }

  return (
    <ListingFormInput
      name='paymentPlanType'
      value={value || ''}
      handleChange={handleChange}
      placeholder='Enter the Payment Plan'
      fieldLabel='Payment Plan'
      errors={errors}
      errorsMessage={errorMessage}
      required={required}
      type='text'
      maxLength={7}
      disabled={disabled || readOnly}
    />
  )
}

export default OffPlanPaymentPlanTypeField
