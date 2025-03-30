let express=require("express")
const { register, login } = require("../../controller/web/webAuthController");

let webAuthRoutes=express.Router()

webAuthRoutes.post("/login",login);
webAuthRoutes.post("/register",register);





module.exports={webAuthRoutes}