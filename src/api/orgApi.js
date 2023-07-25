import axiosInstance from '../interceptor/interceptor';

const createOrg = async (data) =>
{
    return await axiosInstance.post( "/orgs",data)
}

const getAllOrgs = async (data) => 
{
   
    return await axiosInstance.post("/orgs/getsomeorgs",{userIds:data});
 
}

const getOrgById = async (id) =>
{
    return await axiosInstance.get(`/orgs/${id}`);
}

const addUserInOrg = async (id, adminId, data) =>
{
    const okk=  await axiosInstance.patch( `/orgs/${id}/${adminId}/handleUser?operation=add`,data);
    return okk;
}

const updateUserType = async (id, adminId, data) =>
{
    return  await axiosInstance.patch( `/orgs/${id}/${adminId}/handleUser?operation=update`,data)  
}



const updateOrg = async (id ,data,userId) =>
{
    return await axiosInstance.patch( `/orgs/${id}/${userId}`,data)
}

const removeUserInOrg = async (id ,adminId, data) =>
{
    return await axiosInstance.patch( `/orgs/${id}/${adminId}/handleUser?operation=remove`,data)
}    

const deleteOrg = async (id,userId)=>
{
    return await axiosInstance.delete( `/orgs/${id}/${userId}`)
}




export {
    createOrg,
    getAllOrgs,
    getOrgById,
    addUserInOrg,
    updateOrg,
    removeUserInOrg,
    deleteOrg,
    updateUserType
}