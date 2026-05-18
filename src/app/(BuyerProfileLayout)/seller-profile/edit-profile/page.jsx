"use client";
import React, { useEffect, useState } from "react";
import EditProfile from "@/components/modules/SellerProfile/Profile/EditProfile";
import { useProfile } from "../../../../context/UserContext";
import { normalizeCountriesResponse } from "@/libs/normalizeCountriesResponse";

const Page = () => {
  const { user, fetchProfile } = useProfile();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      await fetchProfile();
      await fetchCountries();
    };

    initialize();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch("/api/countries", {
        next: { revalidate: 10 },
      });
      const data = await response.json();
      setCountries(normalizeCountriesResponse(data));
    } catch (error) {
      console.error("Error fetching countries data:", error);
    }
  };

  return <EditProfile user={user} countries={countries} />;
};

export default Page;
