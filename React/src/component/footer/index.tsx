import { Footer } from "antd/es/layout/layout";

const TemplateFooter = () => {
  return (
    <div>
      <Footer style={{ textAlign: "center" }}>
        Layout ©{new Date().getFullYear()} Created by Sushil
      </Footer>
    </div>
  );
};

export default TemplateFooter;
