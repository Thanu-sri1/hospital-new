const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4004;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Notification service running on port ${PORT}`);
  });
};

startServer();
