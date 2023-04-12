import { Routes, Route } from "react-router-dom";
import CreateUser from "../components/UserFom";

const UpdateRoute = () => {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<CreateUser />} />
      </Route>
    </Routes>
  );
};

export default UpdateRoute;
