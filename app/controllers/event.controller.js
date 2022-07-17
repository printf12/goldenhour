const db = require("../models");
const Event = db.event;
const Op = db.Sequelize.Op;
const bp = require("body-parser");
// Create and Save a new Event
exports.create = (req, res) => {
  const event = req.body
  // Save Event in the database
  Event.create(event)
    .then(async data => {
      const opts = {
        errorCorrectionLevel: 'H',
        type: 'terminal',
        quality: 0.95,
        margin: 1,
        color: {
          dark: '#208698',
          light: '#FFF',
        },
      }
      res.send(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Event."
      });
    });
};
function distance(lat1,
  lat2, lon1, lon2) {

  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 = lon1 * Math.PI / 180;
  lon2 = lon2 * Math.PI / 180;
  lat1 = lat1 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a = Math.pow(Math.sin(dlat / 2), 2)
    + Math.cos(lat1) * Math.cos(lat2)
    * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;

  // calculate the result
  return (c * r);
}

// Retrieve all Events from the database.
exports.findWithDistance = async (req, res) => {

  const { name, longitude, latitude } = req.query
  let startDate = new Date();
  let endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 7);
  const today = new Date()
  const tomorrow = new Date(today)
  var d = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1)
  var condition1 = { time: { [Op.and]: { [Op.gte]: tomorrow, [Op.lte]: new Date(endDate) } } }
  var condition2 = { time: { [Op.and]: { [Op.gte]: d, [Op.lte]: new Date(tomorrow) } } }
if(name ==="soon"){
  var soon = await Event.findAll({
    where: condition1,
    include: [
      {
        model: db.entity,
      },


    ]
  })
  soon = soon?.filter(soon => {
    var dis = distance(soon.entity.latitude, latitude, soon.entity.longitude, longitude)
    if (dis < 10) {
      soon["distance"] === dis
    }
    return dis < 10
  })
  res.send(soon);

}else if (name==="current"){
  var current = await Event.findAll({
    where: condition2,
    include: [
      {
        model: db.entity,
      },


    ]
  })

  current = current?.filter(current => {
    var dis = distance(current.entity.latitude, latitude, current.entity.longitude, longitude)
    if (dis < 10) {
      current["distance"] === dis
    }
    return dis < 10
  })
  res.send(current);

} else{
  let findUser = await db.user.findOne({
    where: { id: req.params.userId },
    attributes: ['id'],
    include: [
      {
        model: db.entity,
        as: "favorite_entity",
        include: [
          {
            model: db.event,
            attributes: ['id','time','prix1',"prix2","name"],
            where: { time: { [Op.gte]: new Date() } },

          }
        ]
      }
    ]
  });
  var favoris = findUser?.favorite_entity

  favoris = favoris?.filter(entity => {
    var dis = distance(entity.latitude, latitude, entity.longitude, longitude)
    if (dis < 10) {
      entity["distance"] === dis

    }
    return dis < 10
  })
  let restos = []
  favoris.map(resto => {
    resto.events.map(event => {
      event.dataValues.restoName = resto.name
      event.dataValues.restoImage = resto.img
      restos.push(event.dataValues)
    })
  })
  res.send(restos);
}
};

// Retrieve all Events from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  let startDate = new Date();
  let endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 7);
  const today = new Date()
  const tomorrow = new Date(today)
  var d = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1)
  var condition = name === "all" ? { time: { [Op.gte]: d } } : name === "soon" ? { time: { [Op.and]: { [Op.gte]: tomorrow, [Op.lte]: new Date(endDate) } } } : name === "current" ? { time: { [Op.and]: { [Op.gte]: d, [Op.lte]: new Date(tomorrow) } } } : null

  Event.findAll({
    where: condition,
    attributes: ['id','time','prix1',"prix2","name"],
    include: [
      {
        model: db.entity,
        attributes: ['id','img',"name"],

      },


    ]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Events."
      });
    });
};
// Find a single Event with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Event.findByPk(id, {
    include: [
      {
        model: db.entity,
      }

    ]

  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Resto with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Resto with id=" + id
      });
    });
};
// Update a Event by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Event.update(req.body, {
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
// Delete a Event with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Event.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Event was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Event with id=${id}. Maybe Event was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Event with id=" + id
      });
    });
};

