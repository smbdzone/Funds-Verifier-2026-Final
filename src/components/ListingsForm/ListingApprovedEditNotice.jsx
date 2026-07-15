import { isListingEvaluatorApprovedLocked, isListingPriceLocked } from '@/libs/listingEditLock'

/** Shown when evaluator approved the listing — most fields are read-only. */
export default function ListingApprovedEditNotice({ formData }) {
  if (!isListingEvaluatorApprovedLocked(formData) && !isListingPriceLocked(formData)) {
    return null
  }

  const priceLocked = isListingPriceLocked(formData)
  const approvedLocked = isListingEvaluatorApprovedLocked(formData)

  return (
    <p className='mb-6 rounded-md border border-[#8d7c3b]/40 bg-[#8d7c3b]/10 px-4 py-3 text-sm text-dark-grey'>
      {priceLocked ? (
        <>
          A buyer is in talks for this asset. Price editing is disabled until the
          trustee marks it as open again.
          {approvedLocked ? (
            <>
              {' '}
              You can still change Public/Private, request a 3D walkthrough, or
              request a technical report. Other fields remain locked after
              evaluator approval.
            </>
          ) : null}
        </>
      ) : (
        <>
          This listing is approved with an evaluation certificate. You can update
          the price, Public/Private listing, request a 3D walkthrough, or request
          a technical report. Other fields are locked.
        </>
      )}
    </p>
  )
}
