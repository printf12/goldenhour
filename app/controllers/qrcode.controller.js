const db = require("../models");
const Event = db.event;

// Find a single Event with an id
exports.scannQrCode = (req, res) => {
    const eventId = req.body.eventId;
    const userId = req.body.userId;
    Event.findOne( {
      where: { id: eventId },
      include: [
        {    model: db.user,
             where: { id: userId },
              as:"users"
        }
      ]
  
    }).then(async data => {
        if (data) {
            res.status(404).send({message: "qrcode already used"})
        } else {
          try {
            const user=await db.user.findByPk(userId) 
          await db.event.findByPk(eventId).then(async(event) => {
              if (!event) {
                res.send("event not found!");
              }
              await event.addUser(user)
              //  await event.AddQrcode(user)
            res.status(201).send({qrCode: event, user: user}) 
            })
          .catch((err) => {
            console.log(err)
            res.status(500).send(">> Error while adding Resto to User: ", err);
          });
          
            
          } catch (error) {
            console.log(error)
          } 
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message: err
        });
      });
  };
