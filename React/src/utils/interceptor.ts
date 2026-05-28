import axios from "axios";
import { useNavigate } from "react-router-dom";
// add this from env or runtime config
const BASEURL = "/sample";
export const AxiosInstance = axios.create({
  baseURL: BASEURL,
});

// Request interceptor to add access token to every request

AxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    console.error("Request error ::", error);
    return Promise.reject(error);
  },
);

// Response interceptor to handle 401 and 403 response
AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Check if error response is present and error status is 401 or 403
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.error("Response error :: ", error.response);

      // fetch new access token
      try {
        const refresh_token_url = "add-your-refresh-token-endpoint";
        const response = await axios.post(refresh_token_url, {
          refresh: localStorage.getItem("refresh"), // Get refresh token from local storage
        });

        const newAccesToken = response.data.access;

        localStorage.setItem("access", newAccesToken); // Update the access token in local storage

        // Re-try the original request
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${newAccesToken}`;
        return await axios(originalRequest);
      } catch (refreshError) {
        // incase of failed refresh, re-direct to login page
        const navigate = useNavigate(); // If you have React-router-dom
        navigate("/login");

        return await Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
