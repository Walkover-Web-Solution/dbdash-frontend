import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;


const createOrg = async (data) =>
{
    return await axios.post(URL + "/orgs",data)
}

const getAllOrgs = async (data) => 
{
   
    return await axios.post(URL +"/orgs/getsomeorgs",{userIds:data});
 
}

const getOrgById = async (id) =>
{
    return await axios.get(URL +`/orgs/${id}`);
}

const addUserInOrg = async (id, adminId, data) =>
{
    return  await axios.patch(URL + `/orgs/${id}/${adminId}/handleUser?operation=add`,data)
}

const updateUserType = async (id, adminId, data) =>
{
    return  await axios.patch(URL + `/orgs/${id}/${adminId}/handleUser?operation=update`,data)  
}



const updateOrg = async (id ,data,userId) =>
{
    return await axios.patch(URL + `/orgs/${id}/${userId}`,data)
}

const removeUserInOrg = async (id ,adminId, data) =>
{
    return await axios.patch(URL + `/orgs/${id}/${adminId}/handleUser?operation=remove`,data)
}    

const deleteOrg = async (id,userId)=>
{
    return await axios.delete(URL + `/orgs/${id}/${userId}`)
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