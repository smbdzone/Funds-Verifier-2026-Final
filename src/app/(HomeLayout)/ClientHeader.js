"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Layout/Header";

export default function ClientHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full bg-white ${
        isScrolled ? "fixed top-0 z-50" : "sticky top-0 z-50"
      }`}
    >
      <Header />
    </div>
  );
}
