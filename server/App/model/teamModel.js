let mongoose = require('mongoose');
const fs = require("fs");

let teamSchema = new mongoose.Schema({
    teamMemberName: 
    {
        type: String, 
        required: true,
        unique: true,
    },
    coursesName: [ { type: mongoose.Types.ObjectId, ref: "course", required: true }],
    teamImage: String,
    teamDescription: String,
    teamStatus: String
}, {
    timestamps: true
});




let teamModel=mongoose.model("team",teamSchema);
module.exports={
    teamModel
}
