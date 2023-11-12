import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom"
import axiosClient from "./libraries";
import { LOCATIONS } from "./utils/constants";

function App() {
  const navigate = useNavigate();

  const token = window.localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      navigate(LOCATIONS.LOGIN);
    }
  }, [navigate, token]);

  return (
    !token ? <Routes>
      <Route path="login" element={<Login />} />
    </Routes> : <Routes>
      <Route index element={<ProductList />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
