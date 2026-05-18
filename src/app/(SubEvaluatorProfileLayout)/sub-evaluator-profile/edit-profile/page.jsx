/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import EditSubEvaluatorProfile from "../../../../components/modules/SubEvaluatorProfile/EditSubEvaluatorProfile";
import { normalizeCountriesResponse } from "@/libs/normalizeCountriesResponse";

function Page() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchCountries();
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

  return (
    <div>
      <EditSubEvaluatorProfile user={null} countries={countries} />
    </div>
  );
}

export default Page;
