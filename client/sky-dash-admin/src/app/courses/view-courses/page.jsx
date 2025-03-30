"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [staticPath, setStaticPath] = useState("");


  const getSetCourses = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}admin/course/view`)
      .then((response) => {
        if (response.data.status === 1) {
          setCourses(response.data.data);
          setStaticPath(response.data.staticPath)
        } else {
          toast.error("Failed to fetch Course:", response.data.msg);
        }
      })
      .catch((error) => {
        toast.error("Error fetching Course:", error);
      });


  }


  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/admin/course/delete/${id}`)
      .then(() => {
        toast.success("Deleted Successfully");
        // ✅ Update UI correctly: filter out the deleted course
        setCourses((prevCourses) => prevCourses.filter(course => course._id !== id));
      })
      .catch(() => toast.error("Could not delete"));
  };
  



  useEffect(() => {
    
    getSetCourses();
  }, []);

  return (
    <div className=" p-6 bg-gray-300 mt-16 min-h-screen  text-black shadow-lg ">
      <ToastContainer/>
      <h2 className="text-2xl font-semibold mb-4">Course Table</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-white">
            <tr className="text-left">
              <th className="border border-gray-300 p-4 font-semibold">S.no</th>
              <th className="border border-gray-300 p-4 font-semibold">Course Name</th>
              <th className="border border-gray-300 p-4 font-semibold">Fees</th>
              <th className="border border-gray-300 p-4 font-semibold">Duration</th>
              <th className="border border-gray-300 p-4 font-semibold">Description</th>
              <th className="border border-gray-300 p-4 font-semibold">Image</th>
              <th className="border border-gray-300 p-4 font-semibold">Status</th>
              <th className="border border-gray-300 p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {courses.length > 0
            ?
            courses.map((course, index) => (
              <tr key={course.id} className="border border-gray-300">
                <td className="border border-gray-300 p-4">{index + 1}</td>
                <td className="border border-gray-300 p-4">{course.courseName}</td>
                <td className="border border-gray-300 p-4">{course.coursePrice}</td>
                <td className="border border-gray-300 p-4">{course.courseDuration}</td>
                <td className="border border-gray-300 p-4">{course.courseDescription}</td>
                <td className="border border-gray-300 p-4">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${staticPath}${course.courseImage}`}
                    className="w-50"
                  />
                </td>
                <td
                  className={`border border-gray-300 p-4 font-semibold  ${course.courseStatus.toUpperCase() === "ACTIVE"
                    ? "text-green-600"
                    : "text-red-600"
                    }`}
                >
                  {course.courseStatus.toUpperCase()}
                </td>
                <td className="border border-gray-300 p-4">
                  <div className="flex space-x-2">
                    <Link href={{
                      pathname: `/courses/course-details/${course._id}`,
                    }}>
                      <button className="bg-blue-500 text-white px-4 py-1  hover:bg-blue-600">
                        View
                      </button>
                    </Link>
                    <Link href={{
                      pathname: `/courses/edit-course`,
                      query: { id: course._id },
                    }}>
                       <button className="bg-green-500 text-white px-4 py-1  hover:bg-green-600">

                        Edit
                      </button>
                    </Link>
                    <button className="bg-red-500 text-white px-4 py-1  hover:bg-red-600"
                    onClick={() => handleDelete(course._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
            :
            <tr>
              <td colSpan="8" className="text-center p-4">No courses found </td>
              </tr>
          }
          </tbody>
        </table>
      </div>
    </div>
  );
}
