import { Suspense } from "react";
import LoadingSpinner from "../component/suspenseSpinner";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import { RouteList } from "./routesList";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../features/auth/api/authApi";

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
  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
  });

  const userPermissions =
    meData?.data?.user?.all_permissions ?? [];

  const filteredRoutes = RouteList.filter((route) => {
    const r = route as { permissions?: string[] };
    if (!r.permissions) return true;
    return r.permissions.some((perm) => userPermissions.includes(perm));
  });

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          {renderRoutes(filteredRoutes)}
          <Route path="*" element={<Navigate to="/page-not-found" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RoutesContainer;
