import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;

const createFilter = async (db_id,tableName,data) =>
{
    return await axios.post(URL +`/dbs/${db_id}/${tableName}/filter`,data)
}

const updateFilterName = async (db_id,tableName,data) =>
{
    return await axios.patch(URL +`/dbs/${db_id}/${tableName}/updateFilter`,data)
}

const deleteFilter = async (db_id,tableName,data) =>
{
    return await axios.delete(URL +`/dbs/${db_id}/${tableName}/deleteFilter`,data)
}

const updateQuery = async (db_id,tableName,data) =>
{
    return await axios.patch(URL +`/dbs/${db_id}/${tableName}/updateQuery`,data)
}





export{
    createFilter,
    updateFilterName,
    deleteFilter,
    updateQuery
 }