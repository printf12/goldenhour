module.exports = app => {
    const qrcode = require("../controllers/qrcode.controller.js");
    var router = require("express").Router();
    // Create a new Event
    router.post("/", qrcode.scannQrCode);
   
    app.use('/api/qrcode', router);
  };