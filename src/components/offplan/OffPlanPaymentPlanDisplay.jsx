'use client'

import React, { useMemo } from 'react'
import { Bookmark, FileText, Key, Medal, Wallet } from 'lucide-react'
import { sanitizeOffPlanPaymentPlan } from '@/constants/listing-data'

const GOLDEN_GRADIENT =
  'linear-gradient(90deg, #A2913E 0%, #D7C590 35.28%, #A2913E 68.99%, #D7C58F 100%)'

const ICON_MAP = {
  booking: Bookmark,
  'sales-agreement': FileText,
  'title-deed': Medal,
  handover: Key,
  'final-payment': Wallet,
}

const inferIconKey = (step) => {
  if (step.icon && ICON_MAP[step.icon]) return step.icon

  const label = String(step.paymentLabel || step.milestone || '').toLowerCase()
  if (label.includes('booking') || label.includes('down payment')) return 'booking'
  if (label.includes('sales') || label.includes('agreement')) return 'sales-agreement'
  if (label.includes('title') || label.includes('dld')) return 'title-deed'
  if (label.includes('handover')) return 'handover'
  if (label.includes('final') || label.includes('installment')) return 'final-payment'

  return 'booking'
}

const OffPlanPaymentPlanDisplay = ({ paymentPlan = [] }) => {
  const steps = useMemo(
    () => sanitizeOffPlanPaymentPlan(paymentPlan),
    [paymentPlan],
  )

  if (!steps.length) {
    return (
      <p className='px-4 py-6 text-sm text-black/60'>
        No payment plan available for this property.
      </p>
    )
  }

  return (
    <div className='px-4 py-6 sm:px-8 lg:px-[156px]'>
      <div className='mx-auto flex w-full max-w-[1198px] flex-wrap justify-center gap-x-5 gap-y-8'>
        {steps.map((step) => {
          const iconKey = inferIconKey(step)
          const Icon = ICON_MAP[iconKey]
          const milestone = String(step.milestone || '').trim()
          const displayLabel = milestone || step.paymentLabel || 'Payment Share'

          return (
            <div
              key={`${step.step}-${displayLabel}-${step.sharePercent}`}
              className='flex w-[calc(50%-10px)] max-w-[180px] flex-col items-center gap-3 sm:w-[calc(33.333%-14px)] md:w-[calc(20%-16px)]'
            >
              <div
                className='flex h-14 w-14 flex-none items-center justify-center rounded-full'
                style={{ background: GOLDEN_GRADIENT }}
              >
                <Icon className='text-white' size={24} strokeWidth={1.75} />
              </div>

              <div className='flex w-full flex-col items-center gap-0.5'>
                <span
                  className='text-center text-2xl font-semibold leading-[29px]'
                  style={{
                    background: GOLDEN_GRADIENT,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {String(step.sharePercent ?? '')
                    .replace(/%\s*$/, '')
                    .trim() || '0'}
                  %
                </span>
                <span className='whitespace-normal break-words text-center text-base font-medium leading-5 text-prussianBlue'>
                  {displayLabel}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OffPlanPaymentPlanDisplay
