import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;

const createDb = async (orgId , data) =>
{
    return await axios.post(URL + `/dbs/${orgId}/dbs`,data)
    
}

const getAllDb = async () =>
{
    return await axios.get(URL + "/dbs")
}

const getDbById = async (dbId) =>
{
     return await axios.get(URL +`/dbs/dbs/${dbId}`);
}

const getDbByOrgId = async (orgId) =>
{
    return await axios.get(URL + `/dbs/${orgId}/alldbs`)
}

const renameDb = async (orgId,id,data) =>
{
     return await axios.patch(URL +`/dbs/${orgId}/dbs/${id}`,data)
}

const deleteDb = async (orgId,id) =>
{
     return await axios.delete(URL +`/dbs/${orgId}/dbs/${id}`)
}




export {
    createDb,
    getAllDb,
    getDbById,
    getDbByOrgId,
    renameDb,
    deleteDb
}