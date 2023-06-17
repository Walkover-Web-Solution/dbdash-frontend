import axios from "../interceptor/interceptor.js";

const URL = process.env.REACT_APP_API_BASE_URL;

const createViewTable = async (db_id,data) =>
{
    return await axios.post(URL +`/${db_id}/view`,data)
}

const getViewTable = async (viewId) =>
{
    return await axios.get(URL +`/${viewId}`)
}

export {
    createViewTable,getViewTable
}