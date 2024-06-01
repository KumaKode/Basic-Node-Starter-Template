const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db-config");
const { ServerConfig } = require("./config");

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.listen(ServerConfig.PORT, async () => {
  console.log("Server Started");
  connectDB();
});
