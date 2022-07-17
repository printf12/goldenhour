module.exports = app => {
    var router = require("express").Router();
    const user = require("../controllers/user.controller.js");

    // register admins
    router.post("/",  user.loginUser); //userMiddleware.isAdminLoggedIn
    router.post("/facebook",  user.loginUserFacebook); //userMiddleware.isAdminLoggedIn


    app.use('/api/sign-in', router);
}; 