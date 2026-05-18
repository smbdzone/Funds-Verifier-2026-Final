"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  DealIcon,
  DocumentsIcon,
  ElectronicIcon,
  PasswordIcon,
  ProfileIcon,
  ProtocolIcon,
  PurchaseIcon,
  SecurityIcon,
} from "@/components/Icons";
import { ProfileTab } from "@/components/modules/Profile/ProfileTab";
import { DealTab } from "@/components/modules/Profile/DealTab";
import { ProtocolTab } from "@/components/modules/Profile/ProtocolTab";
import { ElectronicTab } from "@/components/modules/Profile/ElectronicTab";
import { DocumentTab } from "@/components/modules/Profile/DocumentTab";
import { PurchaseTab } from "@/components/modules/Profile/PurchaseTab";
import { SecurityTab } from "@/components/modules/Profile/SecurityTab";
import { PasswordTab } from "@/components/modules/Profile/PasswordTab";

export default function Home() {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);
  const tabs = [
    { icon: <ProfileIcon />, name: "Profile", link: "/profile" },
    {
      icon: <DealIcon />,
      name: "Deal Preference",
      link: "/profile/deal-preference",
    },
    {
      icon: <ProtocolIcon />,
      name: "Confidentiality and Protocol",
      link: "/profile/confidentiality-protocol",
    },
    {
      icon: <ElectronicIcon />,
      name: "Electronic Consent",
      link: "/profile/electronic-consent",
    },
    {
      icon: <DocumentsIcon />,
      name: "Documents Storage",
      link: "/profile/documents-storage",
    },
    {
      icon: <PurchaseIcon />,
      name: "Purchase Tracker",
      link: "/profile/purchase-tracker",
    },
    { icon: <SecurityIcon />, name: "Security", link: "/profile/security" },
    {
      icon: <PasswordIcon />,
      name: "Change Password",
      link: "/profile/change-password",
    },
  ];
  return (
    <div className="theme-container !py-8 flex flex-col md:flex-row gap-7">
      <div className="flex flex-col gap-7 m:min-w-[385px]">
        <div className="custom-shadow flex justify-center items-center flex-col py-6 rounded">
          <figure>
            <Image
              src="/assets/images/profile-01.jpg"
              alt="Profile"
              height={184}
              width={184}
              className="mb-5 rounded-full"
            />
          </figure>
          <h1 className="text-prussianBlue font-semibold text-3xl">
            John Smith
          </h1>
          <h2 className="text-2xl text-prussianBlue mb-3">Deal Hunter</h2>
        </div>
        <div className="flex flex-col custom-shadow rounded py-5">
          <div>
            <nav className=" flex flex-col" aria-label="Tabs">
              {tabs.map((tab, i) => (
                <Link
                  href={tab.link}
                  key={tab.name}
                  className={`${
                    i === selectedTabIdx
                      ? "  bg-whiteSmoke text-reefGold font-medium focus:outline-none "
                      : "border-transparent"
                  } whitespace-nowrap flex gap-3 hover:bg-whiteSmoke items-center py-2 px-8 cursor-pointer sm:text-xl`}
                  onClick={() => setSelectedTabIdx(i)}
                >
                  {tab.icon}
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="grow">
        {selectedTabIdx === 0 && <ProfileTab />}
        {selectedTabIdx === 1 && <DealTab />}
        {selectedTabIdx === 2 && <ProtocolTab />}
        {selectedTabIdx === 3 && <ElectronicTab />}
        {selectedTabIdx === 4 && <DocumentTab />}
        {selectedTabIdx === 5 && <PurchaseTab />}
        {selectedTabIdx === 6 && <SecurityTab />}
        {selectedTabIdx === 7 && <PasswordTab />}
      </div>
    </div>
  );
}
