import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  const location = useLocation();

  // ❌ Hide navbar on login & register
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register"||
    location.pathname==="/forgot-password";

  return (
    <>
      {!hideNavbar && <Navbar />}   {/* 🔥 HERE */}
      <Outlet />                    {/* 🔥 ROUTES RENDER HERE */}
    </>
  );
};

export default App;
