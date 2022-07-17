module.exports = app => {
    const user = require("../controllers/user.controller.js");
    const userMiddleware = require('../middleware/users.js');
    var router = require("express").Router();

    // Retrieve all Users
    router.get("/", user.findAll);
  
    // Retrieve a single User with id
    router.get("/:userId", user.findOne);
  
    // Update a User with id
    router.put("/:userId", user.update);
  
    // Delete a User with id
    router.delete("/:userId", user.delete);

    app.use('/api/user', router);
  };