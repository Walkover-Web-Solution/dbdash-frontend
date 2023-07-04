import axios from "../interceptor/interceptor.js";

const URL = process.env.REACT_APP_API_BASE_URL;

const createTemplate = async (db_id,data) =>
{
    return await axios.post(URL +`/dbs/template/${db_id}`,data)
}

const getAllCategoryName = async () =>
{
    return await axios.get(URL +`/dbs/template/`)
}
const getTemplate = async (templateId) =>
{
    return await axios.get(URL +`/dbs/template/${templateId}`)
}

const useTemplate = async (categoryName,templateId,data) =>
{
    return await axios.post(URL +`/dbs/template/${categoryName}/${templateId}`,data)
}

const deleteTemplate = async (templateId) =>
{
    return await axios.delete(URL +`/dbs/template/${templateId}/delete`)
}

export {
    createTemplate,getTemplate,deleteTemplate,useTemplate,getAllCategoryName
}