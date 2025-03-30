const { courseModel } = require("../../model/courseModel");
const { videoModel } = require("../../model/videoModel");

// In your course controller file

let courseFilterView = async (req, res) => {
  try {
    const { category, search, language, maxPrice, duration } = req.query;
    let query = {};

    // Apply category filter (skip if "All")
    if (category && category !== "All") {
      query.courseCategory = category;
    }
    // Apply search filter (courseName search, case-insensitive)
    if (search) {
      query.courseName = { $regex: search, $options: "i" };
    }
    // Apply language filter with case-insensitive matching
    if (language) {
      query.courseLanguage = { $regex: new RegExp(`^${language}$`, "i") };
    }
    // Apply price filter (assuming coursePrice is numeric)
    if (maxPrice) {
      query.coursePrice = { $lte: Number(maxPrice) };
    }
    // Apply duration filter (assuming courseDuration is numeric, in hours)
    if (duration) {
      // Expect duration as "min-max", e.g., "1-3"
      const [min, max] = duration.split("-").map(Number);
      query.courseDuration = { $gte: min, $lte: max };
    }

    let courseData = await courseModel.find(query);
    let resObj = {
      status: 1,
      msg: "Data View",
      data: courseData,
      staticPath: "uploads/course/"
    };
    res.status(200).json(resObj);
  } catch (error) {
    res.status(500).json({ status: 0, msg: error.message });
  }
};

let courseDetailViewOne = async (req, res) => {
    try {
      let data = await courseModel.findOne({ _id: req.params.id })
        .populate({
          path: "courseSection", // populate the embedded sections
        });
  
      // For each section, find matching videos
      for (let section of data.courseSection) {
        const videos = await videoModel.find(
          { courseSection: section._id },
          "videoLink videoTopic videoDuration"
        );
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

   

  
  module.exports = { 
    courseFilterView,
    courseDetailViewOne
   };
  