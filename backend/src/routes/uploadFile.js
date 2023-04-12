module.exports = (app) => {
  app.post("/api/uploadfile", (req, res) => {
    if (!res) {
      // Gérer les erreurs de téléchargement
      return res.status(500).send(err);
    }
    const file = req.files.fileUpdate;
    const fileName =
      Date.now(req.files.fileUpdate.name) + "_" + req.files.fileUpdate.name;
    // console.log(fileName);
    let uploadPath = __dirname + "../../../uploads/" + fileName;
    // //ici je stock la valeur du chemin vers mon fichier pour la renvoyer comme "res" pour la stocker en bdd
    let routefile =
      req.protocol + "://" + req.get("host") + "/uploads/" + fileName;
    // //ici je
    file.mv(uploadPath, (err) => {
      if (err) {
        return res.send("le fichier n'a pas pus être téléchargé");
      }
    });
    const message = "Fichier téléchargé avec succès !";
    res.json({ message, data: routefile });
  });
};
