"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

export default function TeacherCard() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/web/home/teachers")
      .then((res) => {
        if (res.data.status === 1) {
          setTeamMembers(res.data.data);
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
    <section className="py-16 bg-white text-center">
      <ToastContainer />
      <h2 className="text-3xl font-semibold mb-8">Meet Our Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-10 max-w-6xl mx-auto">
        {teamMembers.map((member) => (
          <div
            key={member._id}
            className="bg-white shadow-lg border border-gray-200 p-6 flex flex-col items-center"
          >
            <img
              src={`http://localhost:8080/uploads/team/${member.teamImage}`}
              alt={member.teamMemberName}
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
            <h3 className="text-lg font-semibold mt-4">{member.teamMemberName}</h3>
            <p className="text-gray-600">{member.teamDescription}</p>
            <div className="flex mt-2 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
