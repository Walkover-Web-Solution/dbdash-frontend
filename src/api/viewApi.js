import axiosInstance from '../interceptor/interceptor';

const createView = async (db_id,tableName,data) =>
{
    return await axiosInstance.post(`/dbs/${db_id}/view/${tableName}`,data)
}

const deleteView = async (db_id,tableName,data) =>
{
    return await axiosInstance.delete(`/dbs/${db_id}/deleteview/${tableName}`,data)
}

const deleteFieldInView = async (db_id,tableName,data) =>
{
    return await axiosInstance.patch(`/dbs/${db_id}/deletefieldinview/${tableName}`,data)
}




export{
    createView,
    deleteView,
    deleteFieldInView,
}