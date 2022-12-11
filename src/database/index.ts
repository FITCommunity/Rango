import { Options, Sequelize } from "sequelize";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { DEVELOPMENT_ENV } from "../constants/environments";

const env = dotenv.config();
dotenvExpand.expand(env);

const sequelizeOptions: Options =
  process.env.NODE_ENVIRONMENT === DEVELOPMENT_ENV
    ? {
        define: {
          timestamps: false
        }
      }
    : {
        define: {
          timestamps: false
        },
        dialectOptions: {
          ssl: {
            rejectUnauthorized: true
          }
        }
      };

const sequelize = new Sequelize(
  process.env.DATABASE_URL as string,
  sequelizeOptions
);

export default sequelize;
