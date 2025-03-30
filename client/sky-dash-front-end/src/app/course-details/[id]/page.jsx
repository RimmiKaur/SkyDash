"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";

export default function CourseDetails() {
  const pathname = usePathname();
  const id = pathname.split("/").pop(); // Extract course ID from URL
  const router = useRouter();
  const token = Cookies.get("token");

  const [course, setCourse] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const [openSection, setOpenSection] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  // Local state to track completed videos for this course (array of video IDs)
  const [completedVideos, setCompletedVideos] = useState([]);

  // Fetch course details (including sections & videos)
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/web/course/view-one/${id}`)
        .then((res) => {
          if (res.data.status === 1) {
            const courseData = res.data.data;
            setCourse(courseData);
            // Set first video as default (if available)
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
  }, [id]);

  // Fetch instructor details via team API
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/admin/team/team-member/${id}`)
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
  }, [id]);

  // Toggle a section in the accordion (for video list)
  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  // Helper: Convert a YouTube link to its embed version (if needed)
  const getEmbedUrl = (url) => {
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    return url;
  };

  // Fetch user's order for this course.
  // This API endpoint should return the paid order for the current user for the given course.
  const fetchUserOrder = async (courseId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/web/order/getByCourse/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.status === 1) {
        return res.data.data; // order object
      } else {
        toast.error("Order not found for this course");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user order:", error);
      toast.error("Error fetching user order");
      return null;
    }
  };

  // Calculate total number of videos in the course.
  const totalVideos = () => {
    if (!course || !course.courseSection) return 0;
    return course.courseSection.reduce(
      (acc, section) =>
        acc + (section.sectionVideos ? section.sectionVideos.length : 0),
      0
    );
  };

  // Handle marking a video as completed.
  // Instead of setting progress to 100 immediately, we calculate the percentage.
  const handleMarkCompleted = async (video) => {
    // Check if the video is already marked completed
    if (completedVideos.includes(video._id)) {
      toast.info("This video is already marked as completed");
      return;
    }
    // Add the video's id to the list of completed videos.
    const newCompletedVideos = [...completedVideos, video._id];
    setCompletedVideos(newCompletedVideos);

    // Calculate progress percentage based on completed videos out of total.
    const total = totalVideos();
    const progressPercentage =
      total > 0 ? Math.round((newCompletedVideos.length / total) * 100) : 0;

    try {
      // Fetch the user's order for this course.
      const userOrder = await fetchUserOrder(course._id);
      if (!userOrder) {
        return; // Order not found; perhaps the user hasn't purchased the course.
      }
      const payload = {
        orderId: userOrder._id,
        courseId: course._id,
        progress: progressPercentage,
      };
      const res = await axios.put(
        "http://localhost:8080/web/order/update-progress",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status === 1) {
        toast.success("Progress updated successfully!");
      } else {
        toast.error("Failed to update progress.");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Error updating progress.");
    }
  };

  if (!course) {
    return <p className="text-center text-gray-600">Loading course...</p>;
  }

  // Build the course image URL using the static path or default.
  const staticPath = course.staticPath || "uploads/course";
  const imageURL = `http://localhost:8080/${staticPath}/${course.courseImage}`;

  return (
    <div className="container mx-auto p-8 mt-22 bg-white text-black">
      <ToastContainer />

      {/* Course Title & Category */}
      <h1 className="text-3xl font-bold mb-2">{course.courseName}</h1>
      <p className="text-gray-500 mb-4">{course.courseCategory}</p>

      {/* Top Section: Two-Column Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Main Video Player */}
        <div className="md:w-1/2">
          {currentVideo ? (
            <div className="relative" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={getEmbedUrl(currentVideo)}
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Course Video"
              ></iframe>
            </div>
          ) : (
            <p>No video available.</p>
          )}
        </div>

        {/* Right Column: Video List (Accordion) */}
        <div className="md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Course Videos</h2>
          {course.courseSection.map((section, index) => (
            <div key={index} className="mb-4 border rounded">
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex justify-between items-center p-4 bg-green-700 hover:bg-green-900 text-white rounded-t"
              >
                <span className="font-semibold">{section.sectionTitle}</span>
                <span>{openSection === index ? "▲" : "▼"}</span>
              </button>
              {openSection === index && (
                <div className="p-4">
                  {section.sectionVideos && section.sectionVideos.length > 0 ? (
                    <ul className="space-y-2">
                      {section.sectionVideos.map((video, idx) => (
                        <li key={idx} className="flex justify-between items-center">
                          <span
                            className="cursor-pointer hover:text-blue-600"
                            onClick={() => setCurrentVideo(video.videoLink)}
                          >
                            {video.videoTopic}
                          </span>
                          <button
                            onClick={() => handleMarkCompleted(video)}
                            className="text-sm text-green-600 hover:underline"
                          >
                            Mark as Completed
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No videos available in this section.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Tabs for Additional Details */}
      <div className="mt-10">
        <div className="flex space-x-8 pb-2">
          {["about", "outcomes", "instructor"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 ${
                activeTab === tab
                  ? "border-b-2 border-green-600 text-green-600 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "about" && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">About This Course</h2>
            <p className="text-gray-700">{course.courseDescription}</p>
          </div>
        )}

        {activeTab === "outcomes" && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Course Outcomes</h2>
            <p className="text-gray-700">
              This course will equip you with advanced skills in {course.courseName}.
            </p>
          </div>
        )}

        {activeTab === "instructor" && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Course Instructor(s)</h2>
            {instructors && instructors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {instructors.map((instr, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <img
                      src={`http://localhost:8080/uploads/team/${instr.teamImage}`}
                      alt={instr.teamMemberName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <h3 className="text-lg font-semibold mt-2">
                      {instr.teamMemberName}
                    </h3>
                    <p className="text-gray-600 text-sm text-center">
                      {instr.teamDescription}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No instructor available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
