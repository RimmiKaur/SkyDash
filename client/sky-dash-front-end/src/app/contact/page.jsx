"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ContactUs() {
  // State variables for the form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/admin/enquiry/add", {
        name,
        email,
        subject,
        message,
      });
      if (res.data.status === 1) {
        toast.success("Enquiry submitted successfully!");
        // Clear form fields after successful submission
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        toast.error(res.data.msg || "Failed to submit enquiry");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Error submitting enquiry");
    }
  };

  return (
    <section className="p-26 text-black px-6 md:px-20 bg-white">
      <ToastContainer />
      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center mb-12">
        {/* Location */}
        <div>
          <span className="text-3xl">📍</span>
          <h3 className="text-xl font-semibold mt-2">Our Location</h3>
          <p className="text-gray-600">
            Collin Street West, Victor 8007, Australia.
          </p>
        </div>
        {/* Phone Number */}
        <div>
          <span className="text-3xl">📞</span>
          <h3 className="text-xl font-semibold mt-2">Our Numbers</h3>
          <p className="text-gray-600">Mobile: (+096) 468 235</p>
        </div>
        {/* Email */}
        <div>
          <span className="text-3xl">📧</span>
          <h3 className="text-xl font-semibold mt-2">Our Email</h3>
          <p className="text-gray-600">info@edumy.com</p>
        </div>
      </div>

      {/* Contact Form & Google Map */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Google Map */}
        <div className="overflow-hidden shadow-lg">
          <iframe
            title="Google Map"
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.8086302470046!2d73.00879027426533!3d26.282969277009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418db69a7d48f5%3A0x6c30a8fdfb1104b4!2sWsCube%20Tech%20-%20Upskilling%20Bharat!5e0!3m2!1sen!2sin!4v1709740215748!5m2!1sen!2sin"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Send a Message</h3>
          <p className="text-gray-500 text-sm mb-6">
            Ex quem dicta delicata usu, zril vocibus maiestatis in qui.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border focus:outline-none focus:border-blue-500"
            />
            <textarea
              rows="4"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border focus:outline-none focus:border-blue-500"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 hover:bg-blue-700 transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
