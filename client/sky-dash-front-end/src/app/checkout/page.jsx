"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";

export default function ShoppingCart() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Recently Accessed");
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const token = Cookies.get("token") || "";

  // Fetch orders from the API on component mount.
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8080/web/order/view", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.status === 1) {
          // Set orders as returned from API.
          setOrders(res.data.data);
          setFilteredOrders(res.data.data);
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

  // Calculate total price only from order items with pending payment (paymentStatus !== "2")
  const totalPrice =
    orders.reduce((acc, order) => {
      const orderTotal = order.orderItems
        .filter((item) => item.paymentStatus !== "2")
        .reduce((sum, item) => sum + Number(item.coursePrice), 0);
      return acc + orderTotal;
    }, 0) - discount;

  // Remove an entire order.
  const removeOrder = async (orderId) => {
    try {
      const res = await axios.delete(`http://localhost:8080/web/order/delete/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status === 1) {
        toast.success("Order removed successfully");
        setOrders(orders.filter((order) => order._id !== orderId));
      } else {
        toast.error("Failed to remove order");
      }
    } catch (error) {
      console.error("Error removing order:", error);
      toast.error("Error removing order");
    }
  };

  // Load Razorpay script dynamically.
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle payment via Razorpay.
  const handlePayment = async () => {
    if (orders.length === 0) {
      toast.error("No orders found in cart.");
      return;
    }
    const activeOrderId = orders[0]._id;
    const resScript = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!resScript) {
      toast.error("Failed to load Razorpay SDK. Please check your connection.");
      return;
    }
    try {
      const orderRes = await axios.post(
        "http://localhost:8080/web/order/create-razorpay",
        { orderId: activeOrderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (orderRes.data.status !== 1) {
        toast.error("Failed to create Razorpay order");
        return;
      }
      const { id: razorpayOrderId, amount, currency } = orderRes.data.data;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Your Company Name",
        description: "Course Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const updateRes = await axios.put(
              "http://localhost:8080/web/order/update-payment",
              {
                orderId: activeOrderId,
                razorpayPayment: response.razorpay_payment_id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (updateRes.data.status === 1) {
              toast.success("Payment successful!");
              router.push("/my-courses");
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (error) {
            console.error("Error updating payment:", error);
            toast.error("Payment failed. Please try again.");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error during payment:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-6">Your Orders</h1>

      {/* Sorting & Filtering */}
      <div className="flex justify-between mt-6 mb-6">
        <select
          className="bg-white text-black border border-black px-4 py-2"
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
          className="bg-white text-black border border-black px-4 py-2"
        />
      </div>

      {/* Orders List */}
      {filteredOrders.map((order) => (
        <div key={order._id} className="border p-4 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Order Date: {new Date(order.orderDate).toLocaleDateString()}
            </p>
            <button
              onClick={() => removeOrder(order._id)}
              className="text-red-500 text-sm"
            >
              Remove Order
            </button>
          </div>
          {/* List each order item, but filter out items with paymentStatus "2" */}
          {order.orderItems
            .filter((item) => item.paymentStatus !== "2")
            .map((item, idx) => {
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
                      <h2 className="text-lg font-semibold">{item.courseName}</h2>
                      <p className="text-sm text-gray-600">Price: ₹{item.coursePrice}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ))}

      {/* Total Price & Payment Button */}
      <div className="mt-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold">Total:</h2>
        <p className="text-2xl font-bold text-blue-600">₹{totalPrice}</p>
        <button
          onClick={handlePayment}
          className="bg-purple-600 text-white px-6 py-2 mt-4 rounded-lg w-full hover:bg-purple-700"
        >
          Proceed to Payment &rarr;
        </button>
      </div>

      {/* Coupon Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Promotions</h2>
        <div className="flex mt-2">
          <input
            type="text"
            placeholder="Enter Coupon"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="border px-4 py-2 w-full"
          />
          <button
            onClick={() => {
              if (coupon.toLowerCase() === "keeplearning") {
                setDiscount(500);
              } else {
                alert("Invalid Coupon Code!");
              }
            }}
            className="bg-purple-600 text-white px-4"
          >
            Apply
          </button>
        </div>
        {discount > 0 && (
          <p className="text-green-500 mt-2">Coupon Applied: ₹{discount} OFF</p>
        )}
      </div>
    </div>
  );
}
