// orderModel.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course", required: true },
        courseName: { type: String, required: true, },
        coursePrice: { type: String, required: true },
        progress: {
          type: Number,
          default: 0,
        },
        paymentStatus: {
          type: String,
          enum: ["1", "2", "3"], // 1 = pending, 2 = paid, 3 = cancelled (for example)
          default: "1",
        },
        razorpayOrderId: {
          type: String,
          default: "0",
        },
        razorpayPayment: {
          type: String,
          default: "0",
        },
      },
    ],
    
    orderUser: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,

    },
   
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
