module.exports = app => {
    var router = require("express").Router();
    const user = require("../controllers/user.controller.js");

    // register admins
    router.post("/",  user.registerUser); //userMiddleware.isAdminLoggedIn
    router.post("/phone",  user.loginWithMobile); //userMiddleware.isAdminLoggedIn
    router.get("/phone",  user.finUser); //userMiddleware.isAdminLoggedIn

    app.use('/api/sign-up', router);
}; 