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
