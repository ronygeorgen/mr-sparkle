import { axiosInstance } from "./api";


  axiosInstance.interceptors.request.use(
    (config) => {
      console.log('In the request interceptor');
      
      const accessToken = localStorage.getItem('accessToken');
      
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
