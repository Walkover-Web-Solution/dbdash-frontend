import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;

const insertRow = async (db_id,tableName,data) =>
{
    return await axios.post(URL +`/dbs/${db_id}/${tableName}/row`,data)
}

const updateRow = async (db_id,tableName,row_id,data) =>
{
    return await axios.patch(URL +`/dbs/${db_id}/${tableName}/${row_id}/rowupdate`,data)
}

const deleteRow = async (db_id,tableName,row_id) =>
{
    return await axios.patch(URL +`/dbs/${db_id}/${tableName}/deleterow`,row_id)
}


export{
    insertRow,
    updateRow,
    deleteRow
}