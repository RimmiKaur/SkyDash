const { courseModel } = require("../../model/courseModel");
const fs = require("fs");
const { videoModel } = require("../../model/videoModel");

// ✅ Add a new course with an image
const addCourse = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { 
            courseName, 
            coursePrice, 
            courseLanguage, 
            courseCategory, 
            courseDuration, 
            courseSection,  // This is coming as a string
            courseTags, 
            courseDescription, 
            courseRating, 
            courseStatus ,
            topCourse
        } = req.body;

        // Validate required fields
        if (!courseName || !coursePrice || !courseLanguage || !courseCategory || !courseDuration) {
            return res.status(400).json({ status: 0, message: "All required fields must be provided." });
        }

        // ✅ Convert courseSection (String → Array of Objects)
        let parsedSections;
        try {
            let sectionArray = JSON.parse(courseSection); // Parse JSON string to array
            if (!Array.isArray(sectionArray)) {
                throw new Error("courseSection must be an array.");
            }

            // Convert string elements into objects
            parsedSections = sectionArray.map(sectionTitle => ({
                sectionTitle, // ✅ Ensure it's an object
                sectionVideos: [] // Empty initially
            }));
        } catch (error) {
            return res.status(400).json({ status: 0, message: "Invalid JSON format for courseSection." });
        }

        // ✅ Convert courseTags (String → Array)
        let parsedTags;
        try {
            parsedTags = JSON.parse(courseTags);
            if (!Array.isArray(parsedTags)) throw new Error("courseTags must be an array.");
        } catch (error) {
            return res.status(400).json({ status: 0, message: "Invalid JSON format for courseTags." });
        }

        // ✅ Check if course already exists
        const existingCourse = await courseModel.findOne({ courseName });
        if (existingCourse) {
            return res.status(400).json({ status: 0, message: "Course with this name already exists." });
        }

        // ✅ Get uploaded image file path
        const courseImage = req.file?.filename || "";

        // ✅ Create new course document
        const newCourse = new courseModel({
            courseName,
            coursePrice,
            courseLanguage,
            courseCategory,
            courseDuration,
            courseSection: parsedSections,  // ✅ Corrected format
            courseTags: parsedTags,
            courseDescription,
            courseRating: courseRating || 0,
            courseStatus: courseStatus || "inactive",
            courseImage,
            topCourse
        });

        // ✅ Save course to database
        await newCourse.save();

        return res.status(201).json({
            status: 1,
            message: "Course added successfully",
            data: newCourse
        });

    } catch (error) {
        console.error("Error adding course:", error);
        return res.status(500).json({ status: 0, message: "Internal Server Error", error: error.message });
    }
};





// let topCourseView = async (req, res) => {
//     let courseData = await courseModel.find({ topCourse: true }).limit(5);
//     let resObj={
//         status:1,
//         msg:"Data View",
//         data:courseData,
//         staticPath:"uploads/course/"
//     }
//     res.send(resObj)
// }

let courseView = async (req, res) => {
    let courseData=await courseModel.find()
    let resObj={
        status:1,
        msg:"Data View",
        data:courseData,
        staticPath:"uploads/course/"
    }
    res.send(resObj)
}

let courseViewOne = async (req, res) => {
    try {
      let data = await courseModel.findOne({ _id: req.params.id })
        .populate({
          path: "courseSection", // populate the embedded sections
        });
  
      // For each section, find matching videos
      for (let section of data.courseSection) {
        const videos = await videoModel.find({ 
          courseSection: section._id 
        }, "videoTopic"); // select required fields
        section.sectionVideos = videos;
      }
      
      let resObj = {
        status: 1,
        data,
        staticPath: "upload/course/"
      };
      res.send(resObj);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  

const updateCourse = async (req, res) => {
    try {
        const { 
            courseName, 
            coursePrice, 
            courseLanguage, 
            courseCategory, 
            courseDuration, 
            courseSection, 
            courseTags, 
            courseDescription, 
            courseRating, 
            courseStatus,
            topCourse 
        } = req.body;

        const { id } = req.params; // Get Course ID from URL

        // ✅ Validate Required Fields
        if (!id || !courseName || !coursePrice || !courseLanguage || !courseCategory || !courseDuration) {
            return res.status(400).json({ status: 0, message: "All required fields must be provided." });
        }

        // ✅ Fetch Existing Course
        let existingCourse = await courseModel.findById(id);
        if (!existingCourse) {
            return res.status(404).json({ status: 0, message: "Course not found!" });
        }

        // ✅ Handle JSON Parsing Errors
        let parsedSections, parsedTags;
        try {
            parsedSections = JSON.parse(courseSection); // Convert JSON string to array
            parsedTags = JSON.parse(courseTags);       // Convert JSON string to array
        } catch (error) {
            return res.status(400).json({ status: 0, message: "Invalid JSON format for sections or tags." });
        }

        let updatedFields = {
            courseName,
            coursePrice,
            courseLanguage,
            courseCategory,
            courseDuration,
            courseSection: parsedSections,
            courseTags: parsedTags,
            courseDescription,
            courseRating: courseRating || 0,
            courseStatus: courseStatus || "inactive",
            topCourse
        };

        // ✅ Handle Image Upload & Old File Deletion
        if (req.file) {
            const courseImage = req.file.filename;
            
            // ✅ Delete Old Image if Exists
            if (existingCourse.courseImage) {
                const oldImagePath = `uploads/course/${existingCourse.courseImage}`;
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete old image
                }
            }
            
            updatedFields.courseImage = courseImage; // Set new image
        }

        // ✅ Update Course
        const updatedCourse = await courseModel.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });

        return res.status(200).json({
            status: 1,
            msg: "Course updated successfully",
            data: updatedCourse
        });

    } catch (error) {
        console.error("Error updating course:", error);
        return res.status(500).json({ status: 0, message: "Something went wrong!", error });
    }
};

const courseDelete = async (req, res) => {
  try {
    const id = req.params.id;
    // Find the course document
    const courseData = await courseModel.findOne({ _id: id });
    if (!courseData) {
      return res.status(404).send({ status: 0, msg: "Course not found" });
    }

    // Remove the course image from the file system, if it exists
    const imageName = courseData.courseImage;
    const filePath = `uploads/course/${imageName}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete all videos that reference this course
    await videoModel.deleteMany({ courseName: id });

    // Delete the course document
    await courseModel.deleteOne({ _id: id });

    return res.send({ status: 1, msg: "Data Deleted" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).send({ status: 0, msg: "Internal Server Error" });
  }
};



module.exports = { addCourse ,courseView, courseViewOne, updateCourse, courseDelete};
