import { useMutation } from "@tanstack/react-query";
import { AxiosInstance } from "../../utils/interceptor";
import { useNavigate } from "react-router-dom";

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  expiresIn: number;
}

const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await AxiosInstance.post<AuthResponse>(
        "/auth/login",
        credentials,
      );
      return response.data;
    },
    onSuccess: (response: AuthResponse) => {
      navigate("/dashboard");
      console.log(response);
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        throw new Error("Invalid email or password");
      }
      if (error.response?.status === 429) {
        throw new Error("Too many attempts. Please try again later.");
      }
      throw error;
    },
  });
};

export default useLogin;
