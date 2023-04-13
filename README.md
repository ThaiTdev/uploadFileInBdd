
# Enregistrer l'url des fichiers upload dans ma base de données


1) Je commence par créer mon projet avec une connexion à ma base données

Ref projet: connexionBddReactNode 

2) je créer mon formulaire pour upload les fichier vers mon dossier Upload de mon backend

Ref projet: uploadFileReactNode


## uploadFile

Je vais ajouter à mon fichier uplodfile la variable "routeFile" pour envoyer l'url de mon fichier en reponse coté front vers le fichier UserForm.js

```javascript 
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
      req.protocol + "://" + req.get("host") + "/uploads/" + fileName; <-------
    // //ici je
    file.mv(uploadPath, (err) => {
      if (err) {
        return res.send("le fichier n'a pas pus être téléchargé");
      }
    });
    const message = "Fichier téléchargé avec succès !"; <-------
    res.json({ message, data: routefile });             <-------
  });
};

    
```
## UserForm.js

Dans ce fichier je récupère ma réponse à travers une variable d'état nommée "upadateFile"


```javascript
 const [upadateFile, setUpadateFile] = useState("");

```

Ici je passe me données de ma réponse à ma variable

```javascript
   accountServices
      .UploadFile(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log("Success ", res.data.message);
        console.log(res.data.data);
        setUpadateFile(res.data.data); <-------
      });

```
Ensuite j'envoi les données du formulaire vers mon api comme ceci

```javascript
   const showData = (data) => {
    let value = {
      name: data.name,
      email: data.email,
      password: data.password,
      fileUpdate: upadateFile,   <-------
    };
    accountServices
      .uploadToBdd(value, {
        headers: {
          headers: { "Content-Type": "application/json" },
        },
      })
      .then((res) => {
        console.log(res);
        navigate(`/showUser/${res.data.data.userId}`);
      });
  };


```
Voilà le code complet

```javascript
import { useState } from "react";
import FormData from "form-data";
import { accountServices } from "../_services/AccountServices";
import { useInputCreateUser } from "./Hooks/useInputCreateUser";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const [upadateFile, setUpadateFile] = useState("");
  const [register, handleSubmit, errors] = useInputCreateUser();

  let navigate = useNavigate();

  const handleChangeFile = (e) => {
    let formData = new FormData();
    formData.append("fileUpdate", e.target.files[0]);
    if (formData.get("fileUpdate")) {
      console.log("La valeur de 'fileUpdate' est:", formData.get("fileUpdate"));
    } else {
      console.log("Il n'y a pas de valeur pour 'fileUpdate'");
    }
    accountServices
      .UploadFile(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log("Success ", res.data.message);
        console.log(res.data.data);
        setUpadateFile(res.data.data);
      });
  };

  const showData = (data) => {
    let value = {
      name: data.name,
      email: data.email,
      password: data.password,
      fileUpdate: upadateFile,
    };
    accountServices
      .uploadToBdd(value, {
        headers: {
          headers: { "Content-Type": "application/json" },
        },
      })
      .then((res) => {
        console.log(res);
        navigate(`/showUser/${res.data.data.userId}`);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(showData)}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          {...register("name")}
          required
        />
        <label htmlFor="email">Votre Mail</label>
        <input
          type="email"
          id="email"
          name="email"
          {...register("email")}
          required
        />
        <label htmlFor="password">mot de passe</label>
        <input
          type="password"
          id="password"
          name="password"
          {...register("password")}
          required
        />
        <button type="submit">click here</button>
      </form>
      <label htmlFor="fileUpdate">choisir votre fichier</label>
      <input
        type="file"
        name="fileUpdate"
        id="fileUpdate"
        accept=".pdf,.doc,.docx,.odt,.png,.jpeg,.jpg"
        onChange={handleChangeFile}
      />
    </div>
  );
};
export default CreateUser;


```

Une foi l'utilisateur enregistré je renvoi ver le fichier "showUser" avec l'id de l'utilisateur récupèré dans la bdd en param

```javascript
 navigate(`/showUser/${res.data.data.userId}`);
 ```
## _services

Dans ce fichier je créer les routes vers mon api 
le endPoint "uploadToBdd" va me servir pour enregistrer mes données 
le endPoint "showUser" va me servir pour afficher les données de l'utilisateur


```javascript
//j'import mon parametrage Axios
import Axios from "../api/axios";

let UploadFile = (data) => {
  return Axios.post("/uploadfile", data);
};

let uploadToBdd = (data) => {
  return Axios.post(`/uploadToBdd/`, data);
};

let showUsers = (id) => {
  return Axios.get(`/showUser/${id}`);
};
export const accountServices = {
  UploadFile,
  uploadToBdd,
  showUsers,
};
```
## uploadToBdd.js

Ce fichier coté Backend va envoyer les données vers la base de données.

```javascript
const { User } = require("../db/sequelize");
const bcrypt = require("bcrypt");
module.exports = (app) => {
  app.post("/Api/uploadToBdd", async (req, res) => {
    //creation du code d'activation

    //recupération des données passés dans la requête
    const userData = req.body;
    //methode pour hacher le mots de passe
    bcrypt.hash(userData.password, 10, async (err, hash) => {
      if (err) {
        res.status(500).json({
          message: "Erreur lors du hashage du mot de passe",
          data: err,
        });
      }
      //modifie les valuers de 'password' et 'activationCode' pour les enregistrés en bdd
      userData.password = hash;

      try {
        await User.findOne({ where: { email: req.body.email } }).then(
          (user) => {
            if (!user) {
              //si l'utilisateur n'existe pas, je le créer.
              User.create(userData)
                //je retourne la reponse
                .then((user) => {
                  //appel de ma fonction sendConfirmationEmail pour envoyer un mail d'activation
                  const message = `Félicitation! `;
                  res.json({ message, data: user });
                })
                .catch((error) => {
                  const message =
                    "l'utilisateur n'a pas pu être ajouté. Réessayer dans quelques instants";
                  res.status(500).json({ message, data: error });
                });
            } else if (user) {
              //si il existe déja je retourn ce message d'erreur
              const message1 = `Cette adresse mail est déja utilisée`;
              return res.json({ message1 });
            }
          }
        );
      } catch (error) {
        const message =
          "l'utilisateur n'a pas pu être ajouté. Réessayer dans quelques instants";
        res.status(500).json({ message, data: error });
      }
    });
  });
};






```
## showUser.js

Ce fichier va afficher l'utilisateur après une requête vers l'api pour récupèrer les données dans la bdd

```javascript
import { accountServices } from "../_services/AccountServices";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ShowUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    accountServices
      .showUsers(id, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setName(res.data.data.name);
        setEmail(res.data.data.email);
        setImageFile(res.data.data.fileUpdate);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      User
      <div>
        <p>
          Name:<span>{name}</span>
        </p>
      </div>
      <div>
        <p>
          mail:<span>{email}</span>
        </p>
      </div>
      <div>
        <img src={imageFile} alt="" />
      </div>
    </div>
  );
};

export default ShowUser;

```
## api showUser.js

```javascript
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

```
## server.js

```javascript
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

require("./src/routes/showUser")(app);         <------    
require("./src/routes/uploadFile")(app);       
require("./src/routes/uploadToBdd")(app);      <------

app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`le server se trouve sur le PORT:${PORT}`);
});

```
