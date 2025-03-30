const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const { mainRouter } = require('./App/routes/mainRoutes');
const adminModel = require('./App/model/adminModel');
const bcrypt = require("bcrypt");

require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Fixed: Correct function invocation
app.use(express.json());

// Routes
app.use(mainRouter);

app.use("/uploads/course",
    express.static("uploads/course"));

app.use("/uploads/team",
        express.static("uploads/team"));

app.use("/uploads/slider",
        express.static("uploads/slider"));

const mongoDBURL=`mongodb+srv://rimmikaur37:Am8VVk3XJcOQbtea@rimmi.vgebs.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority&appName=Rimmi`;

// Connect to MongoDB
mongoose.connect(mongoDBURL)
    .then(async() => {
        console.log("Connected to MongoDB");

        let checkAdmin=await adminModel.find()

        if(checkAdmin.length===0){
            //const saltRounds = 10;
            //const salt = bcrypt.genSaltSync(saltRounds);
            const password = await bcrypt.hash("admin123", 10);
            let admin=new adminModel({adminUname:"admin",adminPassword:password})
            
            await admin.save()
        }
        app.listen(8080, () => console.log('Server running on port 8080'));
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });
