import axiosInstance from '../interceptor/interceptor';

const insertRow = async (db_id, tableName) => {

    return await axiosInstance.post( `/${db_id}/${tableName}`, { "records": [{}] })

}
const insertMultipleRows = async (db_id, tableName, rows) => {
    return await axiosInstance.post(`dbs/${db_id}/${tableName}/csvupload`, {"records":rows})
}

const updateRow = async (db_id, tableName, data) => {
    return await axiosInstance.patch( `/${db_id}/${tableName}`, data)
}

const deleteRow = async (db_id, tableName, row_id) => {
    return await axiosInstance.patch( `/${db_id}/${tableName}/delete`, row_id)
}
const uploadImage = async (dbId, tableName, rowId, columnId, fileobj, link) => {
    return await axiosInstance.post( `/${dbId}/${tableName}/${rowId}/upload`, {
        file: fileobj,
        columnId: columnId,
        link: link
    }, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
const uploadCSV = async (dbId, tableName, data) => {
    return await axiosInstance.post( `/${dbId}/${tableName}/csvupload`, data)
}

const getRowHistory = async (dbId, tableName, autoNumber) => {
    return await axiosInstance.post(`/${dbId}/${tableName}/${autoNumber}/history`)
}

export {
    insertRow,
    updateRow,
    deleteRow,
    uploadImage,
    uploadCSV,
    insertMultipleRows,
    getRowHistory
}