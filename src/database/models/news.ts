import { DataTypes, Model } from "sequelize";
import sequelize from "..";

class News extends Model {}

News.init(
  {
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
  },
  {
    sequelize: sequelize,
    modelName: "News"
  }
);

export default News;
