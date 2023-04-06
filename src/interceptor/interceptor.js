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
    if (error?.response?.status === 401) {
      toast.error('Session Expired');
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
    if (error?.response?.status === 403) {
      toast.error('forbidden Error : you have limited access');
      // alert("forbidden Error : you have limited access")
    }
    if (error?.response?.status === 405) {
      toast.error("Can't Delete Becuase this Org only one DB")
    }
    else{
      console.log(error?.response?.data)
      toast.error(error?.response?.data?.message)
    }
    return Promise.reject(error);
  }
);

export default axios;
