"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import LivePreview from "@/app/components/LivePreview";

export default function CoursesForm() {
  // State for team member information
  const [teamMemberName, setTeamMemberName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [courseStatus, setCourseStatus] = useState("active");
  const [file, setFile] = useState("/images/preview.jpg");
  const [dataLoaded, setDataLoaded] = useState(false);

  // For courses list and multi-select
  const [courseName, setCourseName] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Fetch courses list from backend
  const getSetcourseName = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}admin/video/course-name`)
      .then((res) => {
        if (res.data.status === 1) {
          setCourseName(res.data.data);
        } else {
          console.error("Failed to fetch Course names:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching Course names:", error);
      });
  };

  useEffect(() => {
    getSetcourseName();
  }, []);

  // Prepare options for react-select
  const courseOptions = courseName.map((course) => ({
    value: course._id,
    label: course.courseName,
  }));

  // If an id exists, fetch existing team data and prefill the form.
  useEffect(() => {
    if (id && courseName.length > 0 && !dataLoaded) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}admin/team/view-one/${id}`)
        .then((res) => {
          if (res.data.status === 1) {
            const team = res.data.data;
            setTeamMemberName(team.teamMemberName);
            setTeamDescription(team.teamDescription);
            setCourseStatus(team.teamStatus);
            
            const teamCourseIds = Array.isArray(team.coursesName)
              ? team.coursesName.map((course) => course._id)
              : [];
            const selected = courseOptions.filter((option) =>
              teamCourseIds.includes(option.value)
            );
            setSelectedCourses(selected);
            
            if (team.teamImage) {
              setFile(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}uploads/team/${team.teamImage}`
              );
            }
            setDataLoaded(true);
          } else {
            toast.error("Failed to fetch team member details.");
          }
        })
        .catch((error) => {
          console.error("Error fetching team member details:", error);
          toast.error("Error fetching team member details.");
        });
    }
  }, [id, courseName, dataLoaded]);

  // File change handler
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
    }
  };

  // State for additional form fields (course details)
  const [courseData, setCourseData] = useState({
    courseName: "",
    coursePrice: "",
    courseLanguage: "",
    courseCategory: "",
    courseDuration: "",
    courseDescription: "",
    courseStatus: "active",
    courseSection: [],
    courseTags: [],
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // States for sections & tags
  const [sections, setSections] = useState([]);
  const [inputValueSection, setInputValueSection] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [tags, setTags] = useState([]);
  const [inputValueTag, setInputValueTag] = useState("");

  const handleKeyDownTag = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      const trimmedValue = inputValueTag.trim();
      if (trimmedValue !== "" && !tags.includes(trimmedValue)) {
        setTags([...tags, trimmedValue]);
      }
      setInputValueTag("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDownSection = (e) => {
    if (e.key === "Enter" && inputValueSection.trim() !== "") {
      e.preventDefault();
      e.stopPropagation();
      if (editingIndex !== null) {
        const updatedSections = [...sections];
        updatedSections[editingIndex] = inputValueSection.trim();
        setSections(updatedSections);
        setEditingIndex(null);
      } else {
        setSections([...sections, inputValueSection.trim()]);
      }
      setInputValueSection("");
    }
  };

  const handleEdit = (index) => {
    setInputValueSection(sections[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  // Modal state and form ref
  const [showModal, setShowModal] = useState(false);
  const formRef = useRef(null);

  // Instead of directly submitting, we show the confirmation modal.
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  // Actual submission logic
  async function submitTeamMember() {
    let formData = new FormData(formRef.current);
    // Use set() to ensure only one value per key
    formData.set("teamMemberName", teamMemberName);
    formData.set("teamDescription", teamDescription);
    formData.set("teamStatus", courseStatus);
    formData.set(
      "coursesName",
      JSON.stringify(selectedCourses.map((course) => course.value))
    );
    if (file instanceof File) {
      formData.set("teamImage", file);
    }
    
    try {
      if (!id) {
        let response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}admin/team/add`,
          formData
        );
        if (response.data.status === 1) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message || "Something went wrong!");
        }
      } else {
        let response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}admin/team/update/${id}`,
          formData
        );
        if (response.data.status === 1) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message || "Something went wrong!");
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error.response?.data.message?.includes("duplicate")) {
        toast.error("Team Member Already Exists");
      } else {
        toast.error("Team Member not added/updated successfully!");
      }
    }
  }
  

  // Modal handlers
  const confirmSubmit = () => {
    setShowModal(false);
    submitTeamMember();
  };

  const cancelSubmit = () => {
    setShowModal(false);
  };

  return (
    <div className="mt-16 p-4 pb-8 bg-gray-300 text-black min-h-screen px-20 mx-auto">
      <ToastContainer />
      <div className="mb-4 flex gap-10">
        <form ref={formRef} onSubmit={handleFormSubmit} className="w-full">
          <h1 className="text-2xl font-semibold mb-4">
            {id ? "Update Team" : "Add Team"}
          </h1>

          {/* Team Member Name */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Team Member Name</label>
            <input
              name="teamMemberName"
              type="text"
              className="w-full border p-2 focus:ring-2 focus:ring-indigo-500"
              value={teamMemberName}
              onChange={(e) => setTeamMemberName(e.target.value)}
            />
          </div>

          {/* Course Name (Multi-select) */}
          <div className="mb-4">
            <label className="block font-medium mb-1" htmlFor="courseName">
              Course Name
            </label>
            <Select
              isMulti
              name="courseName"
              options={courseOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={setSelectedCourses}
              value={selectedCourses}
              placeholder="Select Course(s)..."
            />
          </div>

          {/* Team Member Description */}
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Team Member Description
            </label>
            <input
              name="teamDescription"
              type="text"
              className="w-full border p-2 focus:ring-2 focus:ring-indigo-500"
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
            />
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Upload File</label>
            <div className="relative flex items-center border space-x-2">
              <input
                name="teamImage"
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="bg-[#4b49ac] w-[100px] text-white pl-2 py-2 cursor-pointer hover:bg-[#4b49de] transition"
              >
                Choose File
              </label>
              <span className="text-gray-700">
                {typeof file === "string"
                  ? file.split("/").pop()
                  : "No file chosen"}
              </span>
            </div>
          </div>

          {/* Team Status */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Team Status</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  name="teamStatus"
                  type="radio"
                  value="active"
                  checked={courseStatus === "active"}
                  onChange={(e) => setCourseStatus(e.target.value)}
                />
                <span>Active</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  name="teamStatus"
                  type="radio"
                  value="inactive"
                  checked={courseStatus === "inactive"}
                  onChange={(e) => setCourseStatus(e.target.value)}
                />
                <span>Inactive</span>
              </label>
            </div>
          </div>

          {/* Sections & Tags Inputs (if any) can go here */}

          {/* Buttons */}
          <div className="flex space-x-4 mt-4">
            <button className="bg-[#4b49ac] text-white px-4 py-2 hover:bg-indigo-700">
              {id ? "Update Team" : "Submit"}
            </button>
            <button
              type="reset"
              className="text-white px-4 py-2 hover:bg-red-600 bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Live Preview Section */}
        <LivePreview
          file={file}
          teamMemberName={teamMemberName}
          teamDescription={teamDescription}
          selectedCourses={selectedCourses}
        />
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
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
