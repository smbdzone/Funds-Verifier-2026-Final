import { isListingEvaluatorApprovedLocked } from '@/libs/listingEditLock'

/** Shown when evaluator approved the listing — most fields are read-only. */
export default function ListingApprovedEditNotice({ formData }) {
  if (!isListingEvaluatorApprovedLocked(formData)) return null

  return (
    <p className='mb-6 rounded-md border border-[#8d7c3b]/40 bg-[#8d7c3b]/10 px-4 py-3 text-sm text-dark-grey'>
      This listing is approved with an evaluation certificate. You can update the
      price, request a 3D walkthrough, or request a technical report. Other
      fields are locked.
    </p>
  )
}
