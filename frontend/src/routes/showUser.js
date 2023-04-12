import { Routes, Route } from "react-router-dom";
import ShowUser from "../components/ShowUser";

const GetUser = () => {
  return (
    <Routes>
      <Route>
        <Route path="/showUser/:id" element={<ShowUser />} />
      </Route>
    </Routes>
  );
};

export default GetUser;
