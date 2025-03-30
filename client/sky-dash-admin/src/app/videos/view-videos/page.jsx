"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function VideosTable() {
  const [video, setVideo] = useState([]);



  const getSetVideos = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}admin/video/view`)
      .then((response) => {
        if (response.data.status === 1) {
          setVideo(response.data.data);
        } else {
          toast.error("Failed to fetch Video:", response.data.msg);
        }
      })
      .catch((error) => {
        toast.error("Error fetching Video:", error);
      });
  }


  useEffect(() => {
    getSetVideos();

  }, []);



  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/admin/video/delete/${id}`)
      .then(() => {
        toast.success("Deleted Successfully");
        // ✅ Update UI correctly: filter out the deleted course
        setVideo((prevvideo) => prevvideo.filter(video => video._id !== id));
      })
      .catch(() => toast.error("Could not delete"));
  };


  return (
    <div className="mt-16 h-screen p-6 bg-gray-300 text-black shadow-lg rounded-lg">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">Videos</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-white">
            <tr className="text-left">
              <th className="border border-gray-300 p-4 font-semibold">S.no</th>
              <th className="border border-gray-300 p-4 font-semibold">Course Name</th>
              <th className="border border-gray-300 p-4 font-semibold">Course Section</th>
              <th className="border border-gray-300 p-4 font-semibold">Video Topic</th>
              <th className="border border-gray-300 p-4 font-semibold">Video</th>
              <th className="border border-gray-300 p-4 font-semibold">Duration</th>
              <th className="border border-gray-300 p-4 font-semibold">Status</th>
              <th className="border border-gray-300 p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {video.length > 0
              ? video.map((video, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="border border-gray-300 p-4">{index + 1}</td>
                  <td className="border border-gray-300 p-4">
                    {video.courseName?.courseName || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {video.courseSection?.sectionTitle || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-4">{video.videoTopic}</td>
                  <td className="border border-gray-300 p-4">{video.videoLink}</td>
                  <td className="border border-gray-300 p-4">{video.videoDuration}</td>
                  <td
                    className={`border border-gray-300 p-4 font-semibold ${video.videoStatus.toLowerCase() === "active"
                      ? "text-green-600"
                      : "text-red-600"
                      }`}
                  >
                    {video.videoStatus.toUpperCase()}
                  </td>
                  <td className="border border-gray-300 p-4">
                    <div className="flex space-x-2">
                      <Link href={{
                        pathname: `/videos/edit-video`,
                        query: { id: video._id },
                      }}>
                        <button className="bg-green-500 text-white px-4 py-1  hover:bg-green-600">

                          Edit
                        </button>
                      </Link>
                      <button className="bg-red-500 text-white px-4 py-1  hover:bg-red-600"
                        onClick={() => handleDelete(video._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              : (
                <tr key={1}>
                  <td colSpan="8" className="border border-gray-300 p-4 text-center">
                    No Data
                  </td>
                </tr>
              )}


          </tbody>
        </table>
      </div>
    </div>
  );
}
