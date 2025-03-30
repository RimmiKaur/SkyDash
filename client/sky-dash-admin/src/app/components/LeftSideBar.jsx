"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { FaBook, FaVideo, FaUserFriends, FaUsers, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import Link from "next/link";

export default function LeftSidebar({ isSidebarCollapsed }) {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (title) => {
    setOpenItem(openItem === title ? null : title);
  };

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3 }}
      className="fixed top-16 p-2 left-0 h-screen bg-white shadow-md overflow-hidden"
    >
      <div className="p-2">
        <SidebarItem title="Courses" icon={<FaBook />} openItem={openItem} toggleItem={toggleItem} isSidebarCollapsed={isSidebarCollapsed} />
        <SidebarItem title="Videos" icon={<FaVideo />} openItem={openItem} toggleItem={toggleItem} isSidebarCollapsed={isSidebarCollapsed} />
        <SidebarItem title="Slides" icon={<FaBook />} openItem={openItem} toggleItem={toggleItem} isSidebarCollapsed={isSidebarCollapsed} />
        <SidebarItem title="Team" icon={<FaUserFriends />} openItem={openItem} toggleItem={toggleItem} isSidebarCollapsed={isSidebarCollapsed} />
        <SidebarItem title="User" icon={<FaUsers />} openItem={openItem} toggleItem={toggleItem} isSidebarCollapsed={isSidebarCollapsed} />
        <SidebarItem title="Enquiry" icon={<FaUsers />} openItem={openItem} toggleItem={toggleItem} isSidebarCollapsed={isSidebarCollapsed} />
      </div>
    </motion.aside>
  );
}

// Sidebar Item Component with Exclusive Open/Close Logic
function SidebarItem({ title, icon, openItem, toggleItem, isSidebarCollapsed }) {
  const isOpen = openItem === title;

  return (
    <div className="mb-2 ">
      <div
        className={`p-3 cursor-pointer flex items-center space-x-2 ${isOpen ? "bg-[#4b49ac] text-white rounded-t-lg" : "bg-white text-black rounded-lg"} ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}
        onClick={() => toggleItem(title)}
      >
        <div className="flex items-center space-x-2">
          {icon}
          {!isSidebarCollapsed && <span>{title}</span>}
        </div>
        {!isSidebarCollapsed && (isOpen ? <FaChevronDown /> : <FaChevronRight />)}
      </div>

      {/* Dropdown Menu with Animation */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`overflow-hidden ${isOpen ? "bg-[#4b49ac] text-white " : ""}`}
      >
        {isOpen && !isSidebarCollapsed && (
          <div className="ml-6 space-y-2 py-2">
            {
              
              title === "User" ||  title === "Enquiry"  ?
              ""
              :
              
              <div className="flex items-center space-x-2 px-4">
              <GoDotFill className="text-white" />
              <Link href={`/${title.toLowerCase()}/add-${title.toLowerCase()}`} className="hover:underline">Add {title}</Link>
            </div>}
            <div className="flex items-center space-x-2 px-4 py-1">
              <GoDotFill className="text-white" />
              <Link href={`/${title.toLowerCase()}/view-${title.toLowerCase()}`} className="hover:underline">View {title}</Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
