import { lazy } from "react";
import { UploadOutlined, VideoCameraOutlined, UserOutlined, EditOutlined, KeyOutlined, SolutionOutlined } from "@ant-design/icons";

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
    path: "/onboarding",
    component: lazy(() => import("../features/onboarding/pages/OnboardingPage")),
    exact: true,
    pathname: "Onboarding",
    icon: SolutionOutlined,
  },
  {
    path: "/profile",
    component: lazy(() => import("../features/profile/pages/ProfilePage")),
    exact: true,
    pathname: "My Profile",
    icon: UserOutlined,
  },
  {
    path: "/profile/edit",
    component: lazy(() => import("../features/profile/pages/EditProfilePage")),
    exact: true,
    pathname: "Edit Profile",
    icon: EditOutlined,
  },
  {
    path: "/auth-information",
    component: lazy(() => import("../features/auth/pages/MePage")),
    exact: true,
    pathname: "Auth Info",
    icon: UserOutlined,
  },
  {
    path: "/change-password",
    component: lazy(() => import("../features/auth/pages/ChangePasswordPage")),
    exact: true,
    pathname: "Change Password",
    icon: KeyOutlined,
  },
  {
    path: "/user-management",
    component: lazy(() => import("../features/user-management/pages/UserManagementPage")),
    exact: true,
    pathname: "User Management",
    icon: UserOutlined,
  },
];
