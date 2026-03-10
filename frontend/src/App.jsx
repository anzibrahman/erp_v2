// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import AuthLayout from "./components/Layout/AuthLayout";
import MainLayout from "./components/Layout/MainLayout";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import CustomMoonLoader from "./components/Loaders/CustomMoonLoader";

const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage"));
const UserCreatePage = lazy(() => import("./pages/users/UserCreatePage"));
// if you have a dashboard:
// const HomePage = lazy(() => import("./pages/home/Home")); // or adjust path

function App() {
  return (
    <Suspense fallback={<CustomMoonLoader />}>
      <Routes>
        {/* redirect root to login */}
        <Route path="/" element={<Navigate to="/sUsers/login" replace />} />

        {/* Auth layout: login + register */}
        <Route element={<AuthLayout />}>
          <Route path="/sUsers/login" element={<LoginPage />} />
          <Route path="/sUsers/register" element={<RegisterPage />} />
        </Route>

        {/* Main layout (protected area) */}
        <Route element={<MainLayout />}>
          {/* example home route */}
          {/* <Route
            path="/home-page"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          /> */}

          {/* user creation route */}
         <Route path="/users/create" element={<UserCreatePage />} />
        </Route>

        {/* catch-all */}
        <Route path="*" element={<Navigate to="/sUsers/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
