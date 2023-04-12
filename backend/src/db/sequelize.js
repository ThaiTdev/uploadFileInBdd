const { Sequelize, DataTypes } = require("sequelize");
const UserModel = require("../models/userModel");
const users = require("./mock-user");

//je crée une instance de sequelise pour me connecter à ma base de données
const sequelize = new Sequelize("nodeuploadfile", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  dialectOptions: {
    timezone: "Etc/GMT-2",
  },
  logging: false,
});
// j'instancie le model User et lui passe les methode sequelise et Datatype
// const initDb = () => {
//   return sequelize.sync({ force: true }).then((_) => {
//     users.map((user) => {
//       User.create({
//         name: user.name,
//         email: user.email,
//         password: user.password,
//         fileUpdate: user.fileUpdate,
//       }).then((user) => console.log(user.toJSON()));
//     });
//     console.log("La base de donnée a bien été initialisée !");
//   });
// };
const User = UserModel(sequelize, DataTypes);
sequelize
  .authenticate()
  .then((_) =>
    console.log("la connexion  à la base de données a bien été établie.")
  )
  .catch((error) =>
    console.error("Impossible de se connecter à la base de données")
  );
module.exports = {
  //   initDb,
  User,
};
