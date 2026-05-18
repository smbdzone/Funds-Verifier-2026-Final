import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Function to geocode an address and get latitude and longitude
async function geocodeAddress(address, apiKey) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`
  const response = await fetch(url)
  const data = await response.json()

  if (data.results && data.results.length > 0) {
    const location = data.results[0].geometry.location
    return {
      lat: location.lat,
      lng: location.lng,
      formatted_address: data.results[0].formatted_address, // Full formatted address
      region:
        data.results[0].address_components.find((component) =>
          component.types.includes('administrative_area_level_1')
        )?.long_name || 'N/A', // Extract region (state/province)
    }
  }

  return null
}

// Function to fetch places with broader types (e.g., establishments, landmarks, political regions, etc.)
async function fetchNearbyPlaces(lat, lng, radius, apiKey, pageToken = null) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${apiKey}${
    pageToken ? `&pagetoken=${pageToken}` : ''
  }`

  const response = await fetch(url)
  const data = await response.json()

  if (data.results) {
    return {
      places: data.results,
      nextPageToken: data.next_page_token,
    }
  }

  return { places: [], nextPageToken: null }
}

// Function to fetch place details using Place ID
async function fetchPlaceDetails(placeId, apiKey) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`
  const response = await fetch(url)
  const data = await response.json()
  if (data.result) {
    return data.result // Return place details
  }
  return null
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const apiKey = process.env.GOOGLE_MAP_API_KEY // Ensure you use your API key

  if (!address) {
    return NextResponse.json({ error: 'Address is required.' }, { status: 400 })
  }

  try {
    // Step 1: Geocode the address to get latitude and longitude, and region
    const location = await geocodeAddress(address, apiKey)

    if (!location) {
      return NextResponse.json(
        { error: 'Failed to geocode address.' },
        { status: 500 }
      )
    }

    const { lat, lng, formatted_address, region } = location
    let allPlaces = []
    let nextPageToken = null

    // Step 2: Fetch all nearby places (this includes neighborhoods, landmarks, and establishments)
    do {
      const { places, nextPageToken: newPageToken } = await fetchNearbyPlaces(
        lat,
        lng,
        5000, // You can adjust the radius as needed
        apiKey,
        nextPageToken
      )

      allPlaces = [...allPlaces, ...places]
      nextPageToken = newPageToken

      // If there is a next page, wait for a while (Google recommends a delay)
      if (nextPageToken) {
        await new Promise((resolve) => setTimeout(resolve, 2000)) // 2-second delay
      }
    } while (nextPageToken) // Keep fetching until no more pages

    // Step 3: Fetch details for each place (optional)
    const placesWithDetails = await Promise.all(
      allPlaces.map(async (place) => {
        const placeDetails = await fetchPlaceDetails(place.place_id, apiKey)
        return {
          name: place.name,
          vicinity: place.vicinity,
          place_id: place.place_id,
          types: place.types,
          formatted_address: placeDetails?.formatted_address || place.vicinity,
          details: placeDetails,
        }
      })
    )

    return NextResponse.json({
      location: {
        address: formatted_address,
        region: region,
        latitude: lat,
        longitude: lng,
      },
      places: placesWithDetails,
    })
  } catch (error) {
    console.error('Error fetching places or details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch places or details.' },
      { status: 500 }
    )
  }
}
