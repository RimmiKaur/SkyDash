let express=require("express");
const { topCourseView, teacherView } = require("../../controller/web/homeContoller");

let homeRoutes=express.Router()

homeRoutes.get("/top-courses/:category?",topCourseView);
homeRoutes.get("/teachers",teacherView);





module.exports={homeRoutes}