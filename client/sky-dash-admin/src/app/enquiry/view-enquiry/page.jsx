"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [answer, setAnswer] = useState("");

  // Fetch enquiries on mount
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await axios.get("http://localhost:8080/admin/enquiry/view");
        if (res.data.status === 1) {
          setEnquiries(res.data.data);
        } else {
          toast.error("Failed to fetch enquiries");
        }
      } catch (error) {
        console.error("Error fetching enquiries:", error);
        toast.error("Error fetching enquiries");
      }
    };

    fetchEnquiries();
  }, []);

  // Handle answer submission for an enquiry
  const handleAnswerSubmit = async (enquiryId) => {
    try {
      const res = await axios.put("http://localhost:8080/admin/enquiry/update", {
        enquiryId,
        answer,
      });
      if (res.data.status === 1) {
        toast.success("Enquiry answered successfully and email sent!");
        // Update the local state to mark the enquiry as completed and store the answer.
        setEnquiries((prev) =>
          prev.map((enq) =>
            enq._id === enquiryId
              ? { ...enq, answer: res.data.data.answer, status: "completed" }
              : enq
          )
        );
        setAnswer("");
        setSelectedEnquiry(null);
      } else {
        toast.error("Failed to update enquiry");
      }
    } catch (error) {
      console.error("Error updating enquiry:", error);
      toast.error("Error updating enquiry");
    }
  };

  return (
    <div className="p-8 bg-gray-300 mt-16 min-h-screen text-black">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Admin Enquiries Dashboard</h1>
      <table className="min-w-full border-collapse border border-black divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 border border-black text-left text-xs font-medium uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 border border-black text-left text-xs font-medium uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 border border-black text-left text-xs font-medium uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 border border-black text-left text-xs font-medium uppercase tracking-wider">Subject</th>
            <th className="px-6 py-3 border border-black text-left text-xs font-medium uppercase tracking-wider">Message</th>
            <th className="px-6 py-3 border border-black text-left text-xs font-medium uppercase tracking-wider">Answer</th>
            <th className="px-6 py-3 border border-black text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 border border-black text-left text-xs font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {enquiries.map((enquiry) => (
            <tr key={enquiry._id}>
              <td className="px-6 py-4 border border-black whitespace-nowrap text-sm text-gray-900">
                {enquiry._id.slice(0, 6)}
              </td>
              <td className="px-6 py-4 border border-black whitespace-nowrap text-sm text-gray-900">
                {enquiry.name}
              </td>
              <td className="px-6 py-4 border border-black whitespace-nowrap text-sm text-gray-900">
                {enquiry.email}
              </td>
              <td className="px-6 py-4 border border-black whitespace-nowrap text-sm text-gray-900">
                {enquiry.subject}
              </td>
              <td className="px-6 py-4 border border-black whitespace-nowrap text-sm text-gray-900">
                {enquiry.message}
              </td>
              <td className="px-6 py-4 border border-black whitespace-nowrap text-sm text-gray-900">
                {enquiry.answer || "Not Answered"}
              </td>
              <td className={`px-6 py-4 border border-black whitespace-nowrap text-sm text-gray-900 ${enquiry.status === "completed" ? "text-green-600" : "text-red-500"}`}>
                {enquiry.status === "completed" ? "Completed" : "Pending"}
              </td>
              <td className="px-6 py-4 border border-black whitespace-nowrap text-sm text-gray-900">
                {enquiry.status !== "completed" && (
                  <button
                    onClick={() => setSelectedEnquiry(enquiry)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md"
                  >
                    Answer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEnquiry && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h2 className="text-xl font-bold mb-2">Answer Enquiry</h2>
          <p>
            <strong>Subject:</strong> {selectedEnquiry.subject}
          </p>
          <p className="mb-4">
            <strong>Message:</strong> {selectedEnquiry.message}
          </p>
          <textarea
            rows="4"
            placeholder="Write your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full border p-2 rounded-md"
          ></textarea>
          <button
            onClick={() => handleAnswerSubmit(selectedEnquiry._id)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Submit Answer & Mark as Completed
          </button>
        </div>
      )}
    </div>
  );
}
