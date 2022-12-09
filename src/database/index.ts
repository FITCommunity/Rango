import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME as string,
  process.env.DATABASE_USER as string,
  process.env.DATABASE_PASSWORD as string,
  {
    host: process.env.DATABASE_HOST as string,
    port: process.env.DATABASE_PORT as unknown as number,
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: false
    }
  }
);

export default sequelize;
