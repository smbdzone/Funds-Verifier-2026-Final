export const fetchListingsData = async () => {
  try {
    const [boatResponse, propertyResponse, carResponse, jewelryResponse] =
      await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/boat`, {
          cache: "no-store",
        }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/property`, {
          cache: "no-store",
        }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/car`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jewelry`, {
          cache: "no-store",
        }),
      ]);

    const [boatData, propertyData, carData, jewelryData] = await Promise.all([
      boatResponse.json(),
      propertyResponse.json(),
      carResponse.json(),
      jewelryResponse.json(),
    ]);

    const combinedListings = [
      ...boatData.products,
      ...propertyData.products,
      ...carData.products,
      ...jewelryData.products,
    ];

    return combinedListings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};
