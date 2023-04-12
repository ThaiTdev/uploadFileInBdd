const express = require("express");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 6000;
app
  .use(express.json())
  .use(morgan("dev"))
  .use(bodyParser.json())
  .use(cors())
  .use(fileUpload());
///////////////////////// initialisation de la dbb
// const sequelize = require("./src/db/sequelize");
//je passe la methode initDb a sequelize
// sequelize.initDb();
//////////////////////////

require("./src/routes/showUser")(app);
require("./src/routes/uploadFile")(app);
require("./src/routes/uploadToBdd")(app);

app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`le server se trouve sur le PORT:${PORT}`);
});
