'use client'

import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  MAX_OFF_PLAN_PAYMENT_STEPS,
  MIN_OFF_PLAN_PAYMENT_STEPS,
  createDefaultOffPlanPaymentPlan,
  reindexOffPlanPaymentPlan,
} from '@/constants/listing-data'
import { autoCapitalizeTitle } from '@/libs/autoCapitalizeText'

const PaymentPlanStepCard = ({
  step,
  stepLabel,
  paymentLabel,
  sharePercent,
  milestone,
  disabled,
  canRemove,
  onShareChange,
  onMilestoneChange,
  onRemove,
  shareError,
  milestoneError,
}) => {
  return (
    <div className='flex w-full min-w-0 flex-col gap-1'>
      <div className='flex items-center justify-between gap-1 px-0.5'>
        <span className='truncate text-[11px] leading-[14px] text-black xl:text-[12px] xl:leading-[15px]'>
          {stepLabel}
        </span>
        <button
          type='button'
          disabled={disabled || !canRemove}
          onClick={onRemove}
          className='flex h-5 w-5 shrink-0 items-center justify-center text-[#8D7C3B] disabled:cursor-not-allowed disabled:opacity-30'
          aria-label={`Remove step ${step}`}
        >
          <Trash2 className='h-4 w-4' />
        </button>
      </div>

      <div className='flex h-[118px] flex-col items-center justify-center bg-white px-2 py-3 shadow-neons xl:h-[128px]'>
        <div className='flex w-full flex-col items-center gap-2'>
          <span className='line-clamp-2 text-center text-[12px] font-normal leading-[16px] text-black xl:text-[14px] xl:leading-[18px]'>
            {String(milestone || '').trim() || paymentLabel}
          </span>
          <div className='flex w-full max-w-[72px] flex-col items-center gap-1.5 xl:max-w-[80px]'>
            <div className='flex w-full items-center justify-center gap-0.5'>
              <input
                type='text'
                inputMode='numeric'
                disabled={disabled}
                value={sharePercent}
                onChange={onShareChange}
                placeholder='e.g: 20'
                className='min-w-0 flex-1 border-0 bg-transparent text-right text-[13px] leading-5 text-dark-grey outline-none placeholder:text-dark-grey/60 disabled:opacity-60 xl:text-[14px]'
              />
              <span
                className={`shrink-0 text-[13px] leading-5 xl:text-[14px] ${sharePercent !== '' && sharePercent != null
                    ? 'text-dark-grey'
                    : 'text-dark-grey/60'
                  }`}
              >
                %
              </span>
            </div>
            <div className='h-px w-full border-b border-dark-grey/40' />
          </div>
        </div>
        {shareError ? (
          <span className='mt-1 text-center text-[9px] text-red-500'>
            {shareError}
          </span>
        ) : null}
      </div>

      <div className='flex h-[42px] items-center justify-center bg-white px-2 py-2 shadow-[inset_0px_0px_4px_rgba(0,0,0,0.05)] xl:h-[46px] xl:px-3'>
        <input
          type='text'
          disabled={disabled}
          value={milestone}
          onChange={onMilestoneChange}
          placeholder='Enter payment title'
          className='w-full min-w-0 border-0 bg-transparent text-center text-[11px] leading-[14px] text-dark-grey outline-none placeholder:text-dark-grey/60 disabled:opacity-60 xl:text-[13px] xl:leading-[16px]'
        />
      </div>
      {milestoneError ? (
        <span className='text-center text-[9px] text-red-500'>
          {milestoneError}
        </span>
      ) : null}
    </div>
  )
}

const OffPlanPaymentPlan = ({
  paymentPlan,
  disabled,
  errors,
  onStepChange,
  onStepRemove,
  onStepAdd,
}) => {
  const rawSteps =
    Array.isArray(paymentPlan) && paymentPlan.length > 0
      ? paymentPlan
      : createDefaultOffPlanPaymentPlan()

  const steps = reindexOffPlanPaymentPlan(rawSteps)
  const canAdd = steps.length < MAX_OFF_PLAN_PAYMENT_STEPS
  const canRemove = steps.length > MIN_OFF_PLAN_PAYMENT_STEPS

  return (
    <section className='col-span-2 mt-10 w-full border border-light-gold/50 bg-white px-4 py-8 sm:px-8 sm:py-10'>
      <h3 className='mb-6 w-full text-center text-[15px] font-normal leading-[18px] text-black'>
        Enter the Payment Plan
      </h3>
      {errors?.paymentPlan ? (
        <span className='mb-4 block text-center text-xs font-medium text-red-500'>
          **{errors.paymentPlan}
        </span>
      ) : null}
      <div className='grid w-full grid-cols-2 items-start gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-4'>
        {steps.map((step, index) => (
          <PaymentPlanStepCard
            key={`payment-step-${index}`}
            step={step.step || index + 1}
            stepLabel={step.stepLabel}
            paymentLabel={step.paymentLabel}
            sharePercent={step.sharePercent || ''}
            milestone={step.milestone || ''}
            disabled={disabled}
            canRemove={canRemove}
            onShareChange={(event) => {
              const raw = event.target.value.replace(/[^\d]/g, '')
              if (raw === '' || (Number(raw) >= 0 && Number(raw) <= 100)) {
                onStepChange(index, 'sharePercent', raw)
              }
            }}
            onMilestoneChange={(event) =>
              onStepChange(
                index,
                'milestone',
                autoCapitalizeTitle(event.target.value),
              )
            }
            onRemove={() => onStepRemove(index)}
            shareError={errors?.[`paymentPlanShare_${index}`]}
            milestoneError={errors?.[`paymentPlanMilestone_${index}`]}
          />
        ))}
        {canAdd ? (
          <button
            type='button'
            disabled={disabled}
            onClick={onStepAdd}
            aria-label='Add payment step'
            className='flex min-h-[178px] w-full flex-col items-center justify-center gap-2 border border-dashed border-light-gold/60 bg-white text-light-gold shadow-neons transition-colors hover:bg-offwhite disabled:cursor-not-allowed disabled:opacity-50 xl:min-h-[188px]'
          >
            <Plus className='h-7 w-7' strokeWidth={1.75} />
            <span className='text-[11px] font-normal text-dark-grey xl:text-[12px]'>
              Add Step
            </span>
          </button>
        ) : null}
      </div>
    </section>
  )
}

export default OffPlanPaymentPlan
