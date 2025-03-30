// orderController.js
const orderModel = require("../../model/orderModel");
const Razorpay = require("razorpay");
require("dotenv").config();

const razorpayInstance = new Razorpay({
  key_id:"rzp_test_7Mas1jS2XoDP3x",
  key_secret: "szHpmHvcGVQEXwseifCKJV8g",
});

// Add Order
let addOrder = async (req, res) => {
  try {
    const { courseId, courseName, coursePrice, orderUser } = req.body;
    if (!courseId || !courseName || !coursePrice || !orderUser) {
      return res.status(400).json({ status: 0, msg: "Missing required fields" });
    }

    // Check if an order for this user already exists (we assume one pending order per user)
    let existingOrder = await orderModel.findOne({ orderUser });
    if (existingOrder) {
      // Check if this course is already in the orderItems array.
      const exists = existingOrder.orderItems.some(
        (item) => item.courseId.toString() === courseId
      );
      if (exists) {
        return res.status(200).json({
          status: 0,
          msg: "Order already exists for this course",
        });
      }
      // Append new order item with default values.
      existingOrder.orderItems.push({
        courseId,
        courseName,
        coursePrice,
        progress: 0,
        paymentStatus: "1", // pending
        razorpayOrderId: "0",
        razorpayPayment: "0",
      });
      await existingOrder.save();
      return res.status(200).json({
        status: 1,
        msg: "Order updated successfully",
        order: existingOrder,
      });
    } else {
      // Create a new order document for this user.
      const newOrder = new orderModel({
        orderItems: [
          {
            courseId,
            courseName,
            coursePrice,
            progress: 0,
            paymentStatus: "1",
            razorpayOrderId: "0",
            razorpayPayment: "0",
          },
        ],
        orderUser,
      });
      await newOrder.save();
      return res.status(201).json({
        status: 1,
        msg: "Order added successfully",
        order: newOrder,
      });
    }
  } catch (error) {
    console.error("Error adding order:", error);
    return res.status(500).json({ status: 0, msg: error.message });
  }
};

