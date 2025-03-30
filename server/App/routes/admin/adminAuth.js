let express=require("express")
const { adminLogin } = require("../../controller/admin/adminAuthController")
const multer=require("multer")
let adminAuthRoute=express.Router()

adminAuthRoute.post("/login",multer().none(),adminLogin)



module.exports={adminAuthRoute}