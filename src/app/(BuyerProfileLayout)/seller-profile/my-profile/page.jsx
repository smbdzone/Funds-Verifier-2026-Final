/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Overview from "@/components/modules/SellerProfile/Overview";
import React, { useEffect } from "react";
import { useProfile } from "@/context/UserContext";

async function page() {
  const { user, fetchProfile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <div>
      <Overview user={user} />
    </div>
  );
}

export default page;
