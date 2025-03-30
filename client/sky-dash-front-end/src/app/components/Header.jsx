"use client";
import { usePathname } from "next/navigation";
import React from "react";

export default function Header() {
  const pathname = usePathname();

  // Format the pathname (e.g., "about-us" → "About Us")
  const formatPathname = (path) => {
    if (path === "/") return "Home";
    return path
      .replace("/", "")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formattedPathname = formatPathname(pathname);

  return (
    <div className="relative">
      {/* Background Image with responsive height */}
      <img
        src="/images/hero-bg.jpg"
        alt="Hero Background"
        className="object-cover w-full h-64 sm:h-[400px] object-top"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 h-64 sm:h-[400px]"></div>
      {/* Text Overlay */}
      <div className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center px-4">
        <h2 className="text-2xl sm:text-4xl font-semibold text-white">
          {formattedPathname}
        </h2>
        <p className="pt-3 text-sm sm:text-base text-white">
          Home / {formattedPathname}
        </p>
      </div>
    </div>
  );
}
