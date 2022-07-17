// importing the dependencies
require('rootpath')();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

app.disable('x-powered-by')

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// error handler for invalid fields
app.use(function (err, req, res, next) {
    console.log('This is the invalid field ->', err.field)
    next(err)
})

// load db
const db = require("./app/models");
db.sequelize.sync();

// routes
require("./app/routes/register.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/event.routes")(app);
require("./app/routes/resto.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/qrcode.routes")(app);

// starting the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}.`);
});