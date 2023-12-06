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

const addUserInOrg = async (id, data) =>
{
    const okk=  await axiosInstance.patch( `/orgs/${id}/handleUser?operation=add`,data);
    return okk;
}

const updateUserType = async (id, data) =>
{
    return  await axiosInstance.patch( `/orgs/${id}/handleUser?operation=update`,data)  
}



const updateOrg = async (id ,data) =>
{
    return await axiosInstance.patch( `/orgs/${id}`,data)
}

const removeUserInOrg = async (id, data) =>
{
    return await axiosInstance.patch( `/orgs/${id}/handleUser?operation=remove`,data)
}    

const deleteOrg = async (id)=>
{
    return await axiosInstance.delete( `/orgs/${id}/`)
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