import { motion } from "framer-motion";
import { useState } from "react";

export default function LivePreview({
  file,
  teamMemberName,
  teamDescription,
  selectedCourses,
}) {
  // These state flags track if the field preview has already animated in
  const [nameExpanded, setNameExpanded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [coursesExpanded, setCoursesExpanded] = useState(false);

  return (
    <div className="max-h-[85vh] h-fit overflow-y-scroll p-6 bg-gradient-to-r from-white to-gray-50 shadow-2xl w-[400px]">

      {/* Image Preview */}
      {file && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <img
            src={file}
            alt="Preview"
            className="w-75  object-cover"
          />
        </motion.div>
      )}

      {/* Team Member Name Preview */}
      {teamMemberName && (
        <div className="mb-6">
          <strong className="block text-xl text-gray-800 mb-1">
            Team Member Name:
          </strong>
          {!nameExpanded ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.5 }}
              onAnimationComplete={() => setNameExpanded(true)}
            >
              <p className="text-lg text-gray-700 text-wrap max-w-[200px] break-words">{teamMemberName}</p>
            </motion.div>
          ) : (
            <p className="text-lg text-gray-700 max-w-[200px] break-words">{teamMemberName}</p>
          )}
        </div>
      )}

      {/* Team Member Description Preview */}
      {teamDescription && (
        <div className="mb-6">
          <strong className="block text-xl text-gray-800 mb-1">
            Team Member Description:
          </strong>
          {!descExpanded ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onAnimationComplete={() => setDescExpanded(true)}
            >
              <p className="text-lg text-gray-700 max-w-[200px] break-words">{teamDescription}</p>
            </motion.div>
          ) : (
            <p className="text-lg text-gray-700 max-w-[200px] break-words">{teamDescription}</p>
          )}
        </div>
      )}

      {/* Courses Selected Preview */}
      {selectedCourses && selectedCourses.length > 0 && (
        <div className="mb-6">
          <strong className="block text-xl text-gray-800 mb-1">
            Courses Selected:
          </strong>
          {!coursesExpanded ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onAnimationComplete={() => setCoursesExpanded(true)}
            >
              <div className="mt-1">
                {selectedCourses.map((course) => (
                  <span
                    key={course.value}
                    className="inline-block bg-blue-100 text-blue-800 px-3 py-1 mr-2 mb-2 border"
                  >
                    {course.label}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="mt-1">
              {selectedCourses.map((course) => (
                <span
                  key={course.value}
                  className="inline-block bg-blue-100 text-blue-800 px-3 py-1 mr-2 mb-2  shadow-sm"
                >
                  {course.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
