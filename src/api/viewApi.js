import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;

const createView = async (db_id,tableName,data) =>
{
    return await axios.post(URL +`/dbs/${db_id}/view/${tableName}`,data)
}

const deleteView = async (db_id,tableName,data) =>
{
    return await axios.delete(URL +`/dbs/${db_id}/deleteview/${tableName}`,data)
}

const deleteFieldInView = async (db_id,tableName,data) =>
{
    return await axios.delete(URL +`/dbs/${db_id}/deletefieldinview/${tableName}`,data)
}




export{
    createView,
    deleteView,
    deleteFieldInView,
}