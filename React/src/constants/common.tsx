// Global font size
export const DEFAULT_FONT_SIZE = 10;
import "@ant-design/icons";
import { DashOutlined, UserOutlined } from "@ant-design/icons";

export const SIDEBAR_ROUTES = [
  {
    route: "/",
    name: "Dashboard",
    pathname: "Dashboard",
    icon: <DashOutlined />,
    key: "/",
  },
  {
    route: "/all",
    name: "All",
    pathname: "All",
    icon: <DashOutlined />,
    key: "/",
  },

  {
    route: "/user-management",
    name: "User Management",
    pathname: "User Management",
    icon: <UserOutlined />,
    key: "/user-management",
  },
];

export const RELOAD_PERMISSION_MESSAGE =
  "Your permission has changed. The current page will be refreshed to load your new permissions.";
export const REDIRECT_PERMISSION_MESSAGE =
  "Your permission has changed. You currently do not have permission to this features. Please work with your access control team if you would like to have access to this feature.";
