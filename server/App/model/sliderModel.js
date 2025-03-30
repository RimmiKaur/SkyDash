let mongoose = require('mongoose');

let sliderSchema = new mongoose.Schema({
    sliderText: {
        type: String,
        required: true
    },
    sliderImage: {
        type: String,
        required: true

    },
    sliderStatus:{ type: String }
}, {
    timestamps: true
});



let sliderModel=mongoose.model("slider",sliderSchema);
module.exports={
    sliderModel
}
