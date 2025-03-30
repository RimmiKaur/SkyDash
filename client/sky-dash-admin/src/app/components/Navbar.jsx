"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../slice/AdminSlice";

export default function Navbar({ toggleSidebar }) {

  let dispatch = useDispatch()

  let loginData=useSelector((myAllStore)=>{
    return  myAllStore.loginStore.adminDetails
   })  
 
   const router = useRouter();

   useEffect(()=>{
     if(loginData==null){
         router.push("/")
     }
   },[loginData])


   const handleLogout =()=>{
    dispatch(logOut())
   }

  return (
    <nav className="flex fixed top-0 w-full z-10 justify-between items-center py-4 px-6 bg-white shadow-md">
      {/* Left Side: Logo & Menu */}
      <div className="flex items-center space-x-3">
<img src="/images/logo.svg" alt="Skydash Logo" className="h-8" />


        <FaBars
          className="text-2xl text-gray-700 cursor-pointer"
          onClick={toggleSidebar} // Toggles the sidebar state
        />
      </div>

      {/* Right Side: Links */}
      <div className="flex items-center space-x-6">
<p onClick={handleLogout}  className="text-gray-700 hover:text-indigo-600">

          Log Out
        </p>
<a href="/profile" className="font-semibold text-gray-900 hover:text-indigo-600">

          My Profile
        </a>
      </div>
    </nav>
  );
}
