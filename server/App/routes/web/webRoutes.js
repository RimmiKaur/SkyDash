let express=require("express")
const { webAuthRoutes } = require("./webAuthRoutes")
const { homeRoutes } = require("./homeRoutes")
const { coursesRoutes } = require("./coursesRoutes")
const { orderRoutes } = require("./orderRoutes")
const { checkUserLogin } = require("../../middleware/checkuserlogin")
const { userRoutes } = require("./userRoutes")

let webRoutes=express.Router()

webRoutes.use("/webauth",webAuthRoutes)
webRoutes.use("/home",homeRoutes)

webRoutes.use("/course",coursesRoutes)

webRoutes.use("/order", orderRoutes)

webRoutes.use("/user", userRoutes)


module.exports={webRoutes}