import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;

const createAuthkey = async (db_id,adminId,data) =>
{
    return await axios.post(URL +`/dbs/${db_id}/admin/${adminId}/authkey`,data)
}

const getAuthkey = async (db_id,adminId) =>
{
    
    const data = await axios.get(URL +`/dbs/${db_id}/admin/${adminId}/authKeys`)

    return data
}

const getSingleAuthKey = async (db_id,adminId,authkey)=>{
    return await axios.get(URL +`/dbs/${db_id}/admin/${adminId}/${authkey}`)
}

const updateAuthkey = async (db_id,adminId,authkey,data) =>
{
    return await axios.patch(URL +`/dbs/${db_id}/admin/${adminId}/${authkey}/update`,data)
}

const deleteAuthkey = async (db_id,adminId,authkey) =>
{
    return await axios.delete(URL +`/dbs/${db_id}/admin/${adminId}/${authkey}/delete`)
}


export{
    deleteAuthkey,
    updateAuthkey,
    getSingleAuthKey,
    createAuthkey,
    getAuthkey
}