"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";

export default function MyLearning() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Recently Accessed");
  const token = Cookies.get("token") || "";

  // Fetch orders from the API on component mount.
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8080/web/order/view", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.status === 1) {
          // Only show orders that have at least one orderItem with paymentStatus "2" (paid)
          const paidOrders = res.data.data.filter((order) =>
            order.orderItems.some((item) => item.paymentStatus === "2")
          );
          setOrders(paidOrders);
          setFilteredOrders(paidOrders);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error fetching orders");
      }
    };
    if (token) fetchOrders();
  }, [token]);

  // Filter orders based on search query across orderItems' courseName.
  useEffect(() => {
    const filtered = orders.filter((order) =>
      order.orderItems.some((item) =>
        item.courseName.toLowerCase().includes(search.toLowerCase())
      )
    );
    setFilteredOrders(filtered);
  }, [search, orders]);

  // Navigate to course detail page using the courseId from an order item.
  const handleCourseCard = (courseId) => {
    router.push(`/course-details/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-6">My Courses</h1>

      {/* Sorting & Filtering */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <select
          className="bg-white text-black border border-black px-4 py-2 rounded-md"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option>Recently Accessed</option>
          <option>Most Progress</option>
        </select>
        <input
          type="text"
          placeholder="Search my courses"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white text-black border border-black px-4 py-2 rounded-md w-full sm:w-auto"
        />
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-2 md:grid-cols-1  text-black mt-8">
        {filteredOrders.map((order) => (
          <div key={order._id} className=" p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              
            </div>
            {/* List each order item that is not pending (paymentStatus !== "1") */}
            {order.orderItems
              .filter((item) => item.paymentStatus !== "1")
              .map((item, idx) => {
                // Using populated course details from orderItems.courseId.
                const course = item.courseId;
                const image =
                  course && course.courseImage
                    ? `http://localhost:8080/uploads/course/${course.courseImage}`
                    : "http://localhost:8080/uploads/course/default.png";
                return (
                  <div
                    key={idx}
                    onClick={() =>
                      handleCourseCard(course ? course._id : item.courseId)
                    }
                    className="border p-2 m-2 py-4 flex justify-between items-center cursor-pointer hover:shadow transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Course Image */}
                      <div className="relative w-40 h-30 border rounded overflow-hidden">
                        <img
                          src={image}
                          alt={item.courseName}
                          className="w-full h-full"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">{item.courseName}</h2>
                        <p className="text-sm text-gray-600">
                          Price: ₹{item.coursePrice}
                        </p>
                        {/* Progress Bar */}
                        <div className="mt-2">
                          <div className="h-2 bg-gray-700 rounded-full w-100">
                            <div
                              className="h-2 bg-blue-500 rounded-full"
                              style={{ width: `${item.progress || 0}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {item.progress || 0}% complete
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
    </div>
  );
}
