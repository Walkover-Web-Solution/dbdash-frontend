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
   (error) => {
   
    if (error?.response?.status === 401) {
      toast.error('Session Expired');
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
    if (error?.response?.status === 403) {
      toast.error(error?.response.data?.message);
      // alert("forbidden Error : you have limited access")
    }
    if (error?.response.data?.message=="Can't Delete DB becuase this Org have only one DB") {
      toast.error("default db in org cannot be deleted")
    }
    return Promise.reject(error);
  }
);

export default axios;
