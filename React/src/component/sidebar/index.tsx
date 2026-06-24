import { Layout, Menu, Typography } from "antd";
import { COLORS } from "../../constants/style/colors";
import { RouteList } from "../../routes/routesList";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../features/auth/api/authApi";
const { Text } = Typography;
interface IProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: IProps) => {
  const { Sider } = Layout;
  const navigate = useNavigate();
  const location = useLocation();

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

  const findSelectedKey = (
    routes: typeof filteredRoutes,
    currentPath: string,
  ): string | undefined => {
    for (const route of routes) {
      if (route.path === currentPath) return route.path;
      if (route.children) {
        const child = route.children.find((c) => c.path === currentPath);
        if (child) return child.path;
      }
    }
    return undefined;
  };

  const findOpenKey = (
    routes: typeof filteredRoutes,
    currentPath: string,
  ): string | undefined => {
    for (const route of routes) {
      if (route.children?.some((child) => child.path === currentPath)) {
        return route.pathname;
      }
    }
    return undefined;
  };

  const openKey = findOpenKey(filteredRoutes, location.pathname);

  const selectedKey = findSelectedKey(filteredRoutes, location.pathname);

  const buildMenuItems = (routes: typeof filteredRoutes) =>
    routes.map((route) => {
      if (route.children) {
        return {
          key: route.pathname,
          icon: <route.icon />,
          label: <Text style={{ fontSize: "1.6rem" }}>{route.pathname}</Text>,
          children: route.children.map((child) => ({
            key: child.path,
            icon: <child.icon />,
            label: <Text style={{ fontSize: "1.5rem" }}>{route.pathname}</Text>,
          })),
        };
      }

      return {
        key: route.path,
        icon: <route.icon />,
        label: (
          <Text>
            <Text style={{ fontSize: "1.6rem" }}>{route.pathname}</Text>
          </Text>
        ),
      };
    });
  return (
    <div>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={330}
        style={{
          background: COLORS.White,
          minWidth: "100%",
          overflow: "auto",
          height: "calc(-70px + 100vh)",
        }}
      >
        <Menu
          theme="light"
          mode="inline"
          style={{
            background: COLORS.White,
            marginTop: "0.4rem",
          }}
          selectedKeys={[selectedKey || ""]}
          defaultOpenKeys={[openKey || ""]}
          onClick={({ key }) => navigate(key)}
          items={buildMenuItems(filteredRoutes)}
        />
      </Sider>
    </div>
  );
};

export default Sidebar;
