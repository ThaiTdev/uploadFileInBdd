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
