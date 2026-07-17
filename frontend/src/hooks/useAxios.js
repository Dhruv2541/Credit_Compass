import { useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const useAxios = () => {
  const { token, logout, API_BASE } = useAuth();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to inject Bearer tokens
    instance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to intercept 401 token expirations
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.warn("Session expired. Logging out...");
          logout();
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [token, logout, API_BASE]);

  return axiosInstance;
};
export default useAxios;
