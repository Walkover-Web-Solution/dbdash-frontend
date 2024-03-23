import axiosInstance from '../interceptor/interceptor';

const insertRow = async (db_id, tableName) => {

    return await axiosInstance.post( `/${db_id}/${tableName}`, { "records": [{}] })

}
const insertMultipleRows = async (db_id, tableName, rows) => {
    return await axiosInstance.post(`${db_id}/${tableName}`, {"records":rows})
}

const updateRow = async (db_id, tableName, data) => {
    return await axiosInstance.patch( `/${db_id}/${tableName}`, data)
}

const deleteRow = async (db_id, tableName, row_id) => {
    return await axiosInstance.patch( `/${db_id}/${tableName}/delete`, row_id)
}
const uploadImage = async (dbId, tableName, rowId, columnId, fileobj, link, indexIdMapping) => {
    return await axiosInstance.post( `/${dbId}/${tableName}/${rowId}/upload`, {
        file: fileobj,
        columnId: columnId,
        link: link,
        meta: indexIdMapping
    }, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
const uploadCSV = async (dbId, tableName, rows) => {
    return await axiosInstance.post(`dbs/${dbId}/${tableName}/csvupload`, {"records":rows})
}
const getRowHistory = async (dbId, tableName, autoNumber) => {
    return await axiosInstance.get(`/${dbId}/${tableName}/${autoNumber}/history`)
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