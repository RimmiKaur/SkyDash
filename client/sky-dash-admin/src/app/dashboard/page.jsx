"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Example API endpoints – adjust these URLs as needed
  const ordersApiUrl = "http://localhost:8080/web/order/view-dashboard";
  const usersApiUrl = "http://localhost:8080/web/user/view-dashboard";

  // Fetch orders and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([
          axios.get(ordersApiUrl),
          axios.get(usersApiUrl),
        ]);
        if (ordersRes.data.status === 1) {
          setOrders(ordersRes.data.data);
        } else {
          toast.error("Failed to fetch orders");
        }
        if (usersRes.data.status === 1) {
          setUsers(usersRes.data.data);
        } else {
          toast.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    };

    fetchData();
  }, []);

  // Group orders by user.
  useEffect(() => {
    // Group orders by orderUser._id
    const grouped = orders.reduce((acc, order) => {
      const userId = order.orderUser?._id;
      if (!userId) return acc; // skip if no user info
      if (!acc[userId]) {
        acc[userId] = {
          orderUser: order.orderUser,
          totalAmount: 0,
          courses: [],
          orderCount: 0,
          orderIds: [],
        };
      }
      // Sum up orderItems for this order
      const orderTotal = order.orderItems.reduce(
        (sum, item) => sum + Number(item.coursePrice),
        0
      );
      acc[userId].totalAmount += orderTotal;
      // Count distinct courses (by courseId)
      order.orderItems.forEach((item) => {
        const courseId = item.courseId?._id;
        if (courseId && !acc[userId].courses.some(c => c._id.toString() === courseId.toString())) {
          acc[userId].courses.push(item.courseId);
        }
      });
      acc[userId].orderCount += 1;
      acc[userId].orderIds.push(order._id);
      return acc;
    }, {});

    // Convert the grouped object to an array for rendering.
    const groupedArray = Object.values(grouped);
    setGroupedOrders(groupedArray);
  }, [orders]);

  // Prepare data for Bar Chart: Orders by Month
  const computeOrdersByMonth = () => {
    const monthCounts = new Array(12).fill(0);
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.getMonth();
      monthCounts[month] += 1;
    });
    return monthCounts;
  };

  const ordersByMonthData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Orders",
        data: computeOrdersByMonth(),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  // Prepare data for Pie Chart: Revenue by Category
  const computeRevenueByCategory = () => {
    const revenueMap = {};
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (item.courseId) {
          const category = item.courseId.courseCategory || "Other";
          const price = Number(item.coursePrice) || 0;
          if (revenueMap[category]) {
            revenueMap[category] += price;
          } else {
            revenueMap[category] = price;
          }
        }
      });
    });
    return revenueMap;
  };

  const revenueMap = computeRevenueByCategory();
  const revenueByCategoryData = {
    labels: Object.keys(revenueMap),
    datasets: [
      {
        label: "Revenue",
        data: Object.values(revenueMap),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      },
    ],
  };

  return (
    <div className="p-8 mt-16 text-black min-h-screen">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Orders by Month</h2>
          <Bar
            data={ordersByMonthData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Orders by Month" },
              },
            }}
          />
        </div>
        <div className="bg-white shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Revenue by Category</h2>
          <Pie
            data={revenueByCategoryData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Revenue by Category" },
              },
            }}
          />
        </div>
      </div>

      {/* Orders Table (Grouped by User) */}
      <div className="bg-white shadow-md p-4">
        <h2 className="text-2xl font-bold mb-4">Orders Summary</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders Count
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Courses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Revenue
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groupedOrders.map((group) => (
              <tr key={group.orderUser._id}>
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                 
                  <span className="text-sm text-gray-900">{group.orderUser.userEmail}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {group.orderCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {group.courses.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{group.totalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
