import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;

const insertRow = async (db_id, tableName, data) => {
    return await axios.post(URL + `/${db_id}/${tableName}`, data)
}

const updateRow = async (db_id, tableName, row_id, data) => {
    return await axios.patch(URL + `/${db_id}/${tableName}/${row_id}`, data)
}

const deleteRow = async (db_id, tableName, row_id) => {
    return await axios.patch(URL + `/${db_id}/${tableName}`, row_id)
}
const uploadImage = async (dbId, tableName, rowId, columnId,fileobj) => {
    return await axios.post(URL + `/${dbId}/${tableName}/${rowId}/upload`, {
        file: fileobj,
        columnId: columnId
    }, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export {
    insertRow,
    updateRow,
    deleteRow,
    uploadImage
}