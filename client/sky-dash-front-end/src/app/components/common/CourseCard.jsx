"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

export default function CourseCard({ course }) {
  const router = useRouter();

  // Navigate to Course Details Page
  const handleCourseDetails = () => {
    router.push(`/courses/${course.id}`);
  };

  return (
    <div
      onClick={handleCourseDetails}
      className="relative bg-white border-2 border-gray-200 overflow-hidden transition-transform transform hover:scale-105 cursor-pointer flex flex-col group"
    >
      {/* Course Image */}
      <div className="relative w-full h-48 md:h-56">
        <img
          src={course.image}
          alt={course.title}
          className="object-cover w-full h-full"
        />

        {/* Full Overlay on Hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center text-white">
          <p className="text-lg font-semibold">Preview Course</p>
        </div>

        {/* "Top Seller" badge in top-left corner */}
        {course.topSeller && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-black px-2 py-1 text-xs font-semibold rounded">
            Top Seller
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-gray-500">Updated {course.date}</p>
        <h3 className="text-lg font-bold text-gray-900 mt-1">{course.title}</h3>
        <p className="text-gray-600 text-sm">{course.category}</p>

        {/* Footer pushed to bottom */}
        <div className="mt-auto pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <FaUser className="text-gray-500" />
            <span className="text-red-500 font-bold">${course.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
