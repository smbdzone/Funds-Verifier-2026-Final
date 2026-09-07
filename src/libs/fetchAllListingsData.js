import { publicApiFetch } from './publicApiClient'

export const fetchListingsData = async () => {
  try {
    const [boatResponse, propertyResponse, carResponse, jewelryResponse] =
      await Promise.all([
        publicApiFetch('/boat', { cache: 'no-store' }),
        publicApiFetch('/property', { cache: 'no-store' }),
        publicApiFetch('/car', { cache: 'no-store' }),
        publicApiFetch('/jewelry', { cache: 'no-store' }),
      ])

    const [boatData, propertyData, carData, jewelryData] = await Promise.all([
      boatResponse.json(),
      propertyResponse.json(),
      carResponse.json(),
      jewelryResponse.json(),
    ])

    const combinedListings = [
      ...boatData.products,
      ...propertyData.products,
      ...carData.products,
      ...jewelryData.products,
    ]

    return combinedListings
  } catch (error) {
    console.error('Error fetching listings:', error)
    throw error
  }
}
