import customAxios from './apis/apis'
import { getListingDocumentSrc } from '@/libs/listingCardMedia'
import { isOffPlanListing } from '@/libs/filterMyListingTab'
import { fetchAllDashboardProducts } from '@/libs/fetchAllDashboardProducts'
import {
  formatRequestDocumentDate,
  isRequestDocumentFulfilled,
  normalizeRequestDocuments,
  requestDocumentsMissingDate,
  serializeRequestDocuments,
} from './requestDocumentUtils'

const ASSET_ENDPOINTS = {
  Property: '/property',
  OffPlan: '/property',
  Car: '/car',
  Boats: '/boat',
  Jewellery: '/jewelry',
}

const TRUSTEE_LISTING_QUERY = { limit: 500, page: 1 }

export function resolveListingType(listing) {
  if (isOffPlanListing(listing)) return 'OffPlan'

  const assetType = String(listing?.assetType || '')
  if (/property/i.test(assetType)) return 'Property'
  if (/car/i.test(assetType)) return 'Car'
  if (/boat/i.test(assetType)) return 'Boats'
  if (/jewell/i.test(assetType)) return 'Jewellery'

  const type = String(listing?.type || listing?.listingType || '').toLowerCase()
  if (type === 'offplan' || type === 'off plan') return 'OffPlan'
  if (type === 'property') return 'Property'
  if (type === 'car') return 'Car'
  if (type === 'boat' || type === 'boats') return 'Boats'
  if (type === 'jewelry' || type === 'jewellery') return 'Jewellery'
  return null
}

export function getListingApiUrl(assetType, listingId) {
  const resolvedType =
    ASSET_ENDPOINTS[assetType] != null
      ? assetType
      : resolveListingType({ assetType, listingType: assetType })
  const endpoint = ASSET_ENDPOINTS[resolvedType]
  if (!endpoint || !listingId) return null
  return `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}/${listingId}`
}

function normalizeListings(data, type) {
  const items = Array.isArray(data?.products)
    ? data.products
    : Array.isArray(data)
      ? data
      : []
  return items.map((item) => ({ ...item, listingType: type }))
}

function normalizePropertyListings(data) {
  const items = Array.isArray(data?.products)
    ? data.products
    : Array.isArray(data)
      ? data
      : []
  return items.map((item) => ({
    ...item,
    listingType: isOffPlanListing(item) ? 'OffPlan' : 'Property',
  }))
}

function isActiveListing(item) {
  return item.status === undefined || item.status === 0 || item.status === 1
}

function docId(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  return String(value._id || value.id || value.uuid || '')
}

/** Fetch every dashboard page so no uploaded docs are missed. */
async function fetchAssetHolderListings() {
  const [properties, cars, boats, jewelry] = await Promise.all([
    fetchAllDashboardProducts('/property'),
    fetchAllDashboardProducts('/car'),
    fetchAllDashboardProducts('/boat'),
    fetchAllDashboardProducts('/jewelry'),
  ])

  return [
    ...normalizePropertyListings(properties),
    ...normalizeListings(cars, 'Car'),
    ...normalizeListings(boats, 'Boats'),
    ...normalizeListings(jewelry, 'Jewellery'),
  ]
}

export async function fetchTrusteeListings() {
  const [propertyRes, carRes, boatRes, jewelryRes] = await Promise.all([
    customAxios.get('/property', { params: TRUSTEE_LISTING_QUERY }),
    customAxios.get('/car', { params: TRUSTEE_LISTING_QUERY }),
    customAxios.get('/boat', { params: TRUSTEE_LISTING_QUERY }),
    customAxios.get('/jewelry', { params: TRUSTEE_LISTING_QUERY }),
  ])

  return [
    ...normalizePropertyListings(propertyRes.data).filter(isActiveListing),
    ...normalizeListings(carRes.data, 'Car').filter(isActiveListing),
    ...normalizeListings(boatRes.data, 'Boats').filter(isActiveListing),
    ...normalizeListings(jewelryRes.data, 'Jewellery').filter(isActiveListing),
  ]
}

function mapListingDocumentRequests(listing) {
  const requests = normalizeRequestDocuments(listing.requestDocument)

  return requests.map((request, index) => ({
    listingId: listing.uuid,
    listingTitle: listing.title,
    listingType: listing.listingType,
    assetType: listing.assetType || listing.listingType,
    requestIndex: index,
    name: request.name,
    date: request.uploadedAt || request.date,
    requestDate: request.date,
    uploadedAt: request.uploadedAt,
    document: request.document,
    source: 'request',
  }))
}

/** Extra uploads kept on the listing that are not part of a named request. */
function mapListingUploadDocuments(listing) {
  const uploads = Array.isArray(listing.uploadDocument)
    ? listing.uploadDocument
    : []
  if (!uploads.length) return []

  const requestDocIds = new Set(
    normalizeRequestDocuments(listing.requestDocument)
      .map((entry) => docId(entry.document))
      .filter(Boolean),
  )

  return uploads
    .filter((doc) => {
      const id = docId(doc)
      return id && !requestDocIds.has(id)
    })
    .map((doc, index) => ({
      listingId: listing.uuid,
      listingTitle: listing.title,
      listingType: listing.listingType,
      assetType: listing.assetType || listing.listingType,
      requestIndex: `upload-${index}`,
      name:
        doc?.Certificate?.name ||
        doc?.name ||
        doc?.title ||
        'Uploaded Document',
      date: doc?.uploadedAt || doc?.createdAt || doc?.updatedAt || '',
      requestDate: '',
      uploadedAt: doc?.uploadedAt || doc?.createdAt || '',
      document: doc,
      source: 'upload',
    }))
}

