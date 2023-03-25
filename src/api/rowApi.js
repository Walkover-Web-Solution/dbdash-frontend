import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;

const insertRow = async (db_id,tableName,data) =>
{
    return await axios.post(URL +`/${db_id}/${tableName}`,data)
}

const updateRow = async (db_id,tableName,row_id,data) =>
{
    return await axios.patch(URL +`/${db_id}/${tableName}/${row_id}`,data)
}

const deleteRow = async (db_id,tableName,row_id) =>
{
    return await axios.patch(URL +`/${db_id}/${tableName}`,row_id)
}


export{
    insertRow,
    updateRow,
    deleteRow
}