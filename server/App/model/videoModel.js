let mongoose = require('mongoose');

let videoSchema = new mongoose.Schema({
    courseName: { type: mongoose.Types.ObjectId, ref: "course", required: true }, // ✅ Corrected field name
    courseSection: { type: mongoose.Types.ObjectId, required: true }, // ✅ Directly referencing a section inside courseSection
    videoTopic: { type: String, required: true, unique:true },
    videoLink: { type: String, required: true, unique: true },
    videoDuration: { type: String, required: true, },
    videoDescription: { type: String, required: true },
    videoStatus: { type: String }
}, { timestamps: true });

let videoModel = mongoose.model("video", videoSchema);
module.exports = { videoModel };
