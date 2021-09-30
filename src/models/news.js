const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const News = sequelize.define("News", {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  HashedUrl: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  DateTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Source: {
    type: DataTypes.STRING
  }
});

module.exports = { News };
