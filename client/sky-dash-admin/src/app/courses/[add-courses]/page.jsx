"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function CourseForm() {
  const [courseStatus, setCourseStatus] = useState("active");
  const [file, setFile] = useState("/images/preview.jpg");
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [inputValueSection, setInputValueSection] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [tags, setTags] = useState([]);
  const [inputValueTag, setInputValueTag] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal state
  const[imagePreview, setImagePreview]=useState("/images/preview.jpg");
  const [topSeller, setTopSeller] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // State for Form Data
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
    topCourse:""
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}admin/course/view-one/${id}`)
        .then((response) => {
          if (response.data.status === 1) {
            const course = response.data.data;
            setCourseData({
              courseName: course.courseName,
              coursePrice: course.coursePrice,
              courseLanguage: course.courseLanguage,
              courseCategory: course.courseCategory,
              courseDuration: course.courseDuration,
              courseDescription: course.courseDescription,
              courseStatus: course.courseStatus,
              topCourse: course.topCourse,
            });
            // Set file if available
            setSections(course.courseSection);
            setTags(course.courseTags);
            if (course.courseImage) {
              setFile(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}uploads/course/${course.courseImage}`
              );
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching course details:", error);
          toast.error("Failed to load course details!");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Tag input handler
//   const handleKeyDownTag = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       e.stopPropagation();
//       const trimmedValue = inputValueTag.trim();
//       if (trimmedValue !== "") {
//         if (!tags.includes(trimmedValue)) {
//           setTags([...tags, trimmedValue]);
//         }
//         setInputValueTag("");
//       }
//     }
//   };

//   const removeTag = (index) => {
//     setTags(tags.filter((_, i) => i !== index));
//   };

