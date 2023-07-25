import axiosInstance from '../interceptor/interceptor';


const createWebhook = async (db_id,table_id,data) =>
{
    return await axiosInstance.post(`/dbs/${db_id}/${table_id}/webhook`,data)
}

const getWebhook = async (db_id) =>
{
    
    return await axiosInstance.get(`/dbs/${db_id}/webhook`)

}



const updateWebhook = async (db_id,table_id,webhook_id,data) =>
{
    return await axiosInstance.patch(`/dbs/${db_id}/${table_id}/${webhook_id}/update`,data)
}

const deleteWebhook = async (db_id,table_id,webhook_id,data) =>
{
    return await axiosInstance.patch(`/dbs/${db_id}/${table_id}/${webhook_id}/delete`,data)

}


export{
   createWebhook,
   getWebhook,
   updateWebhook,
   deleteWebhook
}