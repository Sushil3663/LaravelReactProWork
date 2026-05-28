import React, { useState } from "react";
import { Layout } from "antd";
import { COLORS } from "../constants/style/colors";
import Header from "./header";
import Sidebar from "./sidebar";
import { ProtectedRouterWrapper } from "../constants/style/common.styled";
import RoutesContainer from "../routes/routesContainer";
const { Content } = Layout;

const Template: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout>
          <Sidebar collapsed={collapsed} />
          <Content
            style={{
              padding: 12,
              minHeight: "calc(-130px + 100vh)",
              background: COLORS.backgroundColor,
            }}
          >
            <ProtectedRouterWrapper>
              <RoutesContainer />
            </ProtectedRouterWrapper>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Template;
