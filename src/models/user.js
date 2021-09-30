const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Users = sequelize.define("Users", {
  DiscordId: {
    type: DataTypes.BIGINT,
    primaryKey: true
  },
  Index: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Discriminator: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = { Users };
