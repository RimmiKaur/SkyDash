const { transporter } = require("../../config/mailConfig");
const enquiryModel = require("../../model/enquiryModel");
const nodemailer = require("nodemailer"); // Optional: for sending emails

// Add a new enquiry
const addEnquiry = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ status: 0, msg: "Missing required fields" });
    }
    const newEnquiry = new enquiryModel({ name, email, subject, message });
    await newEnquiry.save();
    return res.status(201).json({ status: 1, msg: "Enquiry submitted successfully", data: newEnquiry });
  } catch (error) {
    console.error("Error adding enquiry:", error);
    return res.status(500).json({ status: 0, msg: error.message });
  }
};

// Fetch all enquiries (for admin)
const viewEnquiries = async (req, res) => {
  try {
    const enquiries = await enquiryModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ status: 1, msg: "Enquiries fetched successfully", data: enquiries });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return res.status(500).json({ status: 0, msg: error.message });
  }
};

// Update an enquiry with an answer and mark it as completed
const updateEnquiry = async (req, res) => {
    try {
      const { enquiryId, answer } = req.body;
      if (!enquiryId || !answer) {
        return res.status(400).json({ status: 0, msg: "Missing required fields." });
      }
      // Find the enquiry
      const enquiry = await enquiryModel.findById(enquiryId);
      if (!enquiry) {
        return res.status(404).json({ status: 0, msg: "Enquiry not found" });
      }
      // Update enquiry with the answer and mark it as completed
      enquiry.answer = answer;
      enquiry.status = "completed";
      await enquiry.save();
  
      // Setup Nodemailer transporter (adjust configuration as needed)
 

      
      // Email options
      const mailOptions = {
        from: "rimmikaur37@gmail.com", // sender email address
        to: enquiry.email, // recipient's email (from enquiry)
        subject: "Response to your enquiry",
        text: answer,
        // html: `<p>${answer}</p>`, // optionally use HTML
      };
  
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          // Optionally, return success even if email fails
          return res.status(200).json({
            status: 1,
            msg: "Enquiry answered but failed to send email",
            data: enquiry,
          });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).json({
            status: 1,
            msg: "Enquiry answered and email sent successfully",
            data: enquiry,
          });
        }
      });
    } catch (error) {
      console.error("Error updating enquiry:", error);
      return res.status(500).json({ status: 0, msg: error.message });
    }
  };
  
module.exports = { addEnquiry, viewEnquiries, updateEnquiry };
