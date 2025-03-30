"use client";
import React from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import { usePathname } from "next/navigation";
import Footer from "./Footer";
import { Provider } from "react-redux";
import { store } from "../store/store";

export default function MainLayout({ children }) {
  const pathname = usePathname(); // Get the current route path

  // Hide layout on login, register, or course details page
  const hideLayout =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/my-courses/") ||
    pathname.startsWith("/course-detail") ||
    pathname.startsWith("/user-dashboard") 
    // Hide for course details page
   ||    pathname.startsWith("/courses/"); // Hide for course details page

   const showNavbar=pathname.startsWith("/course-detail") || pathname.startsWith("/courses/") || pathname.startsWith("/user-dashboard") ;  
  return (
    <>
    <Provider store={store}>
      {(!hideLayout || showNavbar) && <Navbar />}
      {!hideLayout && pathname !== "/home" && <Header />}

      {children}

      {!hideLayout && <Footer />}
      </Provider>
    </>
  );
}
