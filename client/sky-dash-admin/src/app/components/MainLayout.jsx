"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import LeftSideBar from "../Components/LeftSideBar";
import Navbar from "../Components/Navbar";

export default function MainLayout({ children }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // Show Sidebar and Navbar only if NOT on the login page
  const showLayout = pathname !== "/";

  return (
    <div className="flex bg-gray-300">
      {showLayout && (
        <>
          {/* Navbar */}
          <Navbar toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)} />

          {/* Sidebar */}
          <div className={`transition-all duration-300 ${isSidebarCollapsed ? "w-20" : "w-64"}`}>
            <LeftSideBar isSidebarCollapsed={isSidebarCollapsed} />
          </div>
        </>
      )}
      {/* Main Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
