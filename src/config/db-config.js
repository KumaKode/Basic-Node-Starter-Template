const mongoose = require("mongoose");
const { ServerConfig } = require("../config");

async function connectDB() {
  console.log("connecting to DB...");
  await mongoose.connect(ServerConfig.DB_URL).then(() => {
    console.log("DB connected");
  });
}

module.exports = connectDB;
