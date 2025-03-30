"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";

export default function CourseDetails() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop(); // Extract course ID from URL
  const token = Cookies.get("token");
  
  const [course, setCourse] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [activeTab, setActiveTab] = useState("about");
  const [openSection, setOpenSection] = useState(null);
  const [currentVideo, setCurrentVideo] = useState("");
  
  // Base URL from env variables
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/";
  
  // Fetch course details (including sections & videos)
  useEffect(() => {
    if (id) {
      axios
        .get(`${baseURL}web/course/view-one/${id}`)
        .then((res) => {
          if (res.data.status === 1) {
            const courseData = res.data.data;
            setCourse(courseData);
            if (
              courseData.courseSection &&
              courseData.courseSection.length > 0 &&
              courseData.courseSection[0].sectionVideos &&
              courseData.courseSection[0].sectionVideos.length > 0
            ) {
              setCurrentVideo(
                courseData.courseSection[0].sectionVideos[0].videoLink
              );
            }
          } else {
            toast.error("Failed to fetch course details.");
          }
        })
        .catch((error) => {
          console.error("Error fetching course details:", error);
          toast.error("Error fetching course details.");
        });
    }
  }, [id, baseURL]);
  
  // Fetch instructor details
  useEffect(() => {
    if (id) {
      axios
        .get(`${baseURL}admin/team/team-member/${id}`)
        .then((res) => {
          if (res.data.status === 1) {
            setInstructors(res.data.data);
          } else {
            toast.error("Failed to fetch instructor details.");
          }
        })
        .catch((error) => {
          console.error("Error fetching instructors:", error);
          toast.error("Error fetching instructor details.");
        });
    }
  }, [id, baseURL]);
  
  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };
  
  // Helper: Convert a YouTube link to its embed version
  const getEmbedUrl = (url) => {
    return url.includes("watch?v=") ? url.replace("watch?v=", "embed/") : url;
  };
  
  // Handle "Add to Cart" - create/update order
  const handleAddToCart = async () => {
    const userData = Cookies.get("user");
    const parsedUser = userData ? JSON.parse(userData) : null;
    if (!parsedUser || !parsedUser._id) {
      toast.error("User not logged in");
      return;
    }
    const orderDetails = {
      courseId: course._id,
      courseName: course.courseName,
      coursePrice: course.coursePrice,
      orderUser: parsedUser._id,
    };
    try {
      const response = await axios.post(
        `${baseURL}web/order/add`,
        orderDetails,
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
      if (response.data.status === 1) {
        toast.success("Order added to cart successfully!");
        router.push("/checkout");
      } else {
        toast.error(response.data.msg || "Failed to add order to cart.");
      }
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error("Error adding order to cart.");
    }
  };
  
  if (!course) {
    return <p className="text-center text-gray-600">Loading course...</p>;
  }
  
  // Build image URL using staticPath from API or default "uploads/course"
  const staticPath = course.staticPath || "uploads/course";
  const imageURL = `${baseURL}${staticPath}/${course.courseImage}`;
  
  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 bg-white min-h-screen mt-16 text-black">
      <ToastContainer />
      {/* Course Title & Category */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center sm:text-left">
        {course.courseName}
      </h1>
      <p className="text-gray-500 mb-4 text-center sm:text-left">
        {course.courseCategory}
      </p>
  
      {/* Course Image */}
      <div className="relative w-full h-56 mb-6">
        <img
          src={imageURL}
          alt={course.courseName}
          className="w-full h-full object-cover object-center rounded"
        />
      </div>
  
      {/* Price & Add to Cart */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <p className="text-lg font-semibold text-green-600">
          Price: ${course.coursePrice}
        </p>
        <button
          onClick={handleAddToCart}
          disabled={course.coursePrice === 0}
          className={`mt-4 sm:mt-0 px-6 py-3 font-semibold text-white transition ${
            course.coursePrice === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {course.coursePrice === 0 ? "Already Free" : "Add to Cart"}
        </button>
      </div>
  
      {/* Tab Navigation */}
      <div className="border-b mb-6">
        {["about", "outcomes", "courses", "instructor"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-sm sm:text-base ${
              activeTab === tab
                ? "border-b-2 border-green-600 text-green-600 font-semibold"
                : "text-gray-600"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
  
      {/* Tab Content */}
      {activeTab === "about" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">About This Course</h2>
          <p className="text-gray-700 mt-2">{course.courseDescription}</p>
        </div>
      )}
  
      {activeTab === "outcomes" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Course Outcomes</h2>
          <p className="text-gray-700 mt-2">
            This course will equip you with advanced skills in {course.courseName}.
          </p>
        </div>
      )}
  
      {activeTab === "courses" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Course Content</h2>
          {course.courseSection.map((section, index) => (
            <div key={index} className="mb-3 border rounded">
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex justify-between items-center p-3 bg-indigo-200 hover:bg-indigo-300 rounded-t text-sm sm:text-base"
              >
                <span className="font-semibold">{section.sectionTitle}</span>
                <span>{openSection === index ? "▲" : "▼"}</span>
              </button>
              {openSection === index && section.sectionVideos && section.sectionVideos.length > 0 && (
                <ul className="bg-white p-4">
                  {section.sectionVideos.map((video, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center py-2 border-b last:border-none cursor-pointer hover:text-blue-600 text-sm sm:text-base"
                      onClick={() => setCurrentVideo(video.videoLink)}
                    >
                      <span>{video.videoTopic}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">What You'll Learn</h2>
            {course.learn && course.learn.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {course.learn.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Additional course learning details coming soon.</p>
            )}
  
            <h2 className="text-xl font-semibold mt-6 mb-2">Skills You'll Gain</h2>
            {course.courseTags && course.courseTags.length > 0 ? (
              <div className="flex flex-wrap mt-2">
                {course.courseTags.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Skills details coming soon.</p>
            )}
          </div>
        </div>
      )}
  
      {activeTab === "instructor" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Course Instructor(s)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {instructors && instructors.length > 0 ? (
              instructors.map((instr, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <img
                    src={`${baseURL}uploads/team/${instr.teamImage}`}
                    alt={instr.teamMemberName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <h3 className="text-lg font-semibold mt-2">{instr.teamMemberName}</h3>
                  <p className="text-gray-600 text-sm text-center">{instr.teamDescription}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No instructor available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
