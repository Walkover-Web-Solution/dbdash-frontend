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
    const sessionId = sessionStorage.getItem('sessionId');
    if(sessionId){
      config.headers["session-id"] = sessionId;
      if(window.location.pathname.includes('filter')){
        config.headers["rt-update"] = "no-update";
      }
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
      if(error.response?.data?.message.toLowerCase().indexOf("user") !== -1){
        toast.error(error.response.data.message);
      }else{
        window.location.href = "/notFound";      
      }
    } else{
      toast.error(error?.response?.data?.message)
    }
  }
  catch(e)
  {
    toast.error(`Error occurred : ${e.message}`);
  }
  return Promise.reject(error);
}
);

export default axiosInstance;
