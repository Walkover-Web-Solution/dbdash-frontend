import axiosInstance from "../interceptor/interceptor";

const createTable = async (db_id, data) => {
  return (await axiosInstance.post(`/dbs/${db_id}/table`, data)).data;
};

const getTable = async (db_id, tableName, page) => {
  // return await axiosInstance.get(`/dbs/${db_id}/${tableName}/fetchtable`)
  return await axiosInstance.get(
    `/${db_id}/${tableName}?page=${page || 1}&limit=200`
  );
};

const updateTable = async (db_id, tableName, data) => {
  return await axiosInstance.patch(
    `/dbs/${db_id}/${tableName}/updatetable`,
    data
  );
};

const deleteTable = async (db_id, tableName, data) => {
  return await axiosInstance.delete(
    `/dbs/${db_id}/${tableName}/deletetable`,
    data
  );
};
const exportCSV = async (db_id, tableName, data) => {
  return await axiosInstance.post(
    `/dbs/${db_id}/${tableName}/downloadcsv`,
    data
  );
};

export { createTable, getTable, updateTable, deleteTable, exportCSV };
