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

const APPROVED_ASSET_HOLDER_UPDATE_KEYS = [
  'price',
  'priceFrom',
  'priceTo',
  'listing',
  'video3DWalkthrough',
  'technicalReport',
  'uploadDocument',
  'fulfillRequestDocument',
  'customerId',
  'paymentMethod',
  'payment_provider',
  'clozer_transaction_id',
  'evaluationDateTime',
  'evaluatorUUID',
]

/**
 * After evaluator approval, strip locked fields so asset-holder saves cannot
 * overwrite evaluator-finalized listing details (property/car/boat/jewelry).
 */
export function buildApprovedAssetHolderUpdatePayload(listingPayload = {}) {
  if (!listingPayload || typeof listingPayload !== 'object') return {}
  const out = {}
  for (const key of APPROVED_ASSET_HOLDER_UPDATE_KEYS) {
    if (listingPayload[key] !== undefined) {
      out[key] = listingPayload[key]
    }
  }
  return out
}
