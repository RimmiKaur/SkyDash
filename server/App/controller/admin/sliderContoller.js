const { sliderModel } = require("../../model/sliderModel");

// Add a new slider
const addSlider = async (req, res) => {
  try {
    // Check if a file was uploaded for sliderImage
    let sliderImage;
    if (req.file) {
      sliderImage = req.file.filename;
    } else {
      return res.send({
        status: 0,
        message: "Please upload Slider Image"
      });
    }

    // Destructure slider data from req.body
    const { sliderText,  sliderStatus } = req.body;

    // Create a new slider document
    const newSlider = new sliderModel({
      sliderText,
      sliderImage: sliderImage,
      sliderStatus
    });

    // Save the slider document to the database
    await newSlider.save();

    return res.status(201).json({
      status: 1,
      message: "Slider added successfully",
      data: newSlider
    });
  } catch (error) {
    console.error("Error adding slider:", error);
    return res.status(500).json({
      status: 0,
      message: error.message
    });
  }
};

// View all slider
const sliderView = async (req, res) => {
  try {
    // Find all slider (you can add filtering/sorting if needed)
    const slider = await sliderModel.find();
    return res.status(200).json({
      status: 1,
      message: "Slider fetched successfully",
      data: slider,
      staticPath:"uploads/slider/"
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message
    });
  }
};

// Delete a slider by id
const sliderDelete = async (req, res) => {
  try {
    const id = req.params.id;
    await sliderModel.deleteOne({ _id: id });
    return res.status(200).json({
      status: 1,
      message: "Slider deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message
    });
  }
};

let sliderUpdate = async (req, res) => {
    try {
      const { id } = req.params;
      const { sliderText, sliderStatus } = req.body;
  
      // Ensure required fields are provided
      if (!sliderText || !sliderStatus) {
        return res.status(400).json({ status: 0, msg: "All fields are required!" });
      }
  
      // Prepare the update object with new values
      let updateObj = {
        sliderText,
        sliderStatus
      };
  
      // If a new slider image is uploaded, add it to the update object
      if (req.file && req.file.filename) {
        updateObj.sliderImage = req.file.filename;
      }
  
      // Update the slider document and return the new version
      let updatedSlider = await sliderModel.findByIdAndUpdate(id, updateObj, { new: true });
      if (!updatedSlider) {
        return res.status(404).json({ status: 0, msg: "Slider not found." });
      }
  
      res.status(200).json({
        status: 1,
        msg: "Slider updated successfully",
        data: updatedSlider
      });
    } catch (error) {
      console.error("Error updating slider:", error);
      res.status(500).json({ status: 0, msg: "Server Error", error });
    }
  };
  

  let sliderViewOne = async (req, res) => {
    try {
      const { id } = req.params;
      // Find the slider by id
      let sliderDoc = await sliderModel.findById(id);
      if (!sliderDoc) {
        return res.status(404).json({ status: 0, msg: "Slider not found" });
      }
      // Convert to plain object if needed
      let slider = sliderDoc.toObject();
      res.status(200).json({
        status: 1,
        msg: "Slider fetched successfully",
        data: slider
      });
    } catch (error) {
      res.status(500).json({ status: 0, msg: error.message });
    }
  };

  
  module.exports = {
    addSlider,
    sliderView,
    sliderDelete,
    sliderViewOne,
    sliderUpdate
  };
  
