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
  const villaTypeProperty =
    withoutOffPlanListings(
      (await safeApi(
        '/property?propertyType=Villa&statusFilter=1&limit=10',
        [],
      )) || [],
    )
  const apartmentTypeProperty =
    withoutOffPlanListings(
      (await safeApi(
        '/property?propertyType=Apartment&statusFilter=1&limit=10',
        [],
      )) || [],
    )
  const townhouseTypeProperty =
    withoutOffPlanListings(
      (await safeApi(
        '/property?propertyType=Townhouse&statusFilter=1&limit=10',
        [],
      )) || [],
    )
  const getPropertyPrice = await safeApi('/property/price', EMPTY_PRICE)
  const getCarPrice = await safeApi('/car/price', EMPTY_PRICE)
  const getBoatPrice = await safeApi('/boat/price', EMPTY_PRICE)
  const getJewellryPrice = await safeApi('/jewelry/price', EMPTY_PRICE)

  const propertyTypeData = [
    villaTypeProperty,
    apartmentTypeProperty,
    townhouseTypeProperty,
  ].flat()
  const propertiesForSale =
    withoutOffPlanListings(
      (await safeApi('/property?limit=100&statusFilter=1', EMPTY_LIST, 0)) ||
        EMPTY_LIST,
    )
  const propertiesForLease =
    withoutOffPlanListings(
      (await safeApi(
        '/property?propertyForLease=Yes&limit=100&statusFilter=1',
        EMPTY_LIST,
        0,
      )) || EMPTY_LIST,
    )

  const carsForSale =
    (await safeApi('/car?limit=10&statusFilter=1', EMPTY_LIST, 0)) || EMPTY_LIST
  const boatsForSale =
    (await safeApi('/boat?limit=100&statusFilter=1', EMPTY_LIST, 0)) ||
    EMPTY_LIST

  const contextValue = {
    propertyTypeData,
    propertiesForSale,
    propertiesForLease,
    carsForSale,
    boatsForSale,
    getPropertyPrice,
    getCarPrice,
    getBoatPrice,
    getJewellryPrice,
  }

  return <AppProvider value={contextValue}>{children}</AppProvider>
}
