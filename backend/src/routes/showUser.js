const { User } = require("../db/sequelize");

module.exports = (app) => {
  app.get("/api/showUser/:id", async (req, res) => {
    // récupération des données passées dans la requête
    const id = req.params.id;
    console.log(id);
    try {
      const user = await User.findOne({ where: { userId: id } });
      if (!user) {
        // si il existe déjà, je retourne ce message d'erreur
        const message1 = `utilisateur n'existe pas`;
        return res.json({ message: message1, data: user });
      } else {
        // si l'utilisateur n'existe pas, je retourne un message de succès
        const message2 = `Profil valide`;
        return res.json({ message2: message2, data: user });
      }
    } catch (error) {
      const message3 =
        "Le profil n'a pas pu être créé. Réessayez dans quelques instants.";
      res.status(500).json({ message3, data: error });
    }
  });
};
