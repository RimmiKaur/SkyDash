let express=require("express");
const { addOrder,  orderDelete, createRazorpayOrder, updateOrderPayment, updateOrderProgress, getUserOrderByCourse, getEnrolledStudents, getUserPaidOrders, orderView } = require("../../controller/web/orderController");
const { checkUserLogin } = require("../../middleware/checkuserlogin");

let orderRoutes=express.Router()

orderRoutes.post("/create-razorpay", checkUserLogin, createRazorpayOrder);

orderRoutes.post("/add",checkUserLogin, addOrder);

orderRoutes.put("/update-payment",checkUserLogin, updateOrderPayment);


orderRoutes.put("/update-progress",checkUserLogin, updateOrderProgress);

orderRoutes.get("/view",checkUserLogin, orderView);

orderRoutes.get("/view-cart",checkUserLogin, getUserPaidOrders);


orderRoutes.delete("/delete/:id",checkUserLogin,  orderDelete);

orderRoutes.get("/getByCourse/:courseId",checkUserLogin,  getUserOrderByCourse);

orderRoutes.get("/enrolled-students/:courseId", getEnrolledStudents);

orderRoutes.get("/view-dashboard", orderView);



module.exports={orderRoutes}