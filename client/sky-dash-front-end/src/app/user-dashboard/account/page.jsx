"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logOut } from "@/app/slice/userSlice";

export default function UserDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  // States for settings forms
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = Cookies.get("token") || "";

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/web/user/view", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.status === 1) {
          setUser(res.data.data);
          setProfileName(res.data.data.name || "");
          setProfileEmail(res.data.data.userEmail || "");
        } else {
          toast.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error fetching profile");
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  let dispatch = useDispatch();


  const logingOut = () =>{

      router.push('/home')
      dispatch(logOut());

    
  }

  // Fetch order history
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8080/web/order/view", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.status === 1) {
          setOrders(res.data.data);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error fetching orders");
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Render the main content based on the active tab
  const renderContent = () => {
    if (activeTab === "profile") {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          {user ? (
            <div className="space-y-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("settings");
                }}
              >
                <strong>Name:</strong>{" "}
                {user.name || (
                  <span style={{ color: "red" }}>Update your Name</span>
                )}
              </a>
              <p className="mt-2">
                <strong>Email:</strong> {user.userEmail}
              </p>
              <p>
                <strong>Member Since:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      );
    } else if (activeTab === "orders") {
      // Filter to show only paid orders (paymentStatus "2")
      const paidOrders = orders.filter(
        (order) => order.paymentStatus === "2"
      );
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Order History</h2>
          {paidOrders.length > 0 ? (
            <div className="space-y-4">
              {paidOrders.map((order) => (
                <div key={order._id} className="border p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Order Date:{" "}
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                    {/* Optionally, add a remove button */}
                    {/* <button onClick={() => removeOrder(order._id)} className="text-red-500 text-sm">Remove Order</button> */}
                  </div>
                  {/* List each order item */}
                  {order.orderItems.map((item, idx) => {
                    // course details should be populated in orderItems.courseId
                    const course = item.courseId;
                    const image =
                      course && course.courseImage
                        ? `http://localhost:8080/uploads/course/${course.courseImage}`
                        : "http://localhost:8080/uploads/course/default.png";
                    const progressValue = item.progress || 0;
                    return (
                      <div
                        key={idx}
                        onClick={() =>
                          router.push(
                            `/course-details/${course ? course._id : item.courseId}`
                          )
                        }
                        className="border-b py-4 flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Course Image */}
                          <div className="relative w-16 h-16 border rounded overflow-hidden">
                            <img
                              src={image}
                              alt={item.courseName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold">
                              {item.courseName}
                            </h2>
                            <p className="text-sm text-gray-600">
                              Price: ₹{item.coursePrice}
                            </p>
                            {/* Progress Bar */}
                            <div className="mt-2">
                              <div className="h-2 bg-gray-700 rounded-full">
                                <div
                                  className="h-2 bg-blue-500 rounded-full"
                                  style={{ width: `${progressValue}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">
                                {progressValue}% complete
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      );
    } else if (activeTab === "settings") {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
          {/* Update Profile Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">
              Update Profile Details
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await axios.put(
                    "http://localhost:8080/web/user/update",
                    { userId: user._id, name: profileName, userEmail: profileEmail },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  if (res.data.status === 1) {
                    toast.success("Profile updated successfully");
                    setUser(res.data.data);
                  } else {
                    toast.error("Failed to update profile");
                  }
                } catch (error) {
                  console.error("Error updating profile:", error);
                  toast.error("Error updating profile");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Change Password Section */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Change Password</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (newPassword !== confirmPassword) {
                  toast.error("New password and confirmation do not match");
                  return;
                }
                try {
                  const res = await axios.put(
                    "http://localhost:8080/web/user/change-password",
                    { userId: user._id, currentPassword, newPassword },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  if (res.data.status === 1) {
                    toast.success("Password changed successfully");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  } else {
                    toast.error(res.data.msg || "Failed to change password");
                  }
                } catch (error) {
                  console.error("Error changing password:", error);
                  toast.error("Error changing password");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Change Password
              </button>
            </form>

            <button
                className={`w-full mt-2 text-left font-bold text-2xl text-red-500 cursor-pointer
                }`}
                onClick={() => logingOut() 
                }
              >Log out
              </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen mt-22 bg-gray-100 text-black p-8">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-8">User Dashboard</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 p-4 bg-white shadow-md border rounded">
          <ul className="space-y-4">
            <li>
              <button
                className={`w-full text-left ${
                  activeTab === "profile"
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left ${
                  activeTab === "orders"
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveTab("orders")}
              >
                Order History
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left ${
                  activeTab === "settings"
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </button>
            </li>
            
          </ul>
        </div>
        {/* Main Content */}
        <div className="flex-grow p-4 bg-white shadow-md border rounded">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
