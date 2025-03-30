"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaStar } from "react-icons/fa";

export default function Teachers({ type }) {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/web/home/teachers")
      .then((res) => {
        if (res.data.status === 1) {
          setTeachers(res.data.data);
        } else {
          toast.error("Failed to load teachers");
        }
      })
      .catch((error) => {
        console.error("Error fetching teacher data:", error);
        toast.error("Error fetching teacher data");
      });
  }, []);

  return (
    <section className="pb-42 pt-20 bg-white text-center">
      <ToastContainer />
      {/* Section Heading */}
      <div className="max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">{type}</h2>
        <p className="text-gray-500 mt-2">
          Cum doctus civibus efficiantur in imperdiet deterruisset.
        </p>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6 px-6 max-w-6xl mx-auto">
        {teachers.map((teacher) => (
          <div key={teacher._id} className="text-center">
            {/* Teacher Image */}
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-300 transition-transform transform hover:scale-105">
              <img
                src={`http://localhost:8080/uploads/team/${teacher.teamImage}`}
                alt={teacher.teamMemberName}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Rating (static for now) */}
            <div className="flex justify-center mt-2 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>

            {/* Teacher Name */}
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {teacher.teamMemberName}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
