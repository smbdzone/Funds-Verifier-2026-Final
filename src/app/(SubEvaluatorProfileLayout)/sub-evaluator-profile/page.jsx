/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useState } from "react";
import { useProfile } from "../../../context/UserContext";
import TermsAndConditionModal3 from "../../../components/modal/TermsAndConditionModal3";
import EditProfile from "@/components/modules/SellerProfile/Profile/EditProfile";
import { normalizeCountriesResponse } from "@/libs/normalizeCountriesResponse";

const page = () => {
  const [consentTerms, setConsentTerms] = useState(false);
  const { user, fetchProfile } = useProfile();
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        await fetchProfile();
        await fetchCountries();
      } catch (error) {
        console.error("Error initializing sub-evaluator profile:", error);
        setErrorMessage("Unable to load profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const fetchCountries = async () => {
    const response = await fetch("/api/countries", {
      next: { revalidate: 10 },
    });

    if (!response.ok) {
      throw new Error(`Countries API failed with status ${response.status}`);
    }

    const data = await response.json();
    setCountries(normalizeCountriesResponse(data));
  };

  useEffect(() => {
    // Set a timer to show the newsletter modal after 5 seconds
    const timer = setTimeout(() => {
      setConsentTerms(true);
    }, 1000);

    // Cleanup the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <p className="text-center py-6">Loading profile...</p>;
  }

  if (errorMessage) {
    return <p className="text-center py-6 text-red-500">{errorMessage}</p>;
  }

  return (
    <>
      <EditProfile user={user} countries={countries} />
      {user?.userState === "inactive" ? (
        <TermsAndConditionModal3
          show={consentTerms}
          onClose={() => setConsentTerms(false)}
        />
      ) : null}
    </>
  );
};

export default page;
