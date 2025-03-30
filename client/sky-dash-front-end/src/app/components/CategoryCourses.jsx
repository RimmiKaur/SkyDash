"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FaPencilAlt } from "react-icons/fa";

export default function CourseCategories() {
  const categories = [
    { name: "All", courses: "All Courses" },
    { name: "Web Development", courses: "Over 600 Courses" },
    { name: "Data Science", courses: "Over 400 Courses" },
    { name: "Machine Learning", courses: "Over 300 Courses" },
    { name: "Cybersecurity", courses: "Over 200 Courses" },
    { name: "Cloud Computing", courses: "Over 150 Courses" },
    { name: "UI/UX Design", courses: "Over 100 Courses" },
  ];
  
  const router= useRouter();

  const sendToCourses = () =>{
    router.push('/courses')
  }
  return (
    <section className="py-16 bg-white text-center">
      {/* Section Heading */}
      <div className="max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">Via School Categories Courses</h2>
        <p className="text-gray-500 mt-2">
          Cum doctus civibus efficiantur in imperdiet deterruisset.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6 max-w-7xl mx-auto">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-10 text-center border border-gray-200 transition-transform transform hover:scale-105 cursor-pointer"
            onClick={()=>{
              sendToCourses()
            }}
          >
            <div className="flex justify-center">
              <FaPencilAlt className="text-blue-500 text-4xl mb-4" />
            </div>
            <h3 className="text-lg font-bold text-blue-600">{category.name}</h3>
            <p className="text-gray-600">{category.courses}</p>
          </div>
        ))}
      </div>

    
    </section>
  );
}
