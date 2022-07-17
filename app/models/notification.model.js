module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("notification", {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        descreption: {
            type: Sequelize.TEXT
        },
        eventId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'events',
                key: 'id'
            }
        },
        
        
    });
    return Notification; 
};