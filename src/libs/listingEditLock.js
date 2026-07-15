import {
  canRequestPremiumServices as canRequestPremiumServicesFromStatus,
  isListingEvaluatorApproved,
} from './listingPremiumStatus'

/**
 * Asset-holder edit lock: after evaluator approval (status 1) and an
 * evaluation certificate exists, only price, Public/Private listing, and
 * optional service requests stay editable.
 *
 * While status is pending (no certificate yet), the full listing stays editable
 * on the dashboard edit form — evaluation payment alone does not lock fields.
 */
export function isListingEvaluatorApprovedLocked(formData) {
  return isListingEvaluatorApproved(formData)
}

/** Seller cannot edit listing price while trustee marked buyer-in-talks. */
export function isListingPriceLocked(formData) {
  return Boolean(formData?.underProcess)
}

/** 3D walkthrough / technical report — only after evaluator approval (Simo spec). */
export function canRequestPremiumServices(formData) {
  return canRequestPremiumServicesFromStatus(formData)
}
