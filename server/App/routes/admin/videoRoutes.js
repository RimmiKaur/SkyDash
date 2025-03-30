let express = require('express');
const {  videoAdd, videoView, getCourseName, getCourseSection, videoDelete, videoViewOne, videoUpdate } = require('../../controller/admin/videoController');
const upload = require('../../middleware/multerConfig,');

let videoRoutes = express.Router();

// ✅ Use Multer Middleware for File Uploads (If Needed)
videoRoutes.post("/add", upload("videos").none(), videoAdd); // If NO file, use upload.none()
videoRoutes.get("/course-name", getCourseName);
videoRoutes.get("/course-section/:selectedCourseName", getCourseSection);

videoRoutes.get("/view",videoView)
videoRoutes.delete("/delete/:id",videoDelete)


videoRoutes.get("/view-one/:id",videoViewOne)

videoRoutes.put("/update/:id",  upload("course").single("courseImage"),  videoUpdate)

module.exports = {
    videoRoutes
};
