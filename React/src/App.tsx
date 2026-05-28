import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import All from "./component/Layout";
import AntdConfig from "./utils/antdConfigs";
import GlobalStyles from "./constants/style/globalStyles";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password';

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={AntdConfig}>
        <GlobalStyles />
        {isAuthPage ? (
          location.pathname === '/login' ? <LoginPage /> : location.pathname === '/register' ? <RegisterPage /> : <ForgotPasswordPage />
        ) : (
          <All />
        )}
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
