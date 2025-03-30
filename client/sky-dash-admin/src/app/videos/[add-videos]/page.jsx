"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function VideoForm() {
  const [videoStatus, setVideoStatus] = useState("active");
  const [courseName, setCourseName] = useState([]);
  const [courseSections, setCourseSection] = useState([]);
  const [selectedCourseName, setSelectedCourseName] = useState(""); // Store selected courseName
  const [videoTopic, setVideoTopic] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedCourseSectionID, setSelectedCourseSectionID] = useState("");

  const courseNameRef = useRef(null);
  const courseSectionRef = useRef(null);
  const formRef = useRef(null); // Reference to the form element

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const getSetcourseName = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}admin/video/course-name`)
      .then((res) => {
        if (res.data.status === 1) {
          setCourseName(res.data.data);
        } else {
          console.error("Failed to fetch Course names:", res.data.msg);
        }
      })
      .catch((error) => {
        console.error("Error fetching Course names:", error);
      });
  };

  const getSetcourseSection = () => {
    if (!selectedCourseName) return; // Ensure a course is selected before making the request

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}admin/video/course-section/${selectedCourseName}`
      )
      .then((res) => {
        if (res.data.status === 1) {
          console.log(
            "Fetched Course Sections:",
            res.data.data.courseSection
          );
          setCourseSection(res.data.data.courseSection);
        } else {
          console.error("Failed to fetch Course Sections:", res.data.msg);
        }
      })
      .catch((error) => {
        console.error("Error fetching Course Sections:", error);
      });
  };

  useEffect(() => {
    getSetcourseSection();
  }, [selectedCourseName]); // Fetch sections whenever selectedCourseName changes

  useEffect(() => {
    getSetcourseName();
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}admin/video/view-one/${id}`)
        .then((res) => {
          if (res.data.status === 1) {
            const video = res.data.data;
            setVideoTopic(video.videoTopic);
            setVideoDuration(video.videoDuration);
            setVideoLink(video.videoLink);
            setVideoDescription(video.videoDescription);
            setVideoStatus(video.videoStatus);
            // Set the state with the correct IDs instead of changing the option text
            setSelectedCourseName(video.courseName._id);
            setSelectedCourseSectionID(video.courseSection._id);
          } else {
            toast.error("Failed to fetch video details.");
          }
        })
        .catch((error) => {
          console.error("Error fetching video details:", error);
          toast.error("Error fetching video details.");
        });
    }
  }, [id]);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Instead of direct submission, show the confirmation modal
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  // Actual submission function using form ref
  const submitVideo = async () => {
    const formData = new FormData(formRef.current);
    formData.set("videoTopic", videoTopic);
    formData.set("videoDuration", videoDuration);
    formData.set("videoLink", videoLink);
    formData.set("videoDescription", videoDescription);
    formData.set("videoStatus", videoStatus);
    formData.set("courseName", selectedCourseName);

    if (!id) {
      try {
        let response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}admin/video/add`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.data.status === 1) {
          toast.success(response.data.msg);
        } else {
          toast.error(response.data.msg || "Something went wrong!");
        }
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Video not added successfully!");
      }
    } else {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}admin/video/update/${id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((res) => {
          toast.success(res.data.msg);
        });
    }
  };

  // Modal handlers
  const confirmSubmit = () => {
    setShowModal(false);
    submitVideo();
  };

  const cancelSubmit = () => {
    setShowModal(false);
  };

  // File change handler
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div className="mt-16 p-6 pb-8 min-h-screen bg-gray-100 text-black px-20 mx-auto shadow-lg">
      <ToastContainer />
      <form ref={formRef} onSubmit={handleFormSubmit}>
        <h1 className="text-2xl font-semibold mb-4">Video</h1>

        {/* Course Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="courseName">
            Course Name
          </label>
          <select
            ref={courseNameRef}
            name="courseName"
            id="courseName"
            className="w-full border p-2 focus:ring-2 focus:ring-indigo-500"
            value={selectedCourseName}
            onChange={(e) => setSelectedCourseName(e.target.value)}
          >
            <option value="">--Select Course Name--</option>
            {courseName.length > 0 ? (
              courseName.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.courseName}
                </option>
              ))
            ) : (
              <option disabled>No Courses Found</option>
            )}
          </select>
        </div>

        {/* Course Section */}
        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="courseSection">
            Course Section
          </label>
          <select
            name="courseSection"
            id="courseSection"
            className="w-full border p-2 focus:ring-2 focus:ring-indigo-500"
            value={selectedCourseSectionID}
            onChange={(e) => setSelectedCourseSectionID(e.target.value)}
          >
            <option value="">--Select Course Section--</option>
            {courseSections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.sectionTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Video Topic */}
        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="videoTopic">
            Video Topic
          </label>
          <input
            type="text"
            name="videoTopic"
            id="videoTopic"
            className="w-full border p-2 focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter video topic"
            required
            value={videoTopic}
            onChange={(e) => setVideoTopic(e.target.value)}
          />
        </div>

        {/* Video Duration */}
        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="videoDuration">
            Video Duration
          </label>
          <input
            type="text"
            name="videoDuration"
            id="videoDuration"
            className="w-full border p-2 focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter video Duration"
            required
            value={videoDuration}
            onChange={(e) => setVideoDuration(e.target.value)}
          />
        </div>

        {/* Video Link */}
        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="videoLink">
            Video Link
          </label>
          <input
            type="url"
            name="videoLink"
            id="videoLink"
            className="w-full border p-2 focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter video URL"
            required
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />
        </div>

        {/* Video Description */}
        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="videoDescription">
            Video Description
          </label>
          <textarea
            name="videoDescription"
            id="videoDescription"
            className="w-full border p-2 focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Video Status */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Video Status</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="videoStatus"
                value="active"
                checked={videoStatus === "active"}
                onChange={(e) => setVideoStatus(e.target.value)}
              />
              <span>Active</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="videoStatus"
                value="inactive"
                checked={videoStatus === "inactive"}
                onChange={(e) => setVideoStatus(e.target.value)}
              />
              <span>Inactive</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 mt-4">
          <button
            type="submit"
            className="bg-[#4b49ac] text-white px-4 py-2 hover:bg-indigo-700"
          >
            {id ? "Update Video" : "Add Video"}
          </button>
          <button
            type="reset"
            className={`text-white px-4 py-2 hover:bg-red-600 bg-gray-400 ${
              id ? "hidden" : "block"
            }`}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-10 z-50">
          <div className="bg-white rounded p-6 shadow-md max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">
              Are you sure you want to submit?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelSubmit}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 bg-[#4b49ac] text-white rounded hover:bg-indigo-700"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );


}
