// File: app/(HomeLayout)/advertise-with-us/analytics/AnalyticsWrapper.tsx
"use client";

import { useSearchParams } from "next/navigation";
import AnalyticsComponent from "@/components/advertisementComponent/AnalyticsComponent";

export default function AnalyticsWrapper() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return <AnalyticsComponent id={id} />;
}