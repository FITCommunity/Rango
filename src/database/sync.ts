import News from "./models/news";
import User from "./models/user";

const syncDatabase = async () => {
  await User.sync();
  await News.sync();

  console.log("All models were synchronized successfully.");
};

export default syncDatabase;
