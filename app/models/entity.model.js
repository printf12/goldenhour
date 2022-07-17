module.exports = (sequelize, Sequelize) => {
    const Entity = sequelize.define("entity", {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        img: {
            type: Sequelize.TEXT('long')
        },
        latitude: {
            type: Sequelize.FLOAT 
        },
        longitude: {
            type: Sequelize.FLOAT
        },
        description: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        userId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        
    });
    return Entity; 
};