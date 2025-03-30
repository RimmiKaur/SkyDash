"use client";
import React from "react";
import { FaPlus } from "react-icons/fa";

export default function WhatWeDo() {
  const services = [
    { title: "Create Account", description: "Sed cursus turpis vitae tortor donec eaque ipsa quaeab illo.", color: "bg-yellow-400", textColor: "text-white" },
    { title: "Create Account", description: "Sed cursus turpis vitae tortor donec eaque ipsa quaeab illo.", color: "bg-blue-900", textColor: "text-white" },
    { title: "Create Account", description: "Sed cursus turpis vitae tortor donec eaque ipsa quaeab illo.", color: "bg-blue-600", textColor: "text-white" },
    { title: "Create Account", description: "Sed cursus turpis vitae tortor donec eaque ipsa quaeab illo.", color: "bg-red-500", textColor: "text-white" },
  ];

  return (
    <section className="py-12 bg-white text-center">
      {/* Section Heading */}
      <div className="max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">What We Do</h2>
        <p className="text-gray-500 mt-2">
          Cum doctus civibus efficiantur in imperdiet deterruisset.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className={`p-15 rounded-lg ${service.color} ${service.textColor} shadow-lg transition-transform transform hover:scale-105 cursor-pointer`}
          >
            <div className="flex justify-start">
              <div className="bg-white p-2 rounded-md">
                <FaPlus className="text-lg text-gray-700" />
              </div>
            </div>
            <h3 className="text-lg font-bold mt-4 text-left">{service.title}</h3>
            <p className="text-sm mt-2 text-left">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
