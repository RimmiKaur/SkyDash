let express = require('express');
const upload = require('../../middleware/multerConfig,');
const { addTeamMember, teamDelete, teamView, teamViewOne, teamUpdate, teamByCourse } = require('../../controller/admin/teamController');

let teamRoutes = express.Router();

// ✅ Use Multer Middleware for Image Uploads
teamRoutes.post("/add", upload("team").single("teamImage"), addTeamMember);

 teamRoutes.get("/view",teamView)

teamRoutes.get("/view-one/:id",teamViewOne)

teamRoutes.put("/update/:id",  upload("team").single("teamImage"), teamUpdate)

teamRoutes.delete("/delete/:id",teamDelete)

teamRoutes.get("/team-member/:id",teamByCourse)


module.exports = {
    teamRoutes
};
