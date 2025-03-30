var jwt = require('jsonwebtoken');
const userModel = require("../../model/userModel");

let userView = async (req, res) => {
    try {
        let token=req.headers.authorization;
        let myToken=token.split(" ")[1]
        var decoded = jwt.verify(myToken, process.env.TOKENKEY);
    
        let id=decoded.user._id //ID
       
        let checkMyIdData=await userModel.findOne({_id:id})
        
        let user = await userModel(); 
        res.status(200).json({ 
            status:1,
            msg: "Team member Fetched Successfully",
            data: checkMyIdData 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const bcrypt = require("bcrypt");
const saltRounds = 10;

// Update user profile (name and email)
const updateUserProfile = async (req, res) => {
  try {
    // We assume that the client sends userId, name and userEmail in the body.
    const { userId, name, userEmail } = req.body;
    if (!userId || !name || !userEmail) {
      return res
        .status(400)
        .json({ status: 0, msg: "Missing required fields" });
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, userEmail },
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: 0, msg: "User not found" });
    }
    return res.status(200).json({
      status: 1,
      msg: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ status: 0, msg: error.message });
  }
};

// Change password endpoint
const changePassword = async (req, res) => {
  try {
    // Expect userId, currentPassword, and newPassword in the request body.
    const { userId, currentPassword, newPassword } = req.body;
    if (!userId || !currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ status: 0, msg: "Missing required fields" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 0, msg: "User not found" });
    }
    // Verify current password
    const passwordMatch = bcrypt.compareSync(currentPassword, user.userPassword);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 0,
        msg: "Current password is incorrect",
      });
    }
    // Hash the new password and update
    const hashedNewPassword = bcrypt.hashSync(newPassword, saltRounds);
    user.userPassword = hashedNewPassword;
    await user.save();
    return res.status(200).json({
      status: 1,
      msg: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ status: 0, msg: error.message });
  }
};


// userController.js

const viewUsers = async (req, res) => {
  try {
    // Find all users and exclude the userPassword field
    const users = await userModel.find({}, "-userPassword");
    return res.status(200).json({
      status: 1,
      msg: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ status: 0, msg: error.message });
  }
};



module.exports={
    userView ,updateUserProfile, viewUsers,changePassword
}