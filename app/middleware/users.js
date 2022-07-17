const jwt = require('jsonwebtoken');

module.exports = {
  validateRegister: (req, res, next) => {
    // username min length 3
    if (!req.body.username || req.body.username.length < 3) {
      return res.status(400).send({
        msg: 'Please enter a username with min. 3 chars'
      });
    }

    // password min 6 chars
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).send({
        msg: 'Please enter a password with min. 6 chars'
      });
    }

    // password (repeat) does not match
    if (
      !req.body.password_repeat ||
      req.body.password != req.body.password_repeat
    ) {
      return res.status(400).send({
        msg: 'Both passwords must match' 
      });
    }

    if(!req.body.role) {
      return res.status(400).send({
        msg: 'Please select role'
      });
    } else {
      if(req.body.role === "customer") {
        // if(!req.body.firstname) {
        //   return res.status(400).send({
        //     msg: 'Please enter first name'
        //   });
        // }

        // if(!req.body.lastname) {
        //   return res.status(400).send({
        //     msg: 'Please enter last name'
        //   });
        // }
      } else if (req.body.role === "company") {
        if(!req.body.name) {
          return res.status(400).send({
            msg: 'Please enter company name'
          });
        }
      } else if (req.body.role === "expert") {
        if(!req.body.name) {
          return res.status(400).send({
            msg: 'Please enter expert name'
          });
        }
      } 
    }

    next();
  },

  isLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        jwtConfig.secret
      );
      req.userData = decoded;
      next();
    } catch (err) {
      return res.status(401).send({
        msg: 'Your session is not valid!'
      });
    }
  },

  isAdminLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        jwtConfig.secret
      );
      req.userData = decoded;
      if(req.userData.userRole != "admin") {
        return res.status(401).send({
          msg: 'Your session is not valid!'
        });
      }
      next();
    } catch (err) {
      return res.status(401).send({
        msg: 'Your session is not valid!'
      });
    }
  },

  isExpertLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        jwtConfig.secret
      );
      req.userData = decoded;
      if(req.userData.userRole != "expert") {
        return res.status(401).send({
          msg: 'Your session is not valid!'
        });
      }
      next();
    } catch (err) {
      return res.status(401).send({
        msg: 'Your session is not valid!'
      });
    }
  },

  isCompanyLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        jwtConfig.secret
      );
      req.userData = decoded;
      if(req.userData.userRole != "company") {
        return res.status(401).send({
          msg: 'Your session is not valid!'
        });
      }
      next();
    } catch (err) {
      return res.status(401).send({
        msg: 'Your session is not valid!'
      });
    }
  }

};