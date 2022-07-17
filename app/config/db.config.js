module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "golden_hour",
    // PORT: 3006,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
