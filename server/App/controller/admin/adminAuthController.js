const bcrypt = require("bcrypt");
const adminModel = require("../../model/adminModel");

let adminLogin = async (req, res) => {
  const { adminUname, adminPassword } = req.body;

  console.log("pp",adminUname, adminPassword )
  // Validate required fields
  if (!adminUname || !adminPassword) {
    return res
      .status(400)
      .json({ status: 0, msg: "Username and password are required." });
  }

  try {
    const adminData = await adminModel.findOne({ adminUname });

    console.log(adminData)
    if (!adminData) {
      return res
        .status(401)
        .json({ status: 0, msg: "Invalid Username or Password." });
    }
    
                                          //admin123      dbvalue
    let isMatch = await bcrypt.compare(adminPassword, adminData.adminPassword);


    // console.log("sssss",bcrypt.compareSync("admin123", adminData.adminPassword));
    console.log("admin Password:", adminPassword);
    console.log("db password:", adminData.adminPassword);

    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: 0, msg: "Invalid Username or Password." });
    }


    // Optionally, create a token here (JWT, etc.) and send that in the response
    return res.json({ status: 1, data: adminData  });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ status: 0, msg: "Internal server error" });
  }
};

module.exports = { adminLogin };
