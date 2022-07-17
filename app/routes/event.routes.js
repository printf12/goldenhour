module.exports = app => {
    const events = require("../controllers/event.controller.js");
    var router = require("express").Router();
    // Create a new Event
    router.post("/", events.create);
    // Retrieve all events
    router.get("/", events.findAll);
    

    router.get("/:id", events.findOne);
    router.get("/distance/:userId", events.findWithDistance);

    // Update a Event with id
    router.put("/:id", events.update);
    // Delete a Event with id
    router.delete("/:id", events.delete);
    app.use('/api/event', router);
  };