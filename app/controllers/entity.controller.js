const db = require("../models");
const Entity = db.entity;
const Op = db.Sequelize.Op;
// Create and Save a new Resto
exports.create = (req, res) => {
  const entity = req.body
  // Save Resto in the database
  Entity.create(entity)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Resto."
      });
    });
};
// Retrieve all Restos from the database.
exports.findAll = (req, res) => {
  const userId = req.query.userId;
  const id = req.query.id;

  var condition = userId ? { userId: { [Op.like]: `%${userId}%` } } : null;
  Entity.findAll({
    where: condition,
    include: [
      {
        model: db.user,
        as :'user_list',
        attributes: ['id']
       
      }
    ]
  })
    .then(data => {
      if(id){
        for (let i = 0; i < data.length; i++) {
         data[i].dataValues['favorisData'] = false
          if (data[i].user_list.length > 0) {
              var find =data[i].user_list.find(function (fav, index) {
                  if (fav.id === id)
                      return true;
                  else return false
              });
              if (find) {
                  data[i].dataValues['favorisData']= true
              }else{
                  data[i].dataValues['favorisData'] = false
              }  

          }
      }
      }
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Restos."
      });
    });
};
// Find a single Resto with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Entity.findByPk(id, {
    include: [
      {
        model: db.event,
        attributes: ['id','time','prix1',"prix2","name"],
        where:{time:{[Op.gte]: new Date()}} ,
      
      }
    ]

  })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Resto with id=" + id
      });
    });
};
// Update a Resto by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Entity.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Resto was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Resto with id=${id}. Maybe Resto was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Resto with id=" + id
      });
    });
};
// Delete a Resto with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Entity.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Resto was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Resto with id=${id}. Maybe Resto was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Resto with id=" + id
      });
    });
};

// add resto to favorite list
exports.addToFavorite= (req, res) => {
  const userId = req.params.userId;
  const entityId = req.params.entityId;

  return db.user.findByPk(userId)
    .then((user) => {
      if (!user) {
        console.log("user not found!");
        return null;
      }
      return Entity.findByPk(entityId).then(async(resto) => {
        if (!resto) {
          res.send("Resto not found!");
        }
         await resto.addUser_list(user)
         res.status(200).send({
          message:`>> added Resto id=${resto.id} to User id=${user.id}`});
      });
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send(">> Error while adding Resto to User: ", err);
    });
};

// Remove resto to favorite list
exports.RemoveFavorite = (req, res) => {
  const userId = req.params.userId;
  const entityId = req.params.entityId;
  db.user.findOne({
    where: { id: userId }
  }).then(user => {
    return Entity.findByPk(entityId).then(async(resto) => {
      if (!resto) {
        res.send("Resto not found!");
      }
      await resto.removeUser_list(user)
      res.status(200).send({
        message: "Resto was removed successfully!"
      });
    });
  }).catch(e => console.log(e));
};