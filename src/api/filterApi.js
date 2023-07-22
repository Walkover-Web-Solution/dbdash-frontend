import axiosInstance from '../interceptor/interceptor';

const createFilter = async (db_id,tableName,data) =>
{
    return await axiosInstance.post(`/dbs/${db_id}/${tableName}/filter`,data)
}

const deleteFilter = async (db_id,tableName,data) =>
{
    return await axiosInstance.patch(`/dbs/${db_id}/${tableName}/deleteFilter`,data)
}

const updateQuery = async (db_id,tableName,data) =>
{
    return await axiosInstance.patch(`/dbs/${db_id}/${tableName}/updateQuery`,data)
}

const runQueryonTable = async(dbId,tableName,filterId,data,pageNo,limit)=>{
    return await axiosInstance.post(`/dbs/${dbId}/${tableName}/${filterId}/runQuery`,{query:data,pageNo:pageNo||1,limit:limit||100})
}
const filterQueryByAi = async (dbId,data) =>
{
   
    return await axiosInstance.post(`/dbs/${dbId}/filterquery`,data)
    
}


export{
    createFilter,
    deleteFilter,
    updateQuery,
    runQueryonTable,
    filterQueryByAi
 }