import customAxios from './apis/apis'
import { normalizeRequestDocuments } from './requestDocumentUtils'

const ASSET_ENDPOINTS = {
  Property: '/property',
  Car: '/car',
  Boats: '/boat',
  Jewellery: '/jewelry',
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

export async function fetchPendingDocumentRequests() {
  const [propertyRes, carRes, boatRes, jewelryRes] = await Promise.all([
    customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/property?dashboard=true`, {
      status: 0,
    }),
    customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/car?dashboard=true`, {
      status: 0,
    }),
    customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/boat?dashboard=true`, {
      status: 0,
    }),
    customAxios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/jewelry?dashboard=true`,
      { status: 0 },
    ),
  ])

  const allListings = [
    ...normalizeListings(propertyRes.data, 'Property'),
    ...normalizeListings(carRes.data, 'Car'),
    ...normalizeListings(boatRes.data, 'Boats'),
    ...normalizeListings(jewelryRes.data, 'Jewellery'),
  ]

  return allListings.flatMap((listing) => {
    const requests = normalizeRequestDocuments(listing.requestDocument)
    return requests
      .map((request, index) => ({
        listingId: listing.uuid,
        listingTitle: listing.title,
        listingType: listing.listingType,
        assetType: listing.assetType,
        requestIndex: index,
        name: request.name,
        document: request.document,
      }))
      .filter((request) => !request.document)
  })
}

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
