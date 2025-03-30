"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import CourseCategories from "../components/CategoryCourses";
import WhatWeDo from "../components/WhatWeDo";
import TopCourses from "../components/TopCourse";
import Teachers from "../components/Teacher";
import Register from "../components/RegisterToGetIt";
import Footer from "../components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HeroSection() {
  // State for slider images and current slide index
  const [sliders, setSliders] = useState([]);
  const [sliderStaticPath, setSliderStaticPath] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Fetch slider data from API
    axios
      .get(`http://localhost:8080/admin/slider/view`)
      .then((res) => {
        if (res.data.status === 1) {
          setSliders(res.data.data);
          setSliderStaticPath(res.data.staticPath || "");
        } else {
          toast.error("Failed to load slider data");
        }
      })
      .catch((error) => {
        console.error("Error loading slider:", error);
        toast.error("Error loading slider data");
      });
  }, []);

  // Handle moving to the previous slide
  const handlePrev = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? sliders.length - 1 : prev - 1
    );
  };

  // Handle moving to the next slide
  const handleNext = () => {
    setCurrentSlide((prev) =>
      (prev + 1) % sliders.length
    );
  };

  return (
    <div className="relative w-full h-screen">
      {/* Background Slider */}
      <div className="absolute inset-0 h-screen">
        {sliders.length > 0 ? (
          <>
          
          <img
            src={`http://localhost:8080/${sliderStaticPath}/${sliders[currentSlide].sliderImage}`}
            alt="Slider Background"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-start px-12 max-w-3xl text-white z-10">
        <h1 className="text-4xl md:text-6xl font-light">{sliders[currentSlide].sliderText}</h1>
      </div>
      </>

        ) : (
          <img
            src="/images/hero-bg.jpg"
            alt="Hero Background"
            className="object-cover w-full h-full"
          />
        )}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Content */}
      
      {/* Slider Controls */}
      <div className="absolute left-10 bottom-100 flex flex-col space-y-4 text-white z-20">
        <button
          className="p-3 bg-gray-700 rounded-full hover:bg-gray-500 transition"
          onClick={handlePrev}
        >
          <FaChevronLeft size={20} />
        </button>
      </div>
      <div className="absolute right-10 bottom-100 flex flex-col space-y-4 text-white z-20">
        <button
          className="p-3 bg-gray-700 rounded-full hover:bg-gray-500 transition"
          onClick={handleNext}
        >
          <FaChevronRight size={20} />
        </button>
      </div>

      {/* Other Sections */}
      <div className="bg-white h-screen"></div>
      <CourseCategories />
      {/* <WhatWeDo /> */}
      <TopCourses />
      <Teachers type={"Teachers"} />
      <Register />
      <Footer />
      <ToastContainer />
    </div>
  );
}
