import axiosInstance from '../interceptor/interceptor';

const createDb = async (orgId , data) =>
{
    return await axiosInstance.post( `/dbs/${orgId}/dbs`,data) 
}

const duplicateDb = async (dbId, data) =>
{
     return await axiosInstance.post(`/dbs/${dbId}/duplicate`,data);
}

const getAllDb = async () =>
{
    return await axiosInstance.get( "/dbs")
}

const getDbById = async (dbId) =>
{
     return await axiosInstance.get(`/dbs/dbs/${dbId}`);
}

const getDbByOrgId = async (orgId) =>
{
    return await axiosInstance.get( `/dbs/${orgId}/alldbs`)
}

const renameDb = async (orgId,id,data) =>
{
return await axiosInstance.patch(`/dbs/${id}?operation=rename`,data)
}

const deleteDb = async (orgId,id) =>
{
     return await axiosInstance.delete(`/dbs/${orgId}/dbs/${id}`)
}

const moveDb=async(org_id,dbId,data)=>
{

return await axiosInstance.patch(`/dbs/${org_id}/dbs/${dbId}/movedb`,data);
}

const restoreDbForUser = async(orgId,id)=>
{
return await axiosInstance.patch(`/dbs/${id}?operation=restore`);
}

const deleteDbForUser = async(orgId,id)=>
{
return await axiosInstance.patch(`/dbs/${id}?operation=delete`);
}


const adminPanelByAI = async (query , id) =>
{
    return await axiosInstance.post(`/adminpanel/query/${id}` , {userQuery : query});
}

const addDbInUser=async(dbId,adminId,data)=>{
    return await axiosInstance.patch(`/dbs/${dbId}/sharedb?operation=add`,data);
}
const removeDbInUser=async(dbId,adminId,data)=>{
    return await axiosInstance.patch(`/dbs/${dbId}/sharedb?operation=delete`,data);
}
const updateAccessOfUserInDb=async(dbId,adminId,data)=>{
    return await axiosInstance.patch(`/dbs/${dbId}/sharedb?operation=update`,data);
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
    adminPanelByAI,
    duplicateDb,
    addDbInUser,
    removeDbInUser,
    updateAccessOfUserInDb,
}