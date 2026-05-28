import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import All from "./component/Layout";
import AntdConfig from "./utils/antdConfigs";
import GlobalStyles from "./constants/style/globalStyles";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={AntdConfig}>
        <GlobalStyles />
        {isAuthPage ? (
          location.pathname === '/login' ? <LoginPage /> : <RegisterPage />
        ) : (
          <All />
        )}
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
