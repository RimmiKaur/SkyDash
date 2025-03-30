"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { usePathname } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

export default function CourseDetails() {
  const [openSection, setOpenSection] = useState(0);
  const id = usePathname().split("/").pop();
  const [enrolledStudents, setEnrolledStudents] = useState([]); // New state for enrolled students
  const [course, setCourse] = useState(null);
  // Updated state: "instructors" is now an array.
  const [courseData, setCourseData] = useState({
    id: "",
    name: "",
    category: "",
    instructors: [], // Array of instructor objects
    enrolled: 0,
    duration: "",
    price: "",
    sections: [],
    description: "",
  });

  useEffect(() => {
    Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}admin/course/view-one/${id}`),
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}admin/team/team-member/${id}`)
    ])
      .then(([courseResponse, teamResponse]) => {
        if (courseResponse.data.status === 1) {
          const course = courseResponse.data.data;
          const teamMembers = teamResponse.data.data || teamResponse.data.team || [];
          setCourseData({
            id: course._id || "",
            name: course.courseName || "No name provided",
            category: course.courseCategory || "Uncategorized",
            // Use team members from the second call as instructors
            instructors: teamMembers.map((member) => ({
              name: member.teamMemberName,
              image: member.teamImage
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}uploads/team/${member.teamImage}`
                : "/images/default-profile.png",
            })),
            enrolled: course.enrolled || 0,
            price: course.coursePrice || "Free",
            duration: course.courseDuration || "Unknown Duration",
            description: course.courseDescription || "",
            sections:
              course.courseSection?.map((section) => ({
                title: section.sectionTitle || "Untitled Section",
                lessons:
                  section.sectionVideos?.map((lesson) => ({
                    name: lesson.videoTopic || "Unnamed Lesson",
                    duration: lesson.duration || "Unknown Duration",
                    icon: lesson.icon || "📘",
                  })) || [],
              })) || [],
          });

          if (course.courseImage) {
            setFile(`${process.env.NEXT_PUBLIC_API_BASE_URL}uploads/course/${course.courseImage}`);
          }
          

        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  useEffect(()=>{
    setCourse(courseData);
  },[courseData])

  useEffect(() => {

    console.log("sssssssssssssssssssssssssssss",course);
    
    if (course ) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}web/order/enrolled-students/${id}`)
        .then((res) => {
          if (res.data.status === 1) {
            setEnrolledStudents(res.data.data);
          } else {
            toast.error("Failed to fetch enrolled students.");
          }
        })
        .catch((error) => {
          console.error("Error fetching enrolled students:", error);
          toast.error("Error fetching enrolled students.");
        });
    }
  }, [course]);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  useEffect(() => {
    console.log("Updated instructors:", courseData.instructors);
  }, [courseData.instructors]);

  return (
    <div className="mx-auto min-h-screen p-8 text-black">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Courses</h2>
      <div className="bg-white border p-4 shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="text-indigo-700">
              <th className="py-2">ID</th>
              <th>Course Name</th>
              <th>Category</th>
              <th>Instructor(s)</th>
              <th>Enrolled</th>
              <th>Duration</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="py-2">#{courseData.id.slice(0, 3)}</td>
              <td>{courseData.name}</td>
              <td>{courseData.category}</td>
              <td className="flex flex-col gap-2">
                {courseData.instructors && courseData.instructors.length > 0 ? (
                  courseData.instructors.map((instr, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <img
                        src={instr.image}
                        width={50}
                        height={50}
                        className="rounded-full "
                        alt="Instructor"
                      />
                      <span>{instr.name}</span>
                    </div>
                  ))
                ) : (
                  <span>Unknown Instructor</span>
                )}
              </td>
              <td>{courseData.enrolled}</td>
              <td>{courseData.duration}</td>
              <td className="font-semibold">{courseData.price}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mt-6">Table Of Content</h2>
      <div className="mt-4">
        {courseData.sections.map((section, index) => (
          <div key={index} className="mb-3 border">
            <button
              onClick={() => toggleSection(index)}
              className={`w-full p-3 text-left font-semibold ${openSection === index ? "bg-indigo-200" : "bg-gray-100"
                }`}
            >
              {section.title} {openSection === index ? "▲" : "▼"}
            </button>
            {openSection === index && section.lessons.length > 0 && (
              <ul className="bg-white p-3">
                {section.lessons.map((lesson, i) => (
                  <li
                    key={i}
                    className="flex justify-between py-2 border-b last:border-none"
                  >
                    <span className="flex items-center gap-2">
                      {lesson.icon} {lesson.name}
                    </span>
                    <span className="text-gray-500">{lesson.videoDuration}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="mx-auto py-8 text-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4">Course Instructor(s)</h2>
            <div className="flex flex-col space-y-4">
              {courseData.instructors && courseData.instructors.length > 0 ? (
                courseData.instructors.map((instr, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={instr.image}
                      width={50}
                      height={50}
                      className="rounded-full"
                      alt="Instructor"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{instr.name}</h3>
                    </div>
                  </div>
                ))
              ) : (
                <p>No instructor available</p>
              )}
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Course Description</h3>
              <p className="text-gray-600">{courseData.description}</p>
            </div>
          </div>

          <div className="border bg-white p-2">
            <h2 className="text-2xl font-bold mb-4">Enrolled Students</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-700 bg-gray-200">
                  <th className="py-2 px-4">ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.length > 0 ? (
                  enrolledStudents.map((student) => (
                    <tr key={student._id} className="border-t">
                      <td className="py-2 px-4">#{student._id.slice(0, 4)}</td>
                      <td className="flex items-center space-x-2 py-2">
                        <span>{student.name}</span>
                      </td>
                      <td className="text-gray-500">{student.userEmail}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-2 px-4 text-gray-500">
                      No enrolled students.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { usePathname, useRouter } from "next/navigation";
// import { toast, ToastContainer } from "react-toastify";
// import Cookies from "js-cookie";
// import Image from "next/image";

// export default function CourseDetails() {
//   const pathname = usePathname();
//   const id = pathname.split("/").pop(); // Extract course ID from URL
//   const router = useRouter();
//   const token = Cookies.get("token");

//   const [course, setCourse] = useState(null);
//   const [instructors, setInstructors] = useState([]);
//   const [currentVideo, setCurrentVideo] = useState("");
//   const [openSection, setOpenSection] = useState(null);
//   const [activeTab, setActiveTab] = useState("about");
//   const [enrolledStudents, setEnrolledStudents] = useState([]); // New state for enrolled students

//   // Fetch course details (including sections & videos)
//   useEffect(() => {
//     if (id) {
//       axios
//         .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}admin/course/view-one/${id}`)
//         .then((res) => {
//           if (res.data.status === 1) {
//             const courseData = res.data.data;
//             setCourse(courseData);
//             // Set first video as default (if available)
//             if (
//               courseData.courseSection &&
//               courseData.courseSection.length > 0 &&
//               courseData.courseSection[0].sectionVideos &&
//               courseData.courseSection[0].sectionVideos.length > 0
//             ) {
//               setCurrentVideo(courseData.courseSection[0].sectionVideos[0].videoLink);
//             }
//           } else {
//             toast.error("Failed to fetch course details.");
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching course details:", error);
//           toast.error("Error fetching course details.");
//         });
//     }
//   }, [id]);

//   // Fetch instructor details via team API
//   useEffect(() => {
//     if (id) {
//       axios
//         .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}admin/team/team-member/${id}`)
//         .then((res) => {
//           if (res.data.status === 1) {
//             setInstructors(res.data.data);
//           } else {
//             toast.error("Failed to fetch instructor details.");
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching instructors:", error);
//           toast.error("Error fetching instructor details.");
//         });
//     }
//   }, [id]);

//   // Fetch enrolled students for the current course from API
//   useEffect(() => {
//     if (course && course._id) {
//       axios
//         .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}web/order/enrolled-students/${course._id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           if (res.data.status === 1) {
//             setEnrolledStudents(res.data.data);
//           } else {
//             toast.error("Failed to fetch enrolled students.");
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching enrolled students:", error);
//           toast.error("Error fetching enrolled students.");
//         });
//     }
//   }, [course, token]);

//   // Toggle a section in the accordion (for video list)
//   const toggleSection = (index) => {
//     setOpenSection(openSection === index ? null : index);
//   };

//   // Helper: Convert a YouTube link to its embed version (if needed)
//   const getEmbedUrl = (url) => {
//     if (url.includes("watch?v=")) {
//       return url.replace("watch?v=", "embed/");
//     }
//     return url;
//   };

//   if (!course) {
//     return <p className="text-center text-gray-600">Loading course...</p>;
//   }

//   const staticPath = course.staticPath || "uploads/course";
//   const imageURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}uploads/course/${course.courseImage}`;

//   return (
//     <div className="container mx-auto p-8 mt-22 bg-white text-black">
//       <ToastContainer />

//       {/* Course Title & Category */}
//       <h1 className="text-3xl font-bold mb-2">{course.courseName}</h1>
//       <p className="text-gray-500 mb-4">{course.courseCategory}</p>

//       {/* Top Section: Two-Column Layout for Main Video and Video List */}
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Left Column: Main Video Player */}
//         <div className="md:w-1/2">
//           {currentVideo ? (
//             <div className="relative" style={{ paddingTop: "56.25%" }}>
//               <iframe
//                 src={getEmbedUrl(currentVideo)}
//                 className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//                 title="Course Video"
//               ></iframe>
//             </div>
//           ) : (
//             <p>No video available.</p>
//           )}
//         </div>
//         {/* Right Column: Video List (Accordion) */}
//         <div className="md:w-1/2">
//           <h2 className="text-xl font-semibold mb-4">Course Videos</h2>
//           {course.courseSection.map((section, index) => (
//             <div key={index} className="mb-4 border rounded">
//               <button
//                 onClick={() => toggleSection(index)}
//                 className={`w-full flex justify-between items-center p-4 bg-green-700 hover:bg-green-900 text-white rounded-t`}
//               >
//                 <span className="font-semibold">{section.sectionTitle}</span>
//                 <span>{openSection === index ? "▲" : "▼"}</span>
//               </button>
//               {openSection === index && (
//                 <div className="p-4">
//                   {section.sectionVideos && section.sectionVideos.length > 0 ? (
//                     <ul className="space-y-2">
//                       {section.sectionVideos.map((video, idx) => (
//                         <li key={idx} className="flex justify-between items-center">
//                           <span
//                             className="cursor-pointer hover:text-blue-600"
//                             onClick={() => setCurrentVideo(video.videoLink)}
//                           >
//                             {video.videoTopic}
//                           </span>
//                           <button
//                             onClick={() => {
//                               // Calculate new progress based on the number of videos completed out of total videos.
//                               const totalVideos = course.courseSection.reduce(
//                                 (sum, sec) =>
//                                   sum + (sec.sectionVideos ? sec.sectionVideos.length : 0),
//                                 0
//                               );
//                               // For simplicity, assume that each video completion increases progress by an equal fraction.
//                               // In a real application, you would track which videos are completed and then calculate the percentage.
//                               const increment = 100 / totalVideos;
//                               // Here you would update the progress for the specific order item.
//                               // For demo purposes, we call the update API with the calculated increment.
//                               axios
//                                 .put(
//                                   `${process.env.NEXT_PUBLIC_API_BASE_URL}web/order/update-progress`,
//                                   {
//                                     // You should pass the proper order id; here we assume the current course id as a placeholder.
//                                     orderId: course._id,
//                                     courseId: course._id,
//                                     progress: increment,
//                                   },
//                                   { headers: { Authorization: `Bearer ${token}` } }
//                                 )
//                                 .then((res) => {
//                                   if (res.data.status === 1) {
//                                     toast.success("Progress updated successfully!");
//                                   } else {
//                                     toast.error("Failed to update progress.");
//                                   }
//                                 })
//                                 .catch((error) => {
//                                   console.error("Error updating progress:", error);
//                                   toast.error("Error updating progress.");
//                                 });
//                             }}
//                             className="text-sm text-green-600 hover:underline"
//                           >
//                             Mark as Completed
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="text-gray-500 text-sm">
//                       No videos available in this section.
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Bottom Section: Tabs for Additional Details */}
//       <div className="mt-10">
//         <div className="flex space-x-8 pb-2">
//           {["about", "outcomes", "instructor"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`py-2 px-4 ${activeTab === tab
//                   ? "border-b-2 border-green-600 text-green-600 font-semibold"
//                   : "text-gray-600"
//                 }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//         </div>

//         {activeTab === "about" && (
//           <div className="mt-6">
//             <h2 className="text-xl font-semibold mb-2">About This Course</h2>
//             <p className="text-gray-700">{course.courseDescription}</p>
//           </div>
//         )}

//         {activeTab === "outcomes" && (
//           <div className="mt-6">
//             <h2 className="text-xl font-semibold mb-2">Course Outcomes</h2>
//             <p className="text-gray-700">
//               This course will equip you with advanced skills in {course.courseName}.
//             </p>
//           </div>
//         )}

//         {activeTab === "instructor" && (
//           <div className="mt-6">
//             <h2 className="text-xl font-semibold mb-4">Course Instructor(s)</h2>
//             {instructors && instructors.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {instructors.map((instr, idx) => (
//                   <div key={idx} className="flex flex-col items-center">
//                     <img
//                       src={`${process.env.NEXT_PUBLIC_API_BASE_URL}uploads/team/${instr.teamImage}`}
//                       alt={instr.teamMemberName}
//                       className="w-16 h-16 rounded-full object-cover"
//                     />
//                     <h3 className="text-lg font-semibold mt-2">
//                       {instr.teamMemberName}
//                     </h3>
//                     <p className="text-gray-600 text-sm text-center">
//                       {instr.teamDescription}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500">No instructor available.</p>
//             )}
//           </div>
//         )}

//         {/* Enrolled Students Section */}
//         <div className="mt-8">
//           <h2 className="text-2xl font-bold mb-4">Enrolled Students</h2>
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="text-gray-700 bg-gray-200">
//                 <th className="py-2 px-4">ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//               </tr>
//             </thead>
//             <tbody>
//               {enrolledStudents.length > 0 ? (
//                 enrolledStudents.map((student) => (
//                   <tr key={student._id} className="border-t">
//                     <td className="py-2 px-4">#{student._id.slice(0, 4)}</td>
//                     <td className="flex items-center space-x-2 py-2">
//                       <Image
//                         src={
//                           student.profileImage
//                             ? `${process.env.NEXT_PUBLIC_API_BASE_URL}uploads/user/${student.profileImage}`
//                             : "/images/default-user.png"
//                         }
//                         width={30}
//                         height={30}
//                         alt={student.name}
//                       />
//                       <span>{student.name}</span>
//                     </td>
//                     <td className="text-gray-500">{student.userEmail}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="py-2 px-4 text-gray-500">
//                     No enrolled students.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