//   // Section input handler
//   const handleKeyDownSection = (e) => {
//     if (e.key === "Enter" && inputValueSection.trim() !== "") {
//       e.preventDefault();
//       e.stopPropagation();
//       if (editingIndex !== null) {
//         const updatedSections = [...sections];
//         updatedSections[editingIndex] = inputValueSection.trim();
//         setSections(updatedSections);
//         setEditingIndex(null);
//       } else {
//         setSections([...sections, inputValueSection.trim()]);
//       }
//       setInputValueSection("");
//     }
//   };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile))
    }
  };

  // Actual form submission function
  const submitCourse = async () => {
    let formData = new FormData();
    // Append all form inputs manually (or use a ref to the form if desired)
    formData.append("courseName", courseData.courseName);
    formData.append("coursePrice", courseData.coursePrice);
    formData.append("courseLanguage", courseData.courseLanguage);
    formData.append("courseCategory", courseData.courseCategory);
    formData.append("courseDuration", courseData.courseDuration);
    formData.append("courseDescription", courseData.courseDescription);
    formData.append("courseStatus", courseData.courseStatus);
    formData.append("courseImage", file);
   
    formData.append("courseSection", JSON.stringify(sections));
    formData.append("courseTags", JSON.stringify(tags));
    formData.append("topCourse", topSeller);


      // console.log("sssssssssssssssssssssssssssssssssssssss", top);
  

    if (!id) {
      try {
        let response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}admin/course/add`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.data.status === 1) {
          toast.success(response.data.message || "Course added successfully!");
          setTimeout(() => {
            router.push("/videos/add-videos");
          }, 2000);
        } else {
          toast.error(response.data.message || "Course could not be added.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong!");
      }
    } else {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}admin/course/update/${id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((res) => {
          toast.success(res.data.msg);
        });
    }
  };

  // Handler for form submission that opens the confirmation modal
  const handleCourseSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  // Modal state

  // When user confirms submission
  const confirmSubmit = () => {
    setShowModal(false);
    submitCourse();
  };

  // When user cancels submission
  const cancelSubmit = () => {
    setShowModal(false);
  };

  return (
    <div className="mt-16 p-4 pb-8 bg-gray-300 text-black px-20 mx-auto">
      <ToastContainer />
      <form onSubmit={handleCourseSubmit}>
        <h1 className="text-2xl font-semibold mb-4">Course</h1>

        {/* Course Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Course Name</label>
          <input
            value={courseData.courseName}
            onChange={handleFormChange}
            type="text"
            name="courseName"
            className="w-full border p-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Course Price */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Course Price</label>
          <input
            value={courseData.coursePrice}
            onChange={handleFormChange}
            type="text"
            name="coursePrice"
            className="w-full border p-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Course Language</label>
          <input
            value={courseData.courseLanguage}
            onChange={handleFormChange}
            type="text"
            name="courseLanguage"
            className="w-full border p-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Course Category</label>
          <select
            name="courseCategory"
            value={courseData.courseCategory}
            onChange={handleFormChange}
            className="w-full border p-3 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a Category</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="UI/UX Design">UI/UX Design</option>
          </select>
        </div>

        {/* Course Duration */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Course Duration</label>
          <input
            value={courseData.courseDuration}
            onChange={handleFormChange}
            type="text"
            name="courseDuration"
            className="w-full border p-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Course Section */}
        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="section-input">
            Course Section
          </label>
          <input
            type="text"
            id="section-input"
            className="w-full border p-2 focus:ring-2 focus:ring-indigo-500"
            placeholder="Type a section name and press Enter..."
            value={inputValueSection}
            onChange={(e) => setInputValueSection(e.target.value)}
            onKeyDown={(e) => {
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
            }}
          />

          {/* Course Sections List */}
          <ul>
            {sections.map((section, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 border px-3 py-2 shadow-md animate-slide-down"
              >
                <span className="text-gray-800 font-medium">
                  {typeof section === "object"
                    ? section.sectionTitle
                    : section}
                </span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInputValueSection(sections[index]);
                      setEditingIndex(index);
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setSections(sections.filter((_, i) => i !== index))}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Tags Input */}
          <div className="w-full py-4">
            <label className="block font-medium mb-2">Add Tags</label>
            <input
              type="text"
              id="tag-input"
              value={inputValueTag}
              onChange={(e) => setInputValueTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  const trimmedValue = inputValueTag.trim();
                  if (trimmedValue !== "") {
                    if (!tags.includes(trimmedValue)) {
                      setTags([...tags, trimmedValue]);
                    }
                    setInputValueTag("");
                  }
                }
              }}
              placeholder="Type a tag and press Enter..."
              className="w-full border px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex flex-wrap mt-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 px-3 py-1 text-sm font-medium mr-2 mb-2 flex items-center"
                >
                  {tag}
                  <button
                    onClick={() => setTags(tags.filter((_, i) => i !== index))}
                    className="ml-2 text-red-500 font-bold hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Course Description */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Course Description</label>
          <textarea
            value={courseData.courseDescription}
            onChange={handleFormChange}
            name="courseDescription"
            className="w-full border p-2 focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
          ></textarea>
        </div>

        {/* File Upload */}
        <div className="mb-4 flex items-center gap-10">
          <div className="mb-4">
            <label className="block font-medium mb-1">Upload File</label>
            <div className="relative flex items-center border space-x-2">
              <input
                type="file"
                name="courseImage"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="bg-[#4b49ac] text-white px-5 py-2 cursor-pointer hover:bg-[#4b49de] transition"
              >
                Choose File
              </label>
              <span className="w-[600px] text-gray-700">
                {file instanceof File ? file.name : "No file chosen"}
              </span>
            </div>
          </div>
          {file && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Course Preview"
                className="w-40 h-40 object-cover border"
              />
            </div>
          )}
        </div>

        {/* Course Status */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Course Status</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="courseStatus"
                value="active"
                checked={courseStatus === "active"}
                onChange={(e) => setCourseStatus(e.target.value)}
              />
              <span>Active</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="courseStatus"
                value="inactive"
                checked={courseStatus === "inactive"}
                onChange={(e) => setCourseStatus(e.target.value)}
              />
              <span>Inactive</span>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <span className="block text-gray-600 font-medium mb-2">Top Course :</span>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                name="topSeller"
                type="checkbox"
                checked={topSeller} // Ensure checked state works properly
                onChange={(e) => setTopSeller(!topSeller)} // Convert "on" to "1"
                className="mr-2"
              />
              Top Course
            </label>
          </div>
          </div>

        {/* Buttons */}
        <div className="flex space-x-4 mt-4">
          <button className="bg-[#4b49ac] text-white px-4 py-2 hover:bg-indigo-700">
            {id ? "Update Course" : "Add Course"}
          </button>
          <button
            type="reset"
            className={`text-white px-4 py-2 hover:bg-red-600 bg-gray-400 ${id ? "hidden" : "block"}`}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Modal Confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
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
