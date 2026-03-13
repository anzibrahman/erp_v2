import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";

import CustomMoonLoader from "./components/Loaders/CustomMoonLoader";
import { appRoutes } from "./routes/appRoutes";
import { authRoutes } from "./routes/authRoutes";
import { ROUTES } from "./routes/paths";
import { masterRoutes } from "./routes/masterRoutes";

function App() {
  return (
    <Suspense fallback={<CustomMoonLoader />}>
      <Routes>
        {authRoutes}
        {appRoutes}
        {masterRoutes}
        <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
