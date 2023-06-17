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

const moveDb=async(org_id,dbId,data)=>
{

return await axios.patch(URL+`/dbs/${org_id}/dbs/${dbId}/movedb`,data);
}

const restoreDbForUser = async(orgId,id)=>
{
    return await axios.patch(URL+`/dbs/${orgId}/${id}/restore/db`);  
}

const deleteDbForUser = async(orgId,id)=>
{
    return await axios.patch(URL+`/dbs/${orgId}/dbs/${id}/delete`);  
}


const adminPanelByAI = async (query) =>
{
     return await axios.post(URL +`/adminpanel/query/646b13964c684c360ed71d39` , {userQuery : query});
}




export {
    createDb,
    getAllDb,
    getDbById,
    getDbByOrgId,
    renameDb,
    deleteDb,
    moveDb,
    restoreDbForUser,
    deleteDbForUser,
    adminPanelByAI
}