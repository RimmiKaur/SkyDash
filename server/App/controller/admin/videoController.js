const { courseModel } = require("../../model/courseModel")
const { videoModel } = require("../../model/videoModel")

let getCourseName=async (req,res)=>{
    let data=await courseModel.find({courseStatus:"active"}).select('courseName')
    let resObj={
        status:1,
        data,
       
    }
    res.send(resObj)
} 

let getCourseSection = async (req, res) => {
    try {
        let { selectedCourseName } = req.params; // Extracting selectedCourseName from request parameters
        console.log("ssssssssssss",selectedCourseName);
        let data = await courseModel.findOne({ _id: selectedCourseName }).select('courseSection');

        if (!data) {
            return res.status(404).send({ status: 0, msg: "Course not found" });
        }

        res.send({ status: 1, data });
    } catch (error) {
        res.status(500).send({ status: 0, msg: error.message });
    }
};




let videoAdd = async (req, res) => {
    console.log("asdasdsadasd", req.body);
    try {
        let { videoTopic, videoDescription, courseName, videoLink, videoDuration, videoStatus, courseSection} = req.body;

        // Ensure all required fields are provided
        if (!videoTopic || !videoDescription || !courseName || !videoLink || !courseSection  || !videoDuration) {
            return res.status(400).json({ status: 0, msg: "All fields are required!" });
        }

        // Check if the video link already exists
        const existingVideo = await videoModel.findOne({ videoLink });
        if (existingVideo) {
            return res.status(400).json({ status: 0, msg: "Video with this link already exists." });
        }

        let insObj = {
            videoTopic,
            videoDescription,
            courseName,
            videoLink,
            videoDuration,
            courseSection,
            videoStatus: videoStatus || "inactive", // Default to inactive if not provided
        };

        // If a video image is uploaded, add it
        if (req.file && req.file.filename) {
            insObj["videoImage"] = req.file.filename;
        }

        // Save new video document
        let newVideo = new videoModel(insObj);
        await newVideo.save();

        res.status(201).json({
            status: 1,
            msg: "Video Added Successfully",
            data: newVideo
        });

    } catch (error) {
        console.error("Error adding video:", error);
        res.status(500).json({ status: 0, msg: "Server Error", error });
    }
};

let videoView = async (req, res) => {
    try {
        // Fetch videos and populate course details, including the embedded course sections
        let videos = await videoModel
            .find()
            .populate({
                path: "courseName", 
                select: "courseName courseSection" // include courseSection array for lookup
            });
        
        // For each video, find the matching section inside courseName.courseSection using _id matching
        videos = videos.map(videoDoc => {
            // Convert to plain object (if not already)
            let video = videoDoc.toObject();
            
            // Check if the course document and its sections exist
            if (video.courseName && Array.isArray(video.courseName.courseSection)) {
                // Find the section whose _id matches the video's courseSection field
                const matchingSection = video.courseName.courseSection.find(section => 
                    section._id.toString() === video.courseSection.toString()
                );
                
                // If a match is found, update the courseSection field in the video response
                if (matchingSection) {
                    video.courseSection = {
                        _id: matchingSection._id,
                        sectionTitle: matchingSection.sectionTitle
                    };
                }
            }
            return video;
        });
        
        res.status(200).json({ 
            status:1,
            msg: "Videos Fetched Successfully",
            data: videos 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

let videoDelete=async (req, res)=>{
    let id=req.params.id

    //Data Delete From CourseModel

    let delRes=await videoModel.deleteOne({_id:id})
    let resObj={
        status:1,
        msg:"Data Deleted",
       
    }
    res.send(resObj)
}

let videoViewOne = async (req, res) => {
    try {
        const { id } = req.params;
        let videoDoc = await videoModel.findById(id).populate({
            path: "courseName",
            select: "courseName courseSection" // Populate courseName along with its courseSection array
        });

        if (!videoDoc) {
            return res.status(404).json({ status: 0, msg: "Video not found" });
        }

        // Convert the Mongoose document to a plain JavaScript object
        let video = videoDoc.toObject();

        // If the course document exists and has a courseSection array,
        // find the matching section using the courseSection id stored in the video document
        if (video.courseName && Array.isArray(video.courseName.courseSection)) {
            const matchingSection = video.courseName.courseSection.find(section =>
                section._id.toString() === video.courseSection.toString()
            );

            // If a matching section is found, update the video.courseSection field with its details
            if (matchingSection) {
                video.courseSection = {
                    _id: matchingSection._id,
                    sectionTitle: matchingSection.sectionTitle
                };
            }
        }

        res.status(200).json({
            status: 1,
            msg: "Video fetched successfully",
            data: video
        });
    } catch (error) {
        res.status(500).json({ status: 0, msg: error.message });
    }
};

let videoUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { videoTopic, videoDescription, courseName, videoLink, videoDuration, videoStatus, courseSection } = req.body;

        // Ensure all required fields are provided
        if (!videoTopic || !videoDescription || !courseName || !videoLink || !courseSection || !videoDuration) {
            return res.status(400).json({ status: 0, msg: "All fields are required!" });
        }


        // Optional: Check if another video with the same link exists (exclude the current video)
        const existingVideo = await videoModel.findOne({ videoLink, _id: { $ne: id } });
        if (existingVideo) {
            return res.status(400).json({ status: 0, msg: "Video with this link already exists." });
        }

        // Prepare update object
        let updateObj = {
            videoTopic,
            videoDescription,
            courseName,
            videoLink,
            videoDuration,
            courseSection,
            videoStatus: videoStatus || "inactive"
        };

        // If a new video image is uploaded, add it to the update object
        if (req.file && req.file.filename) {
            updateObj.videoImage = req.file.filename;
        }

        // Update the video document and return the new version
        let updatedVideo = await videoModel.findByIdAndUpdate(id, updateObj, { new: true });

        if (!updatedVideo) {
            return res.status(404).json({ status: 0, msg: "Video not found." });
        }

        res.status(200).json({
            status: 1,
            msg: "Video Updated Successfully",
            data: updatedVideo
        });
    } catch (error) {
        console.error("Error updating video:", error);
        res.status(500).json({ status: 0, msg: "Server Error", error });
    }
};


module.exports={
    getCourseName,
    videoAdd,
    videoView,
    videoDelete,
    getCourseSection,
    videoViewOne,
    videoUpdate
}