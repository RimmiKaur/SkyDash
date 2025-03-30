"use client";
import React, { useEffect, useState } from "react";

export default function Register() {
  // State for countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 52,
    hours: 4,
    minutes: 52,
    seconds: 52,
  });

  // Countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
          } else if (days > 0) {
            days--;
            hours = 23;
            minutes = 59;
            seconds = 59;
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#0A1C61] text-white py-16 px-4 md:py-36 md:px-6">
      <div className="max-w-7xl mx-auto relative grid gap-10 z-10 md:grid-cols-2">
        {/* Background Image */}
        <img
          src="/images/register.png"
          alt="Background decoration"
          className="absolute w-40 sm:w-64 md:w-80 z-[-1] blur-sm"
        />

        {/* Left Side - Countdown & Heading */}
        <div className="flex flex-col justify-center">
          <h3 className="text-sm uppercase text-gray-300">
            Get 100 Online Courses for Free
          </h3>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
            REGISTER TO GET IT
          </h2>

          {/* Countdown Timer */}
          <div className="mt-6 flex justify-start space-x-4">
            {Object.entries(timeLeft).map(([unit, value], index) => (
              <div
                key={index}
                className="border-2 border-white w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 py-2 sm:py-3 md:py-4 rounded-lg text-center"
              >
                <p className="text-xl sm:text-2xl md:text-3xl font-semibold">
                  {value}
                </p>
                <p className="text-xs sm:text-sm md:text-base uppercase">
                  {unit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Newsletter Signup Form */}
        <div className="flex flex-col justify-center">
          <h3 className="text-sm uppercase text-gray-300">
            SIGNUP TO NEWSLETTER TO GET IT
          </h3>
          <h2 className="text-xl sm:text-2xl font-semibold mt-2">
            THE COMPLETE WEB DEVELOPER COURSE
          </h2>

          {/* Form */}
          <form className="mt-6 space-y-4">
            <div>
              <label className="block text-sm mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full border-b-2 border-white bg-transparent p-2 focus:outline-none text-white placeholder-gray-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full border-b-2 border-white bg-transparent p-2 focus:outline-none text-white placeholder-gray-300"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-4 border-2 border-white px-6 py-2 rounded-full hover:bg-white hover:text-blue-900 transition"
              onClick={(e)=>{
                e.preventDefault()
              }}
            >
              Get it Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
