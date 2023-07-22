import axiosInstance from '../interceptor/interceptor';

const createAuthkey = async (db_id,adminId,data) =>
{
    return await axiosInstance.post(`/dbs/${db_id}/admin/${adminId}/authkey`,data)
}

const getAuthkey = async (db_id,adminId) =>
{
    
    const data = await axiosInstance.get(`/dbs/${db_id}/admin/${adminId}/authKeys`)

    return data
}

const getSingleAuthKey = async (db_id,adminId,authkey)=>{
    return await axiosInstance.get(`/dbs/${db_id}/admin/${adminId}/${authkey}`)
}

const updateAuthkey = async (db_id,adminId,authkey,data) =>
{
    return await axiosInstance.patch(`/dbs/${db_id}/admin/${adminId}/${authkey}/update`,data)
}

const deleteAuthkey = async (db_id,adminId,authkey) =>
{
    return await axiosInstance.delete(`/dbs/${db_id}/admin/${adminId}/${authkey}/delete`)
}


export{
    deleteAuthkey,
    updateAuthkey,
    getSingleAuthKey,
    createAuthkey,
    getAuthkey
}