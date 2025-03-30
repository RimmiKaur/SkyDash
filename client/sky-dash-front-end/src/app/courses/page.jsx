"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../components/common/CourseCard";
import CourseFilter from "../components/CategoryFilter"; // our updated filter component

export default function CourseSearch() {
  // Basic filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  // Additional filter states
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(500);
  const [selectedDuration, setSelectedDuration] = useState("");

  const [courses, setCourses] = useState([]);

  // Categories for the top dropdown
  const categories = [
    "All",
    "Web Development",
    "Data Science",
    "Machine Learning",
    "Cybersecurity",
    "Cloud Computing",
    "UI/UX Design",
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Build query parameters object
        const params = {};
        if (selectedCategory && selectedCategory !== "All") {
          params.category = selectedCategory;
        }
        if (searchQuery) {
          params.search = searchQuery;
        }
        if (selectedLanguage) {
          params.language = selectedLanguage;
        }
        if (selectedPrice) {
          params.maxPrice = selectedPrice;
        }
        if (selectedDuration) {
          params.duration = selectedDuration;
        }

        const response = await axios.get("http://localhost:8080/web/course/view", { params });
        if (response.data.status === 1) {
          const staticPath = response.data.staticPath || "";
          const mappedCourses = response.data.data.map((course) => ({
            id: course._id,
            title: course.courseName,
            category: course.courseCategory,
            image: `http://localhost:8080/${staticPath}/${course.courseImage}`,
            date: new Date(course.createdAt).toLocaleDateString(),
            price: course.coursePrice,
            topSeller: course.topCourse === "true" || course.topCourse === true,
          }));
          setCourses(mappedCourses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [selectedCategory, searchQuery, selectedLanguage, selectedPrice, selectedDuration]);

  return (
    <div className="bg-white px-4 py-10 sm:px-10 md:px-20 lg:px-32 min-h-screen">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pb-10 border-b border-gray-300">
        {/* Dropdown for Categories */}
        <select
          className="border border-gray-300 p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <div className="flex-grow flex items-center border max-w-lg border-gray-300 p-2">
          <input
            type="text"
            placeholder="Search Our Course"
            className="w-full outline-none text-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="text-gray-500 hover:text-blue-600 transition">🔍</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
          {courses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>

        {/* Advanced Filters on the side */}
        <div className="w-full md:w-80">
          <CourseFilter
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
          />
        </div>
      </div>
    </div>
  );
}
