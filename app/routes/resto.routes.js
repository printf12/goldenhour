module.exports = app => {
    const entity = require("../controllers/entity.controller.js");
    var router = require("express").Router();
    // Create a new entity
    router.post("/", entity.create);
    // Retrieve all entity
    router.get("/", entity.findAll);
    // Retrieve a single entity with id
    router.get("/:id", entity.findOne);
    // Update a entity with id
    router.put("/:id", entity.update);
    // Delete a entity with id
    router.delete("/:id", entity.delete);
    // add resto to favorite list
    router.post("/:userId/:entityId", entity.addToFavorite);
    // remove resto from favorite list
    router.post("/remove/:userId/:entityId", entity.RemoveFavorite);
    app.use('/api/entity', router);
  };