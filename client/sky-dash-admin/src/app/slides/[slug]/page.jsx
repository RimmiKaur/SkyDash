"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function SliderForm() {
  const [sliderText, setSliderText] = useState("");
  const [sliderStatus, setSliderStatus] = useState("active");
  const [file, setFile] = useState("/images/preview.jpg");

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // State to control modal visibility
  const [showModal, setShowModal] = useState(false);
  // Use a ref to reference the form element for building FormData later if needed.
  const formRef = useRef(null);

  // Handle file selection and preview
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
    }
  };

  // If id exists, fetch slider data and prefill form fields
  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}admin/slider/view-one/${id}`)
        .then((res) => {
          if (res.data.status === 1) {
            const slider = res.data.data;
            setSliderText(slider.sliderText);
            setSliderStatus(slider.sliderStatus);
            // If a slider image exists, set the preview using its URL
            if (slider.sliderImage) {
              setFile(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}uploads/slider/${slider.sliderImage}`
              );
            }
          } else {
            toast.error("Failed to fetch slider details.");
          }
        })
        .catch((error) => {
          console.error("Error fetching slider details:", error);
          toast.error("Error fetching slider details.");
        });
    }
  }, [id]);

  // This function contains the actual submission logic.
  const submitSlider = async () => {
    let formData = new FormData(formRef.current);
    // Ensure controlled values are set in FormData
    formData.set("sliderText", sliderText);
    formData.set("sliderStatus", sliderStatus);

    try {
      if (!id) {
        // Add new slider
        let response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}admin/slider/add`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.data.status === 1) {
          toast.success(response.data.message);
          // Optionally, you can redirect or reset form
        } else {
          toast.error(response.data.message || "Something went wrong!");
        }
      } else {
        // Update existing slider
        let response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}admin/slider/update/${id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          // Optionally, redirect here
        } else {
          toast.error(response.data.msg || "Something went wrong!");
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Slider not added/updated successfully!");
    }
  };

  // Form submit handler that shows the confirmation modal
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  // Modal handlers
  const confirmSubmit = () => {
    setShowModal(false);
    submitSlider();
  };

  const cancelSubmit = () => {
    setShowModal(false);
  };

  return (
    <div className="mt-16 p-4 pb-8 bg-gray-300 text-black min-h-screen px-20 mx-auto">
      <ToastContainer />
      <form ref={formRef} onSubmit={handleFormSubmit}>
        <h1 className="text-2xl font-semibold mb-4">
          {id ? "Update Slider" : "Add Slider"}
        </h1>

        {/* Slider Text */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Slider Text</label>
          <input
            name="sliderText"
            type="text"
            className="w-full border p-2 focus:ring-2 focus:ring-indigo-500"
            value={sliderText}
            onChange={(e) => setSliderText(e.target.value)}
          />
        </div>

        {/* File Upload */}
        <div className="mb-4 flex items-center gap-10">
          <div className="mb-4">
            <label className="block font-medium mb-1">Upload File</label>
            <div className="relative flex items-center border space-x-2">
              <input
                name="sliderImage"
                type="file"
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
                {file instanceof File
                  ? file.name
                  : file.split("/").pop() || "No file chosen"}
              </span>
            </div>
          </div>
          {file && (
            <div className="mt-4">
              <img
                src={file}
                alt="Slider Preview"
                className="w-40 h-40 object-cover border"
              />
            </div>
          )}
        </div>

        {/* Slider Status */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Slider Status</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                name="sliderStatus"
                type="radio"
                value="active"
                checked={sliderStatus === "active"}
                onChange={(e) => setSliderStatus(e.target.value)}
              />
              <span>Active</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                name="sliderStatus"
                type="radio"
                value="inactive"
                checked={sliderStatus === "inactive"}
                onChange={(e) => setSliderStatus(e.target.value)}
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
            {id ? "Update Slider" : "Add Slider"}
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