// Create Razorpay Order
let createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ status: 0, msg: "Order ID is required" });
    }
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ status: 0, msg: "Order not found" });
    }
    // Calculate total amount from orderItems.
    const amount = order.orderItems.reduce(
      (sum, item) => sum + Number(item.coursePrice),
      0
    );
    const amountInPaise = amount * 100;
    // Create a Razorpay order.
    const razorOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_rcptid_${orderId}`,
    });
    // Update each order item with the generated razorpayOrderId.
    order.orderItems = order.orderItems.map(item => ({
      ...item.toObject(),
      razorpayOrderId: razorOrder.id,
    }));
    await order.save();
    return res.status(200).json({
      status: 1,
      msg: "Razorpay order created",
      data: razorOrder,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error creating razorpay order:", error);
    return res.status(500).json({ status: 0, msg: error.message });
  }
};

// Update Order Payment (mark as paid)
let updateOrderPayment = async (req, res) => {
  try {
    const { orderId, razorpayPayment } = req.body;
    if (!orderId || !razorpayPayment) {
      return res.status(400).json({ status: 0, msg: "Missing required fields" });
    }
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ status: 0, msg: "Order not found" });
    }
    // Update all orderItems: set payment info and mark as paid ("2").
    order.orderItems = order.orderItems.map(item => ({
      ...item.toObject(),
      razorpayPayment: razorpayPayment,
      paymentStatus: "2",
    }));
    await order.save();
    return res.status(200).json({
      status: 1,
      msg: "Order payment updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order payment:", error);
    return res.status(500).json({ status: 0, msg: error.message });
  }
};

// Update Order Progress for a specific order item.
let updateOrderProgress = async (req, res) => {
  try {
    const { orderId, courseId, progress } = req.body;
    if (!orderId || !courseId) {
      return res.status(400).json({ status: 0, msg: "Missing required fields" });
    }
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ status: 0, msg: "Order not found" });
    }
    // Find the order item matching the courseId.
    const orderItem = order.orderItems.find(
      (item) => item.courseId.toString() === courseId
    );
    if (!orderItem) {
      return res.status(404).json({ status: 0, msg: "Order item not found" });
    }
    // Update progress for the specific order item.
    orderItem.progress = progress;
    await order.save();
    return res.status(200).json({
      status: 1,
      msg: "Progress updated successfully",
      data: orderItem,
    });
  } catch (error) {
    console.error("Error updating order progress:", error);
    return res.status(500).json({ status: 0, msg: error.message });
  }
};

// Order View: Return all orders (with populated orderUser and orderItems.courseId)
let orderView = async (req, res) => {
  console.log("User:", req.user);
  try {
    // Find orders for the logged-in user where at least one orderItem has paymentStatus "1"
    const orders = await orderModel.find({
      orderUser: req.user,
      "orderItems.paymentStatus": "2"
    })
      .populate("orderUser", "name userEmail")
      .populate("orderItems.courseId");
    return res.status(200).json({
      status: 1,
      msg: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ status: 0, msg: error.message });
  }
};


// Delete an Order
let orderDelete = async (req, res) => {
  try {
    const id = req.params.id;
    await orderModel.deleteOne({ _id: id });
    return res.status(200).json({ status: 1, msg: "Order removed successfully" });
  } catch (error) {
    console.error("Error removing order:", error);
    return res.status(500).json({ status: 0, msg: error.message });
  }
};

// Get User Order By Course: Return an order for the current user that includes an orderItem for the given course.
const getUserOrderByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user; // Assumes authentication middleware sets req.user
    if (!userId) {
      return res.status(401).json({ status: 0, msg: "Unauthorized" });
    }
    const order = await orderModel.findOne({
      orderUser: userId,
      "orderItems.courseId": courseId,
    }).populate("orderItems.courseId");
    if (!order) {
      return res.status(404).json({ status: 0, msg: "Order not found for this course" });
    }
    return res.status(200).json({
      status: 1,
      msg: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching user order:", error);
    return res.status(500).json({ status: 0, msg: error.message });
  }
};

// Get Enrolled Students: For a given course, return unique users from paid orders.
const getEnrolledStudents = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    if (!courseId) {
      return res.status(400).json({ status: 0, msg: "Course ID is required" });
    }
    const orders = await orderModel.find({
      "orderItems.courseId": courseId,
      "orderItems.paymentStatus": "2"
    }).populate("orderUser", "name userEmail");
    
    const students = orders.map(order => order.orderUser).filter(Boolean);
    const uniqueStudents = [];
    const seen = new Set();
    for (const student of students) {
      if (!seen.has(student._id.toString())) {
        seen.add(student._id.toString());
        uniqueStudents.push(student);
      }
    }
    return res.status(200).json({
      status: 1,
      msg: "Enrolled students fetched successfully",
      data: uniqueStudents,
    });
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    return res.status(500).json({ status: 0, msg: error.message });
  }
};

// Get User Paid Orders: Return orders for a given user that are paid.
const getUserPaidOrders = async (req, res) => {
  try {
    const userId = req.user; // Assumes middleware sets req.user to the user's ID.
    if (!userId) {
      return res.status(400).json({ status: 0, msg: "Missing user ID" });
    }
    const orders = await orderModel.find({
      orderUser: userId,
      "orderItems.paymentStatus": "2"
    })
      .populate("orderItems.courseId")
      .populate("orderUser", "name profileImage");
    return res.status(200).json({
      status: 1,
      msg: "Paid orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching paid orders:", error);
    return res.status(500).json({ status: 0, msg: error.message });
  }
};

module.exports = {
  addOrder,
  getUserPaidOrders,
  getUserOrderByCourse,
  createRazorpayOrder,
  updateOrderPayment,
  updateOrderProgress,
  orderView,
  orderDelete,
  getEnrolledStudents,
};
