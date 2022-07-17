module.exports = (sequelize, Sequelize) => {
    const Event = sequelize.define("event", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        time: {
            type: Sequelize.DATE,
        },
        name: {
            type: Sequelize.TEXT,
        },
        place: {
            type: Sequelize.TEXT
        },
        prix1: {
            type: Sequelize.TEXT
        },
        prix2: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.INTEGER
        }, 
        entityId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'entities',
                key: 'id'
            }
        },
        img: {
            type: Sequelize.TEXT('long')
        }
      
    });
    return Event;
};