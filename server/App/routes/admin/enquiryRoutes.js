const express = require("express");
const { addEnquiry, viewEnquiries, updateEnquiry } = require("../../controller/admin/enquiryContoller");
const enquiryRouter = express.Router();

// Route to submit a new enquiry
enquiryRouter.post("/add", addEnquiry);

// Route for admin to view all enquiries
enquiryRouter.get("/view", viewEnquiries);

// Route to update an enquiry (admin answers it)
enquiryRouter.put("/update", updateEnquiry);

module.exports = enquiryRouter;
