import axiosInstance from '../interceptor/interceptor';


// const URL = process.env.REACT_APP_API_BASE_URL;

const createTemplate = async (db_id,data) =>
{
    return await axiosInstance.post(`/dbs/template/${db_id}`,data)
}

const getAllCategoryName = async () =>
{
    return await axiosInstance.get(`/dbs/template/`)
}
const getTemplate = async (templateId) =>
{
    return await axiosInstance.get(`/dbs/template/${templateId}`)
}

const useTemplate = async (categoryName,templateId,data) =>
{
    return await axiosInstance.post(`/dbs/template/${categoryName}/${templateId}`,data)
}

const deleteTemplate = async (templateId) =>
{
    return await axiosInstance.delete(`/dbs/template/${templateId}/delete`)
}

export {
    createTemplate,getTemplate,deleteTemplate,useTemplate,getAllCategoryName
}