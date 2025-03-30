"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function SliderTable() {

  const [sliders, setSliders] = useState([]);
  const [staticPath, setstaticPath] = useState([]);





  const getSetSliders = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}admin/slider/view`)
      .then((response) => {
        if (response.data.status === 1) {
          setSliders(response.data.data);
          setstaticPath(response.data.staticPath)
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        toast.error("Error fetching Slider Member");
      });
  }


  useEffect(() => {
    getSetSliders();

  }, []);



  const deleteTeamMember = (id) => {
    axios
      .delete(`http://localhost:8080/admin/slider/delete/${id}`)
      .then(() => {
        toast.success("Deleted Successfully");
        // ✅ Update UI correctly: filter out the deleted course
        setSliders((prevslider) => prevslider.filter(slider => slider._id !== id));
      })
      .catch(() => toast.error("Could not delete"));
  };

  return (
    <div className="mt-16 text-black h-screen p-6 bg-gray-300 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Slider Table</h2>
      <ToastContainer />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-white">
            <tr className="text-left">
              <th className="border border-gray-300 p-4 font-semibold">S.no</th>
              <th className="border border-gray-300 p-4 font-semibold">Slider Text</th>
              <th className="border border-gray-300 p-4 font-semibold">Slider Image</th>
              <th className="border border-gray-300 p-4 font-semibold">Status</th>
              <th className="border border-gray-300 p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sliders.length > 0
              ? sliders.map((slider, index) => (
                <tr key={slider.id} className="border border-gray-300">
                  <td className="border border-gray-300 p-4">{index + 1}</td>
                  <td className="border border-gray-300 p-4">{slider.sliderText}</td>

                  <td className="border border-gray-300 p-4">
                  <img className="w-48"
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${staticPath}${slider.sliderImage}`}
                  />
                </td>                  <td
                    className={`border border-gray-300 p-4 font-semibold ${slider.sliderStatus.toLowerCase() === "active"
                      ? "text-green-600"
                      : "text-red-600"
                      }`}
                  >
                    {slider.sliderStatus.toUpperCase()}
                  </td>                    <td className="border border-gray-300 p-4">
                    <div className="flex space-x-2">
                    <Link href={{
                        pathname: `/slides/edit-slider`,
                        query: { id: slider._id },
                      }}>
                        <button className="bg-green-500 text-white px-4 py-1  hover:bg-green-600">

                          Edit
                        </button>
                      </Link>
                      <button onClick={()=>{
                        deleteTeamMember(slider._id)
                      }} className="bg-red-500 text-white px-4 py-1  hover:bg-red-600">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
             
            ))
            :
            ( <tr>
               <td colSpan="5" className="text-center p-4">No courses found </td>
             </tr>)
             }
          </tbody>
        </table>
      </div>
    </div>
  );
}
