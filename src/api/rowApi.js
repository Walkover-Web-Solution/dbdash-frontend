import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;

const insertRow = async (db_id, tableName) => {
    for(var i =0;i<1500; i++)
    {
          await axios.post(URL + `/${db_id}/${tableName}`, {"records": [{ }] })
    }
}


const updateRow = async (db_id, tableName, data) => {
    return await axios.patch(URL + `/${db_id}/${tableName}`, data)
}

const deleteRow = async (db_id, tableName, row_id) => {
    return await axios.patch(URL + `/${db_id}/${tableName}/delete`, row_id)
}
const uploadImage = async (dbId, tableName, rowId, columnId,fileobj,link) => {
    return await axios.post(URL + `/${dbId}/${tableName}/${rowId}/upload`, {
        file: fileobj,
        columnId: columnId,
        link:link
    }, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
const uploadCSV = async(dbId,tableName,data)=>
{
    return await axios.post(URL + `/${dbId}/${tableName}/csvupload`,data)
}

export {
    insertRow,
    updateRow,
    deleteRow,
    uploadImage,
    uploadCSV
}