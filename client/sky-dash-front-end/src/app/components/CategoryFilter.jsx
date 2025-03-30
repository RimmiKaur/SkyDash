"use client";
import React from "react";
import { FaChevronDown, FaChevronUp, FaFilter } from "react-icons/fa";

export default function CourseFilter({
  selectedLanguage,
  setSelectedLanguage,
  selectedPrice,
  setSelectedPrice,
  selectedDuration,
  setSelectedDuration,
}) {
  const [openSections, setOpenSections] = React.useState({
    duration: true,
    language: true,
    price: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-72 ml-10 bg-white text-black p-4 shadow-md border border-gray-200 mt-[-80px]">
      {/* Filter Header */}
      <div className="flex justify-between items-center mb-4">
        <button className="flex items-center space-x-2 text-lg font-semibold">
          <FaFilter />
          <span>Filter</span>
        </button>
        <select className="border p-2 rounded-md text-sm">
          <option>Most Popular</option>
          <option>Newest</option>
          <option>Highest Rated</option>
        </select>
      </div>

      {/* Duration Filter */}
      <div className="mt-4">
        <button
          className="flex justify-between w-full text-lg font-semibold mb-2"
          onClick={() => toggleSection("duration")}
        >
          Video Duration {openSections.duration ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {openSections.duration && (
          <div className="space-y-2">
            <select
              className="w-full border p-2 focus:ring-2 focus:ring-blue-500"
              value={selectedDuration || ""}
              onChange={(e) => setSelectedDuration(e.target.value)}
            >
              <option value="">Any</option>
              <option value="0-1">0-1 Hour</option>
              <option value="1-3">1-3 Hours</option>
              <option value="3-6">3-6 Hours</option>
              <option value="6-17">6-17 Hours</option>
            </select>
          </div>
        )}
      </div>

      {/* Language Filter with Radio Buttons */}
      <div className="mt-4">
        <button
          className="flex justify-between w-full text-lg font-semibold mb-2"
          onClick={() => toggleSection("language")}
        >
          Language {openSections.language ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {openSections.language && (
          <div className="mt-2 space-y-2">
            {["english", "spanish", "french", "german", "chinese"].map((lang) => (
              <label key={lang} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="language"
                  value={lang}
                  checked={selectedLanguage === lang}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                />
                <span>{lang.charAt(0).toUpperCase() + lang.slice(1)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter with Slider */}
      <div className="mt-4">
        <button
          className="flex justify-between w-full text-lg font-semibold mb-2"
          onClick={() => toggleSection("price")}
        >
          Price {openSections.price ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {openSections.price && (
          <div className="mt-2">
            <input
              type="range"
              min="0"
              max="10000"
              step="10"
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="w-full"
            />
            <div className="text-sm mt-1">Selected Price: ${selectedPrice}</div>
          </div>
        )}
      </div>
    </div>
  );
}
