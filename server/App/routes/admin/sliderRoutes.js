let express = require('express');
const { sliderDelete, sliderView, addSlider, sliderViewOne, sliderUpdate } = require('../../controller/admin/sliderContoller');
const upload = require('../../middleware/multerConfig,');

let sliderRoutes = express.Router();

// ✅ Use Multer Middleware for Image Uploads
sliderRoutes.post("/add", upload("slider").single("sliderImage"), addSlider);

 sliderRoutes.get("/view",sliderView)

sliderRoutes.get("/view-one/:id",sliderViewOne)

sliderRoutes.put("/update/:id",  upload("slider").single("sliderImage"),  sliderUpdate)

sliderRoutes.delete("/delete/:id",sliderDelete)



module.exports = {
    sliderRoutes
};
