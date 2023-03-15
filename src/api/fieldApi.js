import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;
const createField = async (db_id,tableName,data) =>
{
    return await axios.post(URL +`/dbs/${db_id}/${tableName}/field`,data)
}
const getAllfields = async (db_id, tableName) =>{
    return  await axios.get(URL+`/dbs/${db_id}/${tableName}/field`)
}

// get field of particular table //added by hariomm22
const updateField = async (db_id,tableName,fieldId,data) =>
{
    return await axios.patch(URL +`/dbs/${db_id}/${tableName}/${fieldId}/updatefield`,data)
}
// const deleteField = async (db_id,tableName,data) =>
// {
//     return await axios.patch(URL +`/dbs/${db_id}/${tableName}/${fieldName}/updatefield`,data)
// }

const deleteField = async (db_id,tableName,fieldName) =>
{

    return await axios.delete(URL +`/dbs/${db_id}/${tableName}/${fieldName}/deletefield`)
}
export{
    createField,
    updateField,
    deleteField,
    getAllfields,
}