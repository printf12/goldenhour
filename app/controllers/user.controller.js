const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require('jsonwebtoken');

// create users
exports.registerUser = async (req, res) => {
  const newUser = req.body;
  const findUser = await User.findOne({ where: { username: newUser.username } });
  if (findUser) { // username already exists
    res.status(409).send({ msg: 'This username is already in use!' });
  } else { // username is available
    const hash = await bcrypt.hash(newUser.password, 10);
    if (!hash) {
      return res.status(500).send({ msg: 'Error while hashing the password' });
    } else { 
        let createUser = await User.create({ id: uuid.v4(), username: newUser.username, password: hash, role: newUser.role, email: newUser.email });
        if (createUser) {
          return res.status(201).send({
            msg: 'User registered successfull!',
            user: createUser.dataValues
          });
        } else {
          return res.status(400).send({ msg: 'Error while creating user' });
        }
      
    }
  }
}

// login with facebook or google
exports.loginUserFacebook = async (req, res) => {
  const { firstName, lastName,userID,image } = req.body;
  let findUser = await User.findOne({ where: { id: userID } ,  
    include: [
      {
        model: db.entity,
        as: "favorite_entity",
        include: [
          {
            model: db.event,
          
          }
        ]
      }
  
    ]
});
  if (!findUser) { // user not found
     let createUser = await User.create({ id: userID, firstname: firstName, lastname:lastName, role:'user' ,image:image });
     const token = jwt.sign({ firstname: createUser.dataValues.firstname, id: createUser.dataValues.id, userRole: createUser.dataValues.role }, 's0VGXurxyIAKLpYzUCDJNlKwFl1WRonxgJ4ny/NUqck=', { expiresIn: '365d' });
     return res.status(200).send({ msg: 'Logged in!', token: token, user: createUser.dataValues });
  } else { // username 
      const token = jwt.sign({ firstname: findUser.firstname, id: findUser.id, userRole: findUser.role }, 's0VGXurxyIAKLpYzUCDJNlKwFl1WRonxgJ4ny/NUqck=', { expiresIn: '365d' });
      return res.status(200).send({ msg: 'Logged in!', token: token, user: findUser });
    
  }
}

// login users
exports.finUser = async (req, res) => {
  const  phone  = req.query.phone ==="123456789"?req.query.phone: "+"+req.query.phone ;

  let findUser = await User.findOne({ where: { phone: phone }});
  if (!findUser) { // user not found
    return res.status(200).send({ msg: 'user not found!', user: null });
  
  } else { // username found
      const token = jwt.sign({ username: findUser.username, id: findUser.id, userRole: findUser.role }, 's0VGXurxyIAKLpYzUCDJNlKwFl1WRonxgJ4ny/NUqck=', { expiresIn: '365d' });
      return res.status(200).send({ msg: 'Logged in!', token, user: findUser });
    
  }
}
// login users
exports.loginWithMobile = async (req, res) => {
  const { phone, firstname,lastname,image } = req.body;
  let findUser = await User.findOne({ where: { phone: phone } 
});
  if (!findUser) { // user not found
    let createUser = await User.create({ id: uuid.v4(), firstname: firstname, lastname:lastname, role:'user' ,image:image, phone:phone });
     const token = jwt.sign({ firstname: createUser.dataValues.firstname, id: createUser.dataValues.id, userRole: createUser.dataValues.role }, 's0VGXurxyIAKLpYzUCDJNlKwFl1WRonxgJ4ny/NUqck=', { expiresIn: '365d' });
     return res.status(200).send({ msg: 'Logged in!', token: token, user: createUser.dataValues });
  } else { // username found
      const token = jwt.sign({ username: findUser.username, id: findUser.id, userRole: findUser.role }, 's0VGXurxyIAKLpYzUCDJNlKwFl1WRonxgJ4ny/NUqck=', { expiresIn: '365d' });
      return res.status(200).send({ msg: 'Logged in!', token, user: findUser });
    
  }
}


// login users
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  let findUser = await User.findOne({ where: { username: username } ,  
    include: [
      {
        model: db.entity,
        as: "favorite_entity",
        include: [
          {
            model: db.event,
            // where:{time:{[Op.gte]: new Date()}} ,
         
          }
        ]
      }
    ]
});
  if (!findUser) { // user not found
    res.status(401).send({ msg: 'Username or password is incorrect!' });
  } else { // username found
    let checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword) {
      return res.status(401).send({ msg: 'Username or password is incorrect!' });
    } else {
      const token = jwt.sign({ username: findUser.username, id: findUser.id, userRole: findUser.role }, 's0VGXurxyIAKLpYzUCDJNlKwFl1WRonxgJ4ny/NUqck=', { expiresIn: '365d' });
      return res.status(200).send({ msg: 'Logged in!', token, user: findUser });
    }
  }
}

// get all users (optional by role)
exports.findAll = (req, res) => {
  const role = req.query.role;
  var condition = role ? { role: { [Op.like]: `%${role}%` } } : null;
  User.findAll({where: condition})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    });
};

// get favorits list of user 
exports.findOne = async (req, res) => {
  const userId = req.params.userId;
  if(req.query.name==="list"){
    const user = await User.findByPk(
      userId,
      {   
        attributes: ['id'],
        include: [
          {
            model: db.entity,
            attributes: ['id','img',"name"],
            as: "favorite_entity",
            include: [
              {
                model: db.event,
                attributes: ['id','time','prix1',"prix2","name"],
                where:{time:{[Op.gte]: new Date()}} ,  
              }
            ]
          }
        ]
      });
      var favoris = user?.favorite_entity
      let restos = []
      favoris.map(resto => {
        resto.events.map(event => {
          event.dataValues.restoName = resto.name
          event.dataValues.restoImage = resto.img
          restos.push(event.dataValues)
        })
      })
        res.send(restos);
      
     
  }else{
    const user = await User.findByPk(
      userId,
      {   
        attributes: ['id'],
        include: [
          {
            model: db.entity,
            attributes: ['id','img',"name"],
            as: "favorite_entity",
      
          }
        ]
      });
      res.send(user)
  }


 
};
// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findByPk(userId);
  if (user) {
    User.destroy({ where: { id: userId } }).then(num => {
      if (num == 1) {
        res.send({ message: "Admin was deleted successfully!" });
      } else {
        res.send({ message: `Cannot delete Admin with userId=${userId}. Maybe Admin was not found!` });
      }
    }).catch(err => {
      res.status(500).send({ message: "Could not delete Admin with userId=" + userId });
    });
  } else {
    res.status(500).send({ message: "Could not delete Admin with userId=" + userId });
  }
};

// Update a User by the id in the request
exports.update = async (req, res) => {
  const userId = req.params.userId;
  let hash = null
  let user ={}
  if (req.body.password) {
    hash = await bcrypt.hash(req.body.password, 10);
    user.password = hash;
  }
  if (req.body.username) {
    user.username = req.body.username;
  }
  if (req.body.email) {
    user.email = req.body.email;
  }
  if (req.body.phone) {
    user.phone = req.body.phone;
  }
  User.update(user, { where: { id: userId } })
    .then(num => {
      if (num == 1) {
        res.send({ message: "User was updated successfully." });
      } else {
        res.send({ message: `Cannot update User with userId=${userId}. Maybe User was not found or req.body is empty!` });
      }
    })
    .catch(err => { res.status(500).send({ message: "Error updating User with userId=" + userId }); });
};
