import axios from "axios";
import { toast } from 'react-toastify'

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
  });
//request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    try{
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }},
  (error) => {
    Promise.reject(error);
  }
);

//response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    try{
    if (error?.response?.status === 401) {
      toast.error('Session Expired');
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    } else if (error?.response?.status === 403) {
      toast.error('forbidden Error : you have limited access');
      // alert("forbidden Error : you have limited access")
    } else if (error?.response?.status === 405) {
      toast.error("Can't Delete Becuase this Org only one DB")
    } else if (error?.response?.status === 404) {
      window.location.href = "/notFound";      
    } else{
      toast.error(error?.response?.data?.message)
    }
    return new Promise(() => {});
  }
  catch(e)
  {
    return Promise.reject(e);
  }
}
);

export default axiosInstance;
