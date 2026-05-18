import {
  normalizeCountriesResponse,
  normalizeCitiesResponse,
} from "./normalizeCountriesResponse";

const fetchCountries = async () => {
  try {
    const response = await fetch("/api/countries", {
      next: { revalidate: 10 },
    });
    const data = await response.json();

    return normalizeCountriesResponse(data);
  } catch (error) {
    console.error("Error fetching countries data:", error);
    return [];
  }
};

const fetchCities = async (countryCode, searchQueryCity) => {
  try {
    const response = await fetch(
      `/api/country?name=${countryCode}&query=${searchQueryCity}`,
      { next: { revalidate: 10 } }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cities");
    }
    const data = await response.json();

    return normalizeCitiesResponse(data);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

export { fetchCountries, fetchCities };
