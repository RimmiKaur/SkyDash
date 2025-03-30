"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "./common/CourseCard"; // Adjust the path as needed

export default function TopCourses() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [courses, setCourses] = useState([]);

  const categories = [
    "All",
    "Web Development",
    "Data Science",
    "Machine Learning",
    "Cybersecurity",
    "Cloud Computing",
    "UI/UX Design"
  ];

  useEffect(() => {
    // Build the API URL based on the selected category
    const baseURL = "http://localhost:8080/web/home/top-courses";
    const fetchURL =
      activeCategory === "All"
        ? baseURL
        : `${baseURL}/${encodeURIComponent(activeCategory)}`;

    axios
      .get(fetchURL)
      .then((res) => {
        if (res.data.status === 1) {
          // Limit courses to 5 if necessary
          const fetchedCourses = res.data.data.slice(0, 5);
          const staticPath = res.data.staticPath || "";
          const mappedCourses = fetchedCourses.map((course) => ({
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
      })
      .catch((error) => {
        console.error("Error fetching top courses:", error);
      });
  }, [activeCategory]);

  return (
    <section className="py-24 bg-gray-100 text-center px-4">
      {/* Section Heading */}
      <div className="max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">
          Browse Our Top Courses
        </h2>
        <p className="text-gray-500 mt-2">
          Cum doctus civibus efficiantur in imperdiet deterruisset.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 text-lg font-medium mb-6">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(category)}
            className={`${
              activeCategory === category
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            } pb-1 transition hover:text-blue-500 mb-2`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </section>
  );
}
