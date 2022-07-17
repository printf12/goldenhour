var path = require('path');
var Multer = require('multer');
var fs = require('fs');
const { file } = require('../models');
const upload = Multer({
    storage: Multer.memoryStorage(),
    limits:{
        fileSize: 5* 1024* 1024
    },
})

module.exports = upload;