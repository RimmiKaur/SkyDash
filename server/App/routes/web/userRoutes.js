let express=require("express");
const { userView, updateUserProfile, changePassword, viewUsers } = require("../../controller/web/userController");
const { checkUserLogin } = require("../../middleware/checkuserlogin");

let userRoutes=express.Router()


userRoutes.get("/view",checkUserLogin,  userView);


userRoutes.put("/update",checkUserLogin, updateUserProfile);
userRoutes.put("/change-password",checkUserLogin, changePassword);
userRoutes.get("/view-users", viewUsers);

userRoutes.get("/view-dashboard", viewUsers);


module.exports={userRoutes}