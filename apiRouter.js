// Imports
var express = require('express');
var userController = require('./routes/userController');

// Router
exports.router = (() => {
    var apiRouter = express.Router();

    // Users routes
    apiRouter.route('/register/').post(userController.register)
    apiRouter.route('/login/').post(userController.login)

    return apiRouter;
})();