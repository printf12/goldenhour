module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            primaryKey: true,
            type: Sequelize.UUID
        },
        phone: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        firstname: {
            type: Sequelize.STRING
        },
        lastname: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING,
        },
        image: {
            type: Sequelize.TEXT('long'),
        },
        role: {
            type: Sequelize.ENUM('admin','customer','user'),
            defaultValue: 'user'
        }
    });
    return User;
};