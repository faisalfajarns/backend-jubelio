const Sequelize = require("sequelize");

module.exports = new Sequelize("test-jubelio", "postgres", "gulam12345", {
    host: "localhost",
    port: 5433,
    dialect: "postgres",
});
