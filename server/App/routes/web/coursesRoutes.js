let express=require("express");
const { courseFilterView, courseDetailViewOne } = require("../../controller/web/courseController");

let coursesRoutes=express.Router()

coursesRoutes.get("/view",courseFilterView);
coursesRoutes.get("/view-one/:id",courseDetailViewOne);



module.exports={coursesRoutes}