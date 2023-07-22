import axiosInstance from '../interceptor/interceptor';

const createForm = async (db_id,tableName) =>
{
    return await axiosInstance.post(`/dbs/${db_id}/table/${tableName}/form`)
}




export {
    createForm
}