import { DataTypes, Model } from "sequelize";
import sequelize from "..";

class User extends Model {}

User.init(
  {
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
  },
  { sequelize, modelName: "User" }
);

export default User;
