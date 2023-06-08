import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;

const createWebhook = async (db_id,table_id,data) =>
{
    return await axios.post(URL +`/dbs/${db_id}/${table_id}/webhook`,data)
}

const getWebhook = async (db_id) =>
{
    
    return await axios.get(URL +`/dbs/${db_id}/webhook`)

}



const updateWebhook = async (db_id,table_id,webhook_id,data) =>
{
    return await axios.patch(URL +`/dbs/${db_id}/${table_id}/${webhook_id}/update`,data)
}

const deleteWebhook = async (db_id,table_id,webhook_id,data) =>
{
    return await axios.patch(URL +`/dbs/${db_id}/${table_id}/${webhook_id}/delete`,data)

}


export{
   createWebhook,
   getWebhook,
   updateWebhook,
   deleteWebhook
}