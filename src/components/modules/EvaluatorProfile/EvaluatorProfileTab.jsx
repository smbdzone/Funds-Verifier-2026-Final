"use client";
import Link from "next/link";
import React from "react";

const EvaluatorProfileTab = ({ user }) => {
  const displayRole = (user) => {
    if (
      user?.role === "SubEvaluator" ||
      (user?.role === "Evaluator" && (user?.parentEvaluator || user?.parentID))
    ) {
      return "Sub Evaluator";
    }
    return user?.role;
  };
  const overview = user
    ? [
        { key: "Name", value: user?.name },
        { key: "Phone", value: user?.phone },
        { key: "Email", value: user?.email },
        { key: "Role", value: displayRole(user) },
        { key: "Gender", value: user?.gender },
        {
          key: "Date of birth",
          value: new Date(user.dateOfBirth).toLocaleDateString("en-US", {
            timeZone: "UTC",
          }),
        },
        { key: "Nationality", value: user?.country },
        { key: "Address", value: user?.address },
      ]
    : [];
  return (
    <>
      <div className="custom-shadow rounded">
        <div className="primary-gradient border border-black rounded px-12 overflow-x-auto">
          <nav className="flex justify-between gap-3 w-full" aria-label="Tabs">
            <button
              className={`whitespace-nowrap py-4 cursor-pointer text-xl `}
            >
              My Profile
            </button>
          </nav>
        </div>
      </div>
      <div className="p-12">
        <h3 className="mb-3 text-prussianBlue text-2xl font-medium">
          About / {displayRole(user)}
        </h3>
        <p className="text-lg mb-12">{user?.about}</p>
        <h4 className="text-prussianBlue mb-7 text-2xl font-medium">
          Profile Details
        </h4>
        <div className="flex flex-col gap-4 text-xl">
          {overview.map((ele, i) => (
            <div key={i} className="flex">
              <h4 className="w-[30%] font-medium">{ele.key}</h4>
              <span className="text-black/60">{ele.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end items-center">
          <Link href="/evaluator-profile/edit-profile">
            <button className="primary-gradient rounded px-4 py-2">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default EvaluatorProfileTab;
