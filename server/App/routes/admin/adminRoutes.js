let express= require('express');
const { adminAuthRoute } = require('./adminAuth');
const { courseRoutes } = require('./courseRoutes');
const { videoRoutes } = require('./videoRoutes');
const { teamRoutes } = require('./teamRoutes');
const { sliderRoutes } = require('./sliderRoutes');
const enquiryRouter = require('./enquiryRoutes');

let adminRoutes= express.Router();



adminRoutes.use("/adminauth",adminAuthRoute)
adminRoutes.use("/course",courseRoutes)
adminRoutes.use("/slider",sliderRoutes)

adminRoutes.use("/video",videoRoutes)
adminRoutes.use("/team",teamRoutes)

adminRoutes.use("/enquiry",enquiryRouter)

module.exports={
    adminRoutes
}