"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FaRegUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa";


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userData = useSelector((store) => store.userStore.userDetails);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setShowMobileMenu((prev) => !prev);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between p-6 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-2xl text-black" : "bg-transparent text-white"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Link href="/home">
          <Image src="/images/logo.png" width={150} height={100} alt="Logo" />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8 text-xl font-medium">
        <Link href="/home" className="hover:text-gray-500">Home</Link>
        <Link href="/courses" className="hover:text-gray-500">Courses</Link>
        <Link href="/about-us" className="hover:text-gray-500">About Us</Link>
        <Link href="/team" className="hover:text-gray-500">Team</Link>
        <Link href="/contact" className="hover:text-gray-500">Contact</Link>
      </div>

      {/* Desktop User Options */}
      <div className="hidden md:flex space-x-4 text-xl">
        {userData ? (
          <>
          <Link href="/checkout"  className="hover:underline mt-1">
                    <FaCartArrowDown />
  
                  </Link>
            <Link href="/user-dashboard/account" className="flex items-center gap-2 cursor-pointer">
              <FaRegUserCircle className="w-5 h-5 sm:w-[22px] sm:h-7" />
            </Link>
            <Link href="/my-courses" className="flex items-center cursor-pointer text-[16px] mt-1">
              My Courses
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-gray-500">Log in</Link>
            <Link href="/login?type=register" className="hover:text-gray-500">Register</Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMobileMenu} className="focus:outline-none">
          {showMobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="absolute top-full left-0 w-full bg-white text-black shadow-md md:hidden">
          <div className="flex flex-col space-y-4 p-4">
            <Link href="/home" onClick={() => setShowMobileMenu(false)} className="hover:underline">Home</Link>
            <Link href="/courses" onClick={() => setShowMobileMenu(false)} className="hover:underline">Courses</Link>
            <Link href="/about-us" onClick={() => setShowMobileMenu(false)} className="hover:underline">About Us</Link>
            <Link href="/team" onClick={() => setShowMobileMenu(false)} className="hover:underline">Team</Link>
            <Link href="/contact" onClick={() => setShowMobileMenu(false)} className="hover:underline">Contact</Link>
            <div className="border-t pt-4">
              {userData ? (
                <div className="">
                  <Link href="/checkout"  className="hover:underline">
                    Cart
                  </Link>
                  <Link href="/user-dashboard/account" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-2">
                    Account
                  </Link>
                  <Link href="/my-courses" onClick={() => setShowMobileMenu(false)} className="hover:underline">
                    My Courses
                  </Link>
                  
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/login" onClick={() => setShowMobileMenu(false)} className="hover:underline">Log in</Link>
                  <Link href="/login?type=register" onClick={() => setShowMobileMenu(false)} className="hover:underline">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
