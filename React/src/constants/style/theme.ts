import { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    fontFamily: "Calibri",
    fontSize: 16,
    colorPrimary: "#00833E",
    colorTextSecondary: "#6BAD86",
    colorInfo: "#172e55",
    borderRadius: 5,
    wireframe: true,
    boxShadowSecondary:
      "\n      0 5px 12px 0 rgba(0, 0, 0, 0.08),\n      0 3px 6px -4px rgba(0, 0, 0, 0.12),\n      0 9px 28px 8px rgba(0, 0, 0, 0.05)\n    ",
    colorWarning: "#f26923",
  },
  components: {
    Menu: {
      controlItemBgActive: "#00833E",
      // colorItemBgSelected: "#6BAD86", 
      collapsedWidth: 50,
    },
    Button: {
      colorPrimary: '#00833E',
      algorithm: true, // Enable algorithm
    },
    Input: {
      colorPrimary: '#00833E',
      activeShadow: "0 0 0 1px rgba(5, 145, 255, 0.1)",
    },
    Table: {
      headerBg: "#00833E",
      headerColor: "#FFFFFF",
      headerSortHoverBg: "#00833C",
      headerSortActiveBg: "#00833C",
    },
  },
};

export default theme;
