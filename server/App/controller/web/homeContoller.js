const { courseModel } = require("../../model/courseModel");
const { teamModel } = require("../../model/teamModel");
let topCourseView = async (req, res) => {
    try {
      // category parameter is optional
      const { category } = req.params; // e.g. /web/home/top-courses/:category
      // Build the query object: always require topCourse to be true
      let query = { topCourse: true };
  
      // If category is provided and is not "All", add it to the query
      if (category && category !== "All") {
        query.courseCategory = category;
      }
  
      // Query the database with the constructed query and limit to 5 results
      let courseData = await courseModel.find(query).limit(5);
  
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
  
  module.exports = { topCourseView };
  




  let teacherView = async (req, res) => {
      try {
          // Fetch teams and populate course details, including the embedded course sections
          let teams = await teamModel
              .find().limit(5)
;                  
          
          res.status(200).json({ 
              status:1,
              msg: "Team member Fetched Successfully",
              data: teams 
          });
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  };

module.exports={
    topCourseView,
    teacherView
}