import axiosInstance from "../interceptor/interceptor";

// const URL = process.env.REACT_APP_API_BASE_URL;

const createViewTable = async (db_id, data) => {
  return await axiosInstance.post(`view/${db_id}/view`, data);
};

const getViewTable = async (viewId) => {
  return await axiosInstance.get(`view/${viewId}`);
};

export { createViewTable, getViewTable };
