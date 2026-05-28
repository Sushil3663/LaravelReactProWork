import { Spin, theme } from "antd";

const { useToken } = theme;

const LoadingSpinner = () => {
  const { token } = useToken();
  return (
    <Spin
      tip={"Loading...."}
      size="large"
      style={{ backgroundColor: token?.colorPrimary, marginTop: "15rem" }}
    >
      <div className="content" />
    </Spin>
  );
};

export default LoadingSpinner;
