import { createContext, ReactNode } from "react";

interface ListingsContextType {
  loading: boolean;
  cityLoading: boolean;
  video: File | null;
  errors: Record<string, string>;
  isOpen: boolean;
  countries: Array<{ name: string; code: string }> | undefined;
  selectedCountry: string;
  cities: string[];
  isCityDropdownOpen: boolean;
  selectedCity: string;
  searchQuery: string;
  listings: string[];
  fetchCities: (countryName: string) => void;
  handleCountrySelect: (country: { name: string; code: string }) => void;
  // other state and function types
}

export const ListingsContext = createContext<ListingsContextType | undefined>(
  undefined
);
