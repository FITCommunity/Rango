import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DATABASE_NAME as string,
//   process.env.DATABASE_USER as string,
//   process.env.DATABASE_PASSWORD as string,
//   {
//     host: process.env.DATABASE_HOST as string,
//     dialect: "mysql",
//     logging: false,
//     ssl: true,
//     define: {
//       timestamps: false
//     },
//     dialectOptions: {
//       ssl: {
//         rejectUnauthorized: true
//       }
//     }
//   }
// );

const sequelize = new Sequelize(process.env.DATABASE_URL as string);

export default sequelize;
