import { Suspense } from "react";
import LoadingSpinner from "../component/suspenseSpinner";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import { RouteList } from "./routesList";

const renderRoutes = (routes: typeof RouteList) => {
  return routes.map((route, i) => {
    if (route.children) {
      return route.children.map((child, j) => (
        <Route
          path={child.path}
          element={<child.component />}
          key={`${i}-${j}`}
        />
      ));
    }

    return <Route path={route.path} element={<route.component />} key={i} />;
  });
};

const RoutesContainer = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          {renderRoutes(RouteList)}
          <Route path="*" element={<Navigate to="/page-not-found" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RoutesContainer;
