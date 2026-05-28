import { lazy } from "react";
import { UploadOutlined, VideoCameraOutlined, UserOutlined, KeyOutlined } from "@ant-design/icons";

export const RouteList = [
  {
    path: "/",
    component: lazy(() => import("../pages/dashboard/index")),
    exact: true,
    pathname: "Dashboard",
    icon: UploadOutlined,
  },
  {
    path: "/media",
    pathname: "Media",
    icon: VideoCameraOutlined,
    children: [
      {
        path: "/media/videos",
        component: lazy(() => import("../pages/all/Video")),
        pathname: "Videos",
        icon: VideoCameraOutlined,
        exact: true,
      },
      {
        path: "/media/images",
        component: lazy(() => import("../pages/all/Image")),
        pathname: "Images",
        icon: UploadOutlined,
        exact: true,
      },
    ],
  },
  {
    path: "/card-service",
    component: lazy(() => import("../pages/dashboard/index")),
    exact: true,
    pathname: "Card",
    icon: UploadOutlined,
  },
  {
    path: "/auth-information",
    component: lazy(() => import("../features/auth/pages/MePage")),
    exact: true,
    pathname: "My Profile",
    icon: UserOutlined,
  },
  {
    path: "/change-password",
    component: lazy(() => import("../features/auth/pages/ChangePasswordPage")),
    exact: true,
    pathname: "Change Password",
    icon: KeyOutlined,
  },
];
