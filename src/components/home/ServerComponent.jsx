import React from 'react'
import { AppProvider } from '@/context/AppContext'
import { api } from '../../config/'
import { isOffPlanListing } from '@/libs/filterMyListingTab'

const EMPTY_LIST = { products: [] }
const EMPTY_PRICE = { lowestPrice: 0, highestPrice: 1000 }

function withoutOffPlanListings(payload) {
  if (Array.isArray(payload)) {
    return payload.filter((item) => !isOffPlanListing(item))
  }
  if (payload && Array.isArray(payload.products)) {
    return {
      ...payload,
      products: payload.products.filter((item) => !isOffPlanListing(item)),
    }
  }
  return payload
}

async function safeApi(url, fallback = null) {
  try {
    return await api(url)
  } catch (error) {
    console.error('ServerComponent API failed:', url, error)
    return fallback
  }
}

export default async function ServerComponent({ children }) {
  // Fetch all home layout data in parallel — sequential awaits were blocking TTFB.
  const [
    villaTypeProperty,
    apartmentTypeProperty,
    townhouseTypeProperty,
    getPropertyPrice,
    getCarPrice,
    getBoatPrice,
    getJewellryPrice,
    propertiesForSaleRaw,
    propertiesForLeaseRaw,
    carsForSale,
    boatsForSale,
    jewelryForSale,
  ] = await Promise.all([
    safeApi('/property?propertyType=Villa&statusFilter=1&limit=10', []),
    safeApi('/property?propertyType=Apartment&statusFilter=1&limit=10', []),
    safeApi('/property?propertyType=Townhouse&statusFilter=1&limit=10', []),
    safeApi('/property/price', EMPTY_PRICE),
    safeApi('/car/price', EMPTY_PRICE),
    safeApi('/boat/price', EMPTY_PRICE),
    safeApi('/jewelry/price', EMPTY_PRICE),
    safeApi('/property?limit=100&statusFilter=1&sort=-createdAt', EMPTY_LIST),
    safeApi(
      '/property?propertyForLease=Yes&limit=100&statusFilter=1&sort=-createdAt',
      EMPTY_LIST,
    ),
    safeApi('/car?limit=100&statusFilter=1&sort=-createdAt', EMPTY_LIST),
    safeApi('/boat?limit=100&statusFilter=1&sort=-createdAt', EMPTY_LIST),
    safeApi('/jewelry?limit=100&statusFilter=1&sort=-createdAt', EMPTY_LIST),
  ])

  const propertyTypeData = [
    withoutOffPlanListings(villaTypeProperty || []),
    withoutOffPlanListings(apartmentTypeProperty || []),
    withoutOffPlanListings(townhouseTypeProperty || []),
  ].flat()

  const contextValue = {
    propertyTypeData,
    propertiesForSale: withoutOffPlanListings(
      propertiesForSaleRaw || EMPTY_LIST,
    ),
    propertiesForLease: withoutOffPlanListings(
      propertiesForLeaseRaw || EMPTY_LIST,
    ),
    carsForSale: carsForSale || EMPTY_LIST,
    boatsForSale: boatsForSale || EMPTY_LIST,
    jewelryForSale: jewelryForSale || EMPTY_LIST,
    getPropertyPrice,
    getCarPrice,
    getBoatPrice,
    getJewellryPrice,
  }

  return <AppProvider value={contextValue}>{children}</AppProvider>
}
