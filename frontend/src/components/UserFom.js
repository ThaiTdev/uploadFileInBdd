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
