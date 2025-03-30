let mongoose = require('mongoose');

let courseSectionSchema = new mongoose.Schema({
    sectionTitle: { type: String, required: true },
    sectionVideos: [{ type: mongoose.Types.ObjectId, ref: "video" }]
});

let courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true, unique: true },
    coursePrice: { type: Number, required: true },
    courseLanguage: { type: String },
    courseCategory: { type: String },
    courseDuration: { type: Number, required: true },
    courseSection: [courseSectionSchema], // Embedding course sections as an array
    courseTags: [{ type: String }],
    courseDescription: { type: String, required: true },
    courseRating: { type: Number, default: 5 },
    courseStatus: { type: String },
    courseImage: { type: String, required:true} ,
    topCourse:{ type: Boolean,
        default: false
    }
        // Stores the file path
}, { timestamps: true });

let courseModel = mongoose.model("course", courseSchema);
module.exports = { courseModel };
