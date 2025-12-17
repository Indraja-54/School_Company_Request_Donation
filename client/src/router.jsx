import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword"

import CompanyDashboard from "./pages/company/CompanyDashboard";
import NewDonationPage from "./pages/company/NewDonationPage";

import SchoolRequestsDashboard from "./pages/School/SchoolRequestsDashboard";
import CreateRequestPage from "./pages/School/CreateRequestPage";

import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/login" /> },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {path:"/forgot-password", element:<ForgotPassword />},

      {
        path: "company",
        element: <ProtectedRoute role="COMPANY" />,
        children: [
          { index: true, element: <Navigate to="dashboard" /> },
          { path: "dashboard", element: <CompanyDashboard /> },

          // 🔥 ADD THIS
          { path: "donations/new", element: <NewDonationPage /> },
        ],
      },

      {
        path: "school",
        element: <ProtectedRoute role="SCHOOL" />,
        children: [
          { index: true, element: <Navigate to="requests" /> },
          { path: "requests", element: <SchoolRequestsDashboard /> },
          { path: "requests/new", element: <CreateRequestPage /> },
        ],
      },

      { path: "*", element: <Navigate to="/login" /> },
    ],
  },
]);
