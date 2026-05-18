'use client'

import React, { useEffect, useState } from "react";
import EditEvaluatorProfile from "../../../../components/modules/EvaluatorProfile/EditEvaluatorProfile";
import { useProfile } from "../../../../context/UserContext";
import { FaSpinner } from "react-icons/fa";
import { normalizeCountriesResponse } from "@/libs/normalizeCountriesResponse";

const Page = () => {
  const { user, fetchProfile } = useProfile();

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCountries = async () => {
    try {
      const response = await fetch("/api/countries");
      const data = await response.json();

      setCountries(normalizeCountriesResponse(data));
    } catch (error) {
      console.error("Error fetching countries:", error);
      setCountries([]); // fallback
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchProfile(),
          fetchCountries()
        ]);
      } catch (error) {
        console.error("Error loading page data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ✅ Loader UI
  if (loading) {
    return (
      <div className="w-full h-40 flex justify-center items-center">
        <FaSpinner className="animate-spin text-xl" />
      </div>
    );
  }

  return (
    <div>
      {/* ✅ safe render */}
      {user && (
        <EditEvaluatorProfile 
          user={user} 
          countries={countries} 
        />
      )}
    </div>
  );
};

export default Page;