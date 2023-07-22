import axiosInstance from '../interceptor/interceptor';

const createField = async (db_id,tableName,data) =>
{
    return await axiosInstance.post(`/dbs/${db_id}/${tableName}/field`,data)
}
const getAllfields = async (db_id, tableName) =>{
    return  await axiosInstance.get(`/dbs/${db_id}/${tableName}/field`)
}

// get field of particular table //added by hariomm22
const updateField = async (db_id,tableName,fieldId,data) =>
{
    return await axiosInstance.patch(`/dbs/${db_id}/${tableName}/${fieldId}/updatefield`,data)
}

const hideAllField = async (db_id,tableName,data) =>
{
    return await axiosInstance.patch(`/dbs/${db_id}/${tableName}/hideallfield`,data)
}

const getQueryByAi = async (db_id,tableName,data) =>
{
    return await axiosInstance.post(`/dbs/${db_id}/${tableName}/querybyai`,data)
}

const deleteField = async (db_id,tableName,fieldName) =>
{

    return await axiosInstance.delete(`/dbs/${db_id}/${tableName}/${fieldName}/deletefield`)
}


export{
    createField,
    updateField,
    deleteField,
    getAllfields,
    getQueryByAi,
    hideAllField
}