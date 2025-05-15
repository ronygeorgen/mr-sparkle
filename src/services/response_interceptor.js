import { axiosInstance, BASE_URL } from "./api";


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent infinite loop
  
        try {
          // Send refresh token request
          const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
          
          const newAccessToken = res.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
  
          // Update Authorization header and retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
  
        } catch (refreshError) {
          console.error('Refresh token invalid, logging out');
          // Optional: logout user or redirect to login
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );
