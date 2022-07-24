const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("db_a8a8c9_gh", "db_a8a8c9_gh_admin", "Oussema1", {
  host: 'SQL5053.site4now.net',
  dialect: 'mssql',
  driver: 'tedious',
  options: {
    encrypt: true,
    database: 'db_a8a8c9_gh'
  },
  pool: {
    max: 5,
    min: 0,
    acquire : 30000,
    idle: 10000
  },

  port: /*3006*/ 1433
  
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.entity = require("./entity.model.js")(sequelize, Sequelize);
db.event = require("./event.model.js")(sequelize, Sequelize);
db.notification = require("./notification.model.js")(sequelize, Sequelize);

const Scaned_Qrcode  = sequelize.define('Scaned_Qrcode', {
}, { timestamps: false });

db.user.belongsToMany(db.event, { through: Scaned_Qrcode , as:"events"});
db.event.belongsToMany(db.user, { through:  Scaned_Qrcode, as:"users" });

db.entity.belongsTo(db.user, { foreignKey: 'userId', constraints: false});
db.user.hasMany(db.entity, { foreignKey: 'userId', constraints: false });
db.event.belongsTo(db.entity, { foreignKey: 'entityId', constraints: false});
db.entity.hasMany(db.event, { foreignKey: 'entityId', constraints: false });


db.notification.belongsTo(db.event, { foreignKey: 'eventId', constraints: false});
db.event.hasMany(db.notification, { foreignKey: 'eventId', constraints: false });
db.user.belongsToMany(db.entity, {
  through: "favorite_list",
  as: "favorite_entity",
  foreignKey: "user_id",
});
db.entity.belongsToMany(db.user, {
  through: "favorite_list",
  as: "user_list",
  foreignKey: "entity_id",
});

module.exports = db;
