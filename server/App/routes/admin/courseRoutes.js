let express = require('express');
const { addCourse, courseView, courseViewOne, updateCourse, courseDelete } = require('../../controller/admin/courseContoller');
const upload = require('../../middleware/multerConfig,');

let courseRoutes = express.Router();

// ✅ Use Multer Middleware for Image Uploads
courseRoutes.post("/add", upload("course").single("courseImage"), addCourse);

courseRoutes.get("/view",courseView)

courseRoutes.get("/view-one/:id",courseViewOne)

courseRoutes.put("/update/:id",  upload("course").single("courseImage"),  updateCourse)

courseRoutes.delete("/delete/:id",courseDelete)



module.exports = {
    courseRoutes
};
