"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function TeamTable() {

  const [teamMembers, setTeamMembers] = useState([]);



  const getSetTeamMembers = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}admin/team/view`)
      .then((response) => {
        if (response.data.status === 1) {
          setTeamMembers(response.data.data);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        toast.error("Error fetching Team Member");
      });
  }


  useEffect(() => {
    getSetTeamMembers();

  }, []);



  const deleteTeamMember = (id) => {
    axios
      .delete(`http://localhost:8080/admin/team/delete/${id}`)
      .then(() => {
        toast.success("Deleted Successfully");
        // ✅ Update UI correctly: filter out the deleted course
        setTeamMembers((prevteam) => prevteam.filter(team => team._id !== id));
      })
      .catch(() => toast.error("Could not delete"));
  };

 

  return (
    <div className="mt-16 text-black min-h-screen p-6 bg-gray-300 shadow-lg">
      <ToastContainer/>
      <h2 className="text-2xl font-semibold mb-4">Team Table</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-white">
            <tr className="text-left">
              <th className="border border-gray-300 p-4 font-semibold">S.no</th>
              <th className="border border-gray-300 p-4 font-semibold">Member Name</th>
              <th className="border border-gray-300 p-4 font-semibold">Course Name</th>
              <th className="border border-gray-300 p-4 font-semibold">Member Description</th>

              <th className="border border-gray-300 p-4 font-semibold">Member Image</th>
              <th className="border border-gray-300 p-4 font-semibold">Status</th>
              <th className="border border-gray-300 p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {teamMembers.map((member, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="border border-gray-300 p-4">{index + 1}</td>
                <td className="border border-gray-300 p-4">{member.teamMemberName}</td>
                <td className="border border-gray-300 p-4">
                  {Array.isArray(member.coursesName) ? (
                    <ul className="list-decimal list-inside">
                      {member.coursesName.map((course, i) => (
                        <li key={i}>{course.courseName}</li>
                      ))}
                    </ul>
                  ) : (
                    member.coursesName
                  )}
                </td>
                <td className="border border-gray-300 p-4">{member.teamDescription}</td>

                <td className="border border-gray-300 p-4">
                  <img className="w-20"
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}uploads/team/${member.teamImage}`}
                  />
                </td>
                <td
                  className={`border border-gray-300 p-4 font-semibold ${member.teamStatus.toLowerCase() === "active"
                    ? "text-green-600"
                    : "text-red-600"
                    }`}
                >
                  {member.teamStatus.toUpperCase()}
                </td>   
               <td className="border border-gray-300 p-4">
                  <div className="flex space-x-2">
                  <Link href={{
                        pathname: `/team/edit-team`,
                        query: { id: member._id },
                      }}>
                        <button className="bg-green-500 text-white px-4 py-1  hover:bg-green-600">

                          Edit
                        </button>
                      </Link>
                    <button onClick={() =>{
                      deleteTeamMember(member._id)
                    }} className="bg-red-500 text-white px-4 py-1 hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
