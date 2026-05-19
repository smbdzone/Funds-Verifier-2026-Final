import React from 'react'
import { AppProvider } from '@/context/AppContext' // Adjust the import based on your project structure
import { api } from "../../config/"


export default async function ServerComponent({ children }) {
  const villaTypeProperty = await api('/property?propertyType=Villa&limit=10')
  const apartmentTypeProperty = await api(
    '/property?propertyType=Apartment&limit=10'
  )
  const buildingTypeProperty = await api(
    '/property?propertyType=Building&limit=10'
  )
  const getPropertyPrice = await api('/property/price')
  const getCarPrice = await api('/car/price')
  const getBoatPrice = await api('/boat/price')
  const getJewellryPrice = await api('/jewelry/price')

  const propertyTypeData = [
    villaTypeProperty,
    apartmentTypeProperty,
    buildingTypeProperty,
  ].flat()
  const propertiesForSale = await api(
    '/property?limit=100&statusFilter=1',
    {},
    0,
  )
  const propertiesForLease = await api(
    '/property?propertyForLease=Yes&limit=100&statusFilter=1',
    {},
    0,
  )

  const carsForSale = await api('/car?limit=10&statusFilter=1', {}, 0)
  const boatsForSale = await api('/boat?limit=100&statusFilter=1', {}, 0)

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
