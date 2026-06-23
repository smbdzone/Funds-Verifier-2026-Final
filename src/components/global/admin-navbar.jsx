"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Menu } from "@headlessui/react";
import { useProfile } from "../../context/UserContext";

export default function AdminNavBar() {
  const { user } = useProfile();

  return (
    <div className="border-b border-[#969696] w-full">
      <header className="!p-2 sm:!p-3 theme-container flex justify-between items-center sm:gap-4">
        <Link href="/">
          <figure className="cursor-pointer">
            <Image
              src="/assets/images/logo.svg"
              height={75}
              width={78}
              alt="Logo"
            />
          </figure>
        </Link>
        <div className="flex items-center gap-4 sm:gap-8">
          <Menu as="div" className="relative text-left z-100">
            <Menu.Button className="btn !min-w-max flex items-center gap-2">
              <figure>
                <Image
                  src={user?.profileImage || "/assets/images/dummy-profile.png"}
                  alt="Profile"
                  height={57}
                  width={57}
                  className="rounded-full"
                />
              </figure>
              <div>
                <h2 className="text-prussianBlue text-xs font-semibold">
                  {user?.displayName || user?.name || "Loading..."}
                </h2>
                <span className="text-prussianBlue text-[10px] block text-start">
                  {user?.role}
                </span>
              </div>
            </Menu.Button>
          </Menu>
        </div>
      </header>
    </div>
  );
}
