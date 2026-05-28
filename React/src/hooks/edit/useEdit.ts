import { useMutation } from "@tanstack/react-query";
import { AxiosInstance } from "../../utils/interceptor";
import { useNavigate } from "react-router-dom";

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthResponse {
  name: String;
}

const useEdit = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await AxiosInstance.put<AuthResponse>(
        "/auth/edit/:id",
        credentials,
      );
      return response.data;
    },
    onSuccess: (response: AuthResponse) => {
      navigate("/dashboard");
      console.log(response);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
};

export default useEdit;
