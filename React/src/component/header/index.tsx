import {
  KeyOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Flex, Layout, MenuProps, Typography, Modal } from "antd";
import NMBImage from "../../assets/NMB.png";

import { useEffect, useState } from "react";
import { COLORS } from "../../constants/style/colors";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/store/hooks";
import { useLogoutMutation } from "../../features/auth/hooks/useAuthMutations";
import ChangePasswordPage from "../../features/auth/pages/ChangePasswordPage";

const { Title, Text } = Typography;

interface IHeaderProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const { Header: AntHeader } = Layout;

const Header = ({ collapsed, setCollapsed }: IHeaderProps) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 756);
    };

    window.addEventListener("resize", handleResize);

    setIsMobileView(window.innerWidth < 756);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Flex>
          <KeyOutlined style={{ marginRight: "8px" }} />
          <Text>Change Password</Text>
        </Flex>
      ),
    },
    {
      key: "2",
      label: (
        <Flex
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <LogoutOutlined style={{ marginRight: "8px" }} />
          <Text>Logout</Text>
        </Flex>
      ),
    },
  ];

  const handleImageClick = () => {
    navigate("/home");
  };
  return (
    <AntHeader
      style={{
        background: COLORS.White,
        paddingInline: "0 20px ",
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        boxShadow: `0 2px 16px -3px ${COLORS.White}, 0 2px 8px -2px${COLORS.Black}`,
        height: "6.5rem",
      }}
    >
      <Flex justify="space-between" align="center" gap={15}>
        <Flex align="center" gap={50} style={{ padding: "0.2rem" }}>
          <Button
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "23px",
              width: 64,
              height: 60,
              marginLeft: "0.3rem",
            }}
          />
          <img
            src={NMBImage}
            alt="NMB"
            style={{ width: "70px", height: "60px", marginLeft: "1rem" }}
            onClick={handleImageClick}
          />
        </Flex>
        <Flex justify="center" align="center" gap={30}>
          {!isMobileView && (
            <Title level={4} style={{ marginTop: "1rem" }}>
              Welcome, {user?.name ?? 'User'}
            </Title>
          )}
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => {
                if (key === '1') setChangePasswordOpen(true);
                if (key === '2') logoutMutation.mutate();
              },
            }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            <UserSwitchOutlined
              style={{
                cursor: "pointer",
                fontSize: 23,
                marginRight: "1.5rem",
                marginLeft: "0.5rem",
              }}
            />
          </Dropdown>
        </Flex>
      </Flex>

      <Modal
        title="Change Password"
        open={changePasswordOpen}
        onCancel={() => setChangePasswordOpen(false)}
        footer={null}
        destroyOnClose
      >
        <ChangePasswordPage />
      </Modal>
    </AntHeader>
  );
};

export default Header;
