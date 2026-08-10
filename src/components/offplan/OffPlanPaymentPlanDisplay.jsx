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
    <div className='px-3 py-4 sm:px-6 sm:py-5 lg:px-[156px] lg:py-6'>
      <div className='mx-auto flex w-full max-w-[1198px] flex-wrap justify-center gap-x-3 gap-y-5 sm:gap-x-5 sm:gap-y-6 lg:gap-y-8'>
        {steps.map((step) => {
          const iconKey = inferIconKey(step)
          const Icon = ICON_MAP[iconKey]
          const milestone = String(step.milestone || '').trim()
          const paymentLabel = String(step.paymentLabel || '').trim()
          // Ignore 1-char leftovers (e.g. "F") from bad dueLabel mapping
          const displayLabel =
            milestone.length > 1
              ? milestone
              : paymentLabel || milestone || 'Payment Share'

          return (
            <div
              key={`${step.step}-${displayLabel}-${step.sharePercent}`}
              className='flex w-[calc(50%-6px)] max-w-[130px] flex-col items-center gap-2 sm:w-[calc(50%-10px)] sm:max-w-[150px] sm:gap-2.5 md:w-[calc(25%-12px)] md:max-w-[160px] lg:w-[calc(20%-16px)] lg:max-w-[180px] lg:gap-3'
            >
              <div
                className='flex h-9 w-9 flex-none items-center justify-center rounded-full sm:h-11 sm:w-11 lg:h-14 lg:w-14'
                style={{ background: GOLDEN_GRADIENT }}
              >
                <Icon
                  className='h-4 w-4 text-white sm:h-5 sm:w-5 lg:h-6 lg:w-6'
                  strokeWidth={1.75}
                />
              </div>

              <div className='flex w-full flex-col items-center gap-0.5'>
                <span
                  className='text-center text-base font-semibold leading-tight sm:text-xl sm:leading-6 lg:text-2xl lg:leading-[29px]'
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
                <span className='whitespace-normal break-words text-center text-[11px] font-medium leading-4 text-prussianBlue sm:text-sm sm:leading-5 lg:text-base'>
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
