"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";

export default function Checkout() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiMethod, setUpiMethod] = useState("qr");
  const [orderId, setOrderId] = useState(""); // Set this when order is created in your cart
  const totalPrice = 12415; // Example total price
  const token = Cookies.get("token") || "";

  // Function to load Razorpay script
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    // Load Razorpay script
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // First, create a Razorpay order via our API
    try {
      // Ensure orderId exists (it should be created when user added courses to cart)
      if (!orderId) {
        toast.error("Order not found. Please add courses to your cart.");
        return;
      }
      const orderRes = await axios.post(
        "http://localhost:8080/web/order/create-razorpay",
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (orderRes.data.status !== 1) {
        toast.error("Failed to create Razorpay order");
        return;
      }
      const { id: razorpayOrderId, amount, currency } = orderRes.data.data;

      // Options for Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Your Company Name",
        description: "Course Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          // On successful payment, update the order payment details.
          try {
            const updateRes = await axios.put(
              "http://localhost:8080/web/order/update-payment",
              {
                orderId,
                razorpayPayment: response.razorpay_payment_id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (updateRes.data.status === 1) {
              toast.success("Payment successful!");
              router.push("/payment-success");
            } else {
              toast.error("Payment failed. Please try again.");
            }
          } catch (error) {
            console.error("Error updating payment:", error);
            toast.error("Payment failed. Please try again.");
          }
        },
        prefill: {
          name: "User Name", // Replace with user data if available
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
    <div className="mx-auto p-10 bg-white text-black px-52">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Billing Address */}
      <div className="border-b pb-6">
        <h2 className="text-lg font-semibold">Billing address</h2>
        <div className="flex mt-3 space-x-4">
          <select className="border px-4 py-2 w-1/2 rounded-md">
            <option>India</option>
            <option>USA</option>
            <option>Canada</option>
          </select>
          <select className="border px-4 py-2 w-1/2 rounded-md">
            <option>Chhattisgarh</option>
            <option>Maharashtra</option>
            <option>Delhi</option>
          </select>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Taxes may apply based on location.
        </p>
      </div>

      {/* Payment Method */}
      <div className="border-b py-6">
        <h2 className="text-lg font-semibold">Payment method</h2>

        {/* UPI */}
        <div className="flex items-center mt-3">
          <input
            type="radio"
            name="payment"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={() => setPaymentMethod("upi")}
            className="mr-2"
          />
          <label className="font-medium">UPI</label>
        </div>
        {paymentMethod === "upi" && (
          <div className="ml-6 mt-2 flex space-x-3">
            <button
              className={`px-4 py-2 rounded-md ${
                upiMethod === "qr" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setUpiMethod("qr")}
            >
              QR Code
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                upiMethod === "id" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setUpiMethod("id")}
            >
              Enter UPI ID
            </button>
          </div>
        )}

        {/* Cards */}
        <div className="flex items-center mt-4">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
            className="mr-2"
          />
          <label className="font-medium">Cards</label>
          <div className="ml-4 flex space-x-2">
            <img src="/visa.png" alt="Visa" className="h-6" />
            <img src="/mastercard.png" alt="MasterCard" className="h-6" />
            <img src="/amex.png" alt="Amex" className="h-6" />
          </div>
        </div>

        {/* Net Banking */}
        <div className="flex items-center mt-4">
          <input
            type="radio"
            name="payment"
            value="netbanking"
            checked={paymentMethod === "netbanking"}
            onChange={() => setPaymentMethod("netbanking")}
            className="mr-2"
          />
          <label className="font-medium">Net Banking</label>
        </div>

        {/* Mobile Wallets */}
        <div className="flex items-center mt-4">
          <input
            type="radio"
            name="payment"
            value="wallet"
            checked={paymentMethod === "wallet"}
            onChange={() => setPaymentMethod("wallet")}
            className="mr-2"
          />
          <label className="font-medium">Mobile Wallets</label>
        </div>
      </div>

      {/* Order Summary */}
      <div className="py-6">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <p className="text-gray-600">Original Price: ₹{totalPrice}</p>
        <p className="text-xl font-bold mt-2">Total: ₹{totalPrice}</p>
      </div>

      {/* Proceed Button */}
      <button
        onClick={handlePayment}
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
      >
        Proceed to Payment
      </button>

      {/* Refund Policy */}
      <p className="text-sm text-gray-500 mt-4 text-center">
        30-Day Money-Back Guarantee
      </p>
    </div>
  );
}
