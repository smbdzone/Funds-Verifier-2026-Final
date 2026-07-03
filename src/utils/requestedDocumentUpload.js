import customAxios from './apis/apis'
import { getListingDocumentSrc } from '@/libs/listingCardMedia'
import {
  formatRequestDocumentDate,
  isRequestDocumentFulfilled,
  normalizeRequestDocuments,
  requestDocumentsMissingDate,
  serializeRequestDocuments,
} from './requestDocumentUtils'

const ASSET_ENDPOINTS = {
  Property: '/property',
  Car: '/car',
  Boats: '/boat',
  Jewellery: '/jewelry',
}

const ASSET_HOLDER_LISTING_QUERY = { dashboard: true, limit: 200, page: 1 }
const TRUSTEE_LISTING_QUERY = { limit: 500, page: 1 }

export function resolveListingType(listing) {
  const assetType = String(listing?.assetType || '')
  if (/property/i.test(assetType)) return 'Property'
  if (/car/i.test(assetType)) return 'Car'
  if (/boat/i.test(assetType)) return 'Boats'
  if (/jewell/i.test(assetType)) return 'Jewellery'

  const type = String(listing?.type || listing?.listingType || '').toLowerCase()
  if (type === 'property') return 'Property'
  if (type === 'car') return 'Car'
  if (type === 'boat' || type === 'boats') return 'Boats'
  if (type === 'jewelry' || type === 'jewellery') return 'Jewellery'
  return null
}

export function getListingApiUrl(assetType, listingId) {
  const endpoint = ASSET_ENDPOINTS[assetType]
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

function isActiveListing(item) {
  return item.status === undefined || item.status === 0 || item.status === 1
}

async function fetchAssetHolderListings() {
  const [propertyRes, carRes, boatRes, jewelryRes] = await Promise.all([
    customAxios.get('/property', { params: ASSET_HOLDER_LISTING_QUERY }),
    customAxios.get('/car', { params: ASSET_HOLDER_LISTING_QUERY }),
    customAxios.get('/boat', { params: ASSET_HOLDER_LISTING_QUERY }),
    customAxios.get('/jewelry', { params: ASSET_HOLDER_LISTING_QUERY }),
  ])

  return [
    ...normalizeListings(propertyRes.data, 'Property'),
    ...normalizeListings(carRes.data, 'Car'),
    ...normalizeListings(boatRes.data, 'Boats'),
    ...normalizeListings(jewelryRes.data, 'Jewellery'),
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
    ...normalizeListings(propertyRes.data, 'Property').filter(isActiveListing),
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
    date: request.date,
    document: request.document,
  }))
}

export function formatDocumentAssetType(value) {
  if (!value) return '—'
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
  return allListings
    .flatMap(mapListingDocumentRequests)
    .map((request) => ({
      ...request,
      status: isRequestDocumentFulfilled(request) ? 'Uploaded' : 'Pending',
    }))
    .sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime()
      const dateB = new Date(b.date || 0).getTime()
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
        entry.document?.Certificate?.name || `${entry.name || 'document'}.pdf`,
    }
  }

  const endpoint = ASSET_ENDPOINTS[entry?.listingType]
  if (!endpoint || !entry?.listingId) return null

  const res = await customAxios.get(`${endpoint}/${entry.listingId}`)
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
