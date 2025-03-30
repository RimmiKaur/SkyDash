const { courseModel } = require("../../model/courseModel")
const { teamModel } = require("../../model/teamModel")
const { videoView, videoDelete } = require("./videoController")

let getCourseName=async (req,res)=>{
    let data=await courseModel.find({courseStatus:"active"}).select('courseName')
    let resObj={
        status:1,
        data,
       
    }
    res.send(resObj)
} 

const addTeamMember = async (req, res) => {
    try {
      // Optional: if using file upload middleware (like multer), get the file name for teamImage.
      let teamImage;
      if (req.file) {
        teamImage = req.file.filename; // Adjust this as needed (e.g., file path)
      }
      else{
        return res.send({
            status:0,
            message:"Please Upload Team Member Image"
        })
      }
  
      // Destructure form data from req.body.
      const { teamMemberName, coursesName, teamDescription, teamStatus } = req.body;
  
      // Ensure coursesName is an array.
      let coursesArray;
      if (typeof coursesName === "string") {
        try {
          coursesArray = JSON.parse(coursesName);
        } catch (error) {
          // If JSON parsing fails, assume it's a single course id.
          coursesArray = [coursesName];
        }
      } else {
        coursesArray = coursesName;
      }
  
      // Create a new team member document.
      const newTeamMember = new teamModel({
        teamMemberName,
        coursesName: coursesArray,
        teamImage, // may be undefined if no file uploaded
        teamDescription,
        teamStatus,
      });
  
      // Save the document to the database.
      await newTeamMember.save();
  
      return res.status(201).json({
        status: 1,
        message: "Team member added successfully",
        data: newTeamMember,
      });
    } catch (error) {
      console.error("Error adding team member:", error);
      return res.status(500).json({
        status: 0,
        message: error.message,
      });
    }
  };

  
  let teamView = async (req, res) => {
      try {
          // Fetch teams and populate course details, including the embedded course sections
          let teams = await teamModel
              .find()
              .populate({
                  path: "coursesName", 
                  select: "courseName" // include courseSection array for lookup
              });
                  
          
          res.status(200).json({ 
              status:1,
              msg: "Team member Fetched Successfully",
              data: teams 
          });
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  };
  
  let teamDelete=async (req, res)=>{
      let id=req.params.id
  
      //Data Delete From CourseModel
  
      let delRes=await teamModel.deleteOne({_id:id})
      let resObj={
          status:1,
          msg:"Data Deleted Sucessfully",
         
      }
      res.send(resObj)
  }

  // Fetch a single team member by ID and populate the coursesName field
let teamViewOne = async (req, res) => {
    try {
      const { id } = req.params;
      // Populate the coursesName field (which is an array) with the course name from the courseModel
      let teamDoc = await teamModel.findById(id).populate({
        path: "coursesName",
        select: "courseName"
      });
  
      if (!teamDoc) {
        return res.status(404).json({ status: 0, msg: "Team member not found" });
      }
  
      // Convert to plain object (if needed)
      let team = teamDoc.toObject();
  
      res.status(200).json({
        status: 1,
        msg: "Team member fetched successfully",
        data: team
      });
    } catch (error) {
      res.status(500).json({ status: 0, msg: error.message });
    }
  };
  
  // Update an existing team member by ID
  let teamUpdate = async (req, res) => {
    try {
      const { id } = req.params;
      const { teamMemberName, coursesName, teamDescription, teamStatus } = req.body;
  
      // Ensure all required fields are provided
      if (!teamMemberName || !coursesName || !teamDescription || !teamStatus) {
        return res.status(400).json({ status: 0, msg: "All fields are required!" });
      }
  
      // Parse coursesName if it's a JSON string; ensure we have an array of course IDs
      let coursesArray;
      if (typeof coursesName === "string") {
        try {
          coursesArray = JSON.parse(coursesName);
        } catch (error) {
          // Fallback if parsing fails, assume it's a single course ID
          coursesArray = [coursesName];
        }
      } else {
        coursesArray = coursesName;
      }
  
      // Prepare the update object with new values
      let updateObj = {
        teamMemberName,
        coursesName: coursesArray,
        teamDescription,
        teamStatus
      };
  
      // If a new team image is uploaded, add it to the update object
      if (req.file && req.file.filename) {
        updateObj.teamImage = req.file.filename;
      }
  
      // Update the team document and return the new version
      let updatedTeam = await teamModel.findByIdAndUpdate(id, updateObj, { new: true });
      if (!updatedTeam) {
        return res.status(404).json({ status: 0, msg: "Team member not found." });
      }
  
      res.status(200).json({
        status: 1,
        msg: "Team member updated successfully",
        data: updatedTeam
      });
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(500).json({ status: 0, msg: "Server Error", error });
    }
  };
  

  let teamByCourse = async (req, res) => {
    try {
      // Extract the course ID from the URL parameters
      const { id } = req.params; // id is the course ID
  
      // Query the teamModel for team members where the coursesName array contains the given course ID
      const teams = await teamModel.find({ coursesName: id }).populate({
        path: "coursesName",
        select: "courseName"
      });
  
      // If no team members found, return 404
      if (!teams || teams.length === 0) {
        return res.status(404).json({
          status: 0,
          msg: "No team members found for this course."
        });
      }
  
      // Return the found team members
      res.status(200).json({
        status: 1,
        msg: "Team members fetched successfully",
        data: teams
      });
    } catch (error) {
      res.status(500).json({ status: 0, msg: error.message });
    }
  };
  

module.exports={getCourseName,
    addTeamMember,
    teamDelete, teamView,
    teamUpdate,teamViewOne,
    teamByCourse
}