export function formatDocumentAssetType(value) {
  if (!value) return '—'
  if (value === 'OffPlan') return 'Off Plan'
  if (/off\s*plan/i.test(String(value))) return 'Off Plan'
  return String(value).replace(/([a-z])([A-Z])/g, '$1 $2')
}

export async function fetchPendingDocumentRequests() {
  const allListings = await fetchAssetHolderListings()

  return allListings
    .flatMap(mapListingDocumentRequests)
    .filter((request) => !isRequestDocumentFulfilled(request))
}

export async function fetchFulfilledDocumentRequests() {
  const allListings = await fetchAssetHolderListings()

  return allListings
    .flatMap(mapListingDocumentRequests)
    .filter((request) => isRequestDocumentFulfilled(request))
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
}

export async function fetchAllDocumentRequests() {
  const allListings = await fetchAssetHolderListings()

  return mapAllDocumentRequests(allListings)
}

export async function fetchTrusteeAllDocumentRequests() {
  const allListings = await fetchTrusteeListings()

  return mapAllDocumentRequests(allListings)
}

function mapAllDocumentRequests(allListings) {
  const fromRequests = allListings.flatMap(mapListingDocumentRequests).map(
    (request) => ({
      ...request,
      status: isRequestDocumentFulfilled(request) ? 'Uploaded' : 'Pending',
    }),
  )

  const fromUploads = allListings.flatMap(mapListingUploadDocuments).map(
    (entry) => ({
      ...entry,
      status: 'Uploaded',
    }),
  )

  return [...fromRequests, ...fromUploads].sort((a, b) => {
    const dateA = new Date(a.date || a.uploadedAt || 0).getTime()
    const dateB = new Date(b.date || b.uploadedAt || 0).getTime()
    if (dateB !== dateA) return dateB - dateA
    return String(a.name || '').localeCompare(String(b.name || ''))
  })
}

export async function fetchListingDocumentRequests(listingType, listingId) {
  const endpoint = ASSET_ENDPOINTS[listingType]
  if (!endpoint || !listingId) return []

  const res = await customAxios.get(`${endpoint}/${listingId}`)
  return normalizeRequestDocuments(res.data?.requestDocument)
}

export async function saveListingDocumentRequests({
  listingType,
  listingId,
  requestDocument,
}) {
  if (requestDocumentsMissingDate(requestDocument)) {
    throw new Error('Each requested document must have a date.')
  }

  const endpoint = ASSET_ENDPOINTS[listingType]
  if (!endpoint || !listingId) {
    throw new Error('Unsupported listing')
  }

  return customAxios.put(`${endpoint}/${listingId}`, {
    requestDocument: serializeRequestDocuments(requestDocument),
  })
}

export async function resolveRequestDocumentFile(entry) {
  const inlineSrc = getListingDocumentSrc(entry?.document)
  if (inlineSrc) {
    return {
      url: inlineSrc,
      fileName:
        entry.document?.Certificate?.name || entry.name || 'document.pdf',
    }
  }

  const endpoint = ASSET_ENDPOINTS[entry?.listingType]
  if (!endpoint || !entry?.listingId) return null

  const res = await customAxios.get(`${endpoint}/${entry.listingId}`)

  if (entry.source === 'upload') {
    const uploads = Array.isArray(res.data?.uploadDocument)
      ? res.data.uploadDocument
      : []
    const match =
      uploads.find((doc) => docId(doc) === docId(entry.document)) ||
      uploads.find((doc) => (doc?.Certificate?.name || doc?.name) === entry.name)
    if (!match) return null
    const url = getListingDocumentSrc(match)
    if (!url) return null
    return {
      url,
      fileName:
        match?.Certificate?.name || match?.name || entry.name || 'document.pdf',
    }
  }

  const requests = normalizeRequestDocuments(res.data?.requestDocument)
  const match =
    requests[entry.requestIndex]?.name === entry.name
      ? requests[entry.requestIndex]
      : requests.find((item) => item.name === entry.name)

  if (!match?.document) return null

  const url = getListingDocumentSrc(match.document)
  if (!url) return null

  return {
    url,
    fileName: match.document?.Certificate?.name || `${entry.name}.pdf`,
  }
}

export { formatRequestDocumentDate }

export async function fulfillRequestedDocument({
  assetType,
  listingId,
  requestIndex,
  requestName,
  documentId,
}) {
  const apiUrl = getListingApiUrl(assetType, listingId)
  if (!apiUrl) {
    throw new Error('Unsupported asset type')
  }

  return customAxios.put(apiUrl, {
    fulfillRequestDocument: {
      index: requestIndex,
      name: requestName,
      document: documentId,
    },
  })
}
