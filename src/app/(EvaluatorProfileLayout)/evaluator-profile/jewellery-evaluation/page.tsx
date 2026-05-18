"use client";
import React, { useState } from "react";
import { JewelleryEvaluationTab } from "@/components/modules/EvaluatorProfile/JewelleryEvaluationTab";

const Page = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleSetActiveTab = (tabIndex: any) => {
    setActiveTab(tabIndex);
  };

  return (
    <div>
      <JewelleryEvaluationTab />
    </div>
  );
};

export default Page;
