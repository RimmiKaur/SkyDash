let express = require('express');
const { webRoutes } = require('./web/webRoutes');
const { adminRoutes } = require('./admin/adminROutes');

let mainRouter = express.Router();


mainRouter.use('/admin', adminRoutes);
mainRouter.use('/web', webRoutes)


module.exports = {
    mainRouter
}