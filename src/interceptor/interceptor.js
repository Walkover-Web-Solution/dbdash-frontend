import axios from "axios";
import { toast } from 'react-toastify'

//request interceptor
axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

//response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log(error);
    if (error?.response?.status === 401) {
      toast.error('Session Expired');
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
    if (error?.response?.status === 403) {
      alert("forbidden Error : you have limited access")
    }
    return Promise.reject(error);
  }
);

export default axios;
