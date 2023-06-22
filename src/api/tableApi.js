import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;

const createTable = async (db_id,data) =>
{
    return await axios.post(URL +`/dbs/${db_id}/table`,data)
}

const getTable = async (db_id , tableName,page) =>
{
    // return await axios.get(URL +`/dbs/${db_id}/${tableName}/fetchtable`)
    return await axios.get(URL +`/${db_id}/${tableName}?page=${page || 1}&limit=200`)
}

const updateTable = async(db_id,tableName,data) =>
{
    return await axios.patch(URL +`/dbs/${db_id}/${tableName}/updatetable`,data)
}

const deleteTable = async (db_id,tableName,data) =>
{
    return await axios.delete(URL +`/dbs/${db_id}/${tableName}/deletetable`,data)
}
const exportCSV = async (db_id,tableName,data) =>
{
    return await axios.post(URL +`/dbs/${db_id}/${tableName}/downloadcsv`,data)
}





export{
    createTable,
    getTable,
    updateTable,
    deleteTable,
    exportCSV 
}