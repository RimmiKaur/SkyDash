const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    adminUname: {
      type: String,
      required: true,
      unique: true,
    },
    adminPassword: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving


// adminSchema.pre("save", async function (next) {
//   if (!this.isModified("adminPassword")) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.adminPassword = await bcrypt.hash(this.adminPassword, salt);
//     next();
//   } catch (error) {
//     next(error); // Pass the error to the next middleware
//   }
// });


const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;
