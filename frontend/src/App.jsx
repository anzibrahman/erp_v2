// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import AuthLayout from "./components/Layout/AuthLayout";
import CustomMoonLoader from "./components/Loaders/CustomMoonLoader";

const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage"));
const HomeLayout = lazy(() => import("./components/Layout/HomeLayout"));
const HomePage = lazy(() => import("./pages/Home/HomePage"));

function App() {
  return (
    <Suspense fallback={<CustomMoonLoader />}>
      <Routes>
        {/* redirect root to login */}
        {/* <Route path="/" element={<Navigate to="/sUsers/login" replace />} /> */}

        {/* Auth layout: login + register */}
        <Route element={<AuthLayout />}>
          <Route path="/sUsers/login" element={<LoginPage />} />
          <Route path="/sUsers/register" element={<RegisterPage />} />
        </Route>

        {/* protected app layout */}
        <Route element={<HomeLayout />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        {/* catch-all */}
        <Route path="*" element={<Navigate to="/sUsers/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
