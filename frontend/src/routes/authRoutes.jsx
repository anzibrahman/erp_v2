import { lazy } from "react";
import { Route } from "react-router-dom";

import AuthLayout from "@/components/Layout/AuthLayout";
import { ROUTES } from "@/routes/paths";

const LoginPage = lazy(() => import("@/pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/Auth/RegisterPage"));

export const authRoutes = (
  <Route element={<AuthLayout />}>
    <Route path={ROUTES.login} element={<LoginPage />} />
    <Route path={ROUTES.register} element={<RegisterPage />} />
  </Route>
);
