import axiosInstance from '../interceptor/interceptor';

// const URL = process.env.REACT_APP_API_BASE_URL;



const restoreDb=async(db_id,backup_id,data)=>
{
    return await axiosInstance.post(`/dbSnapshots/${db_id}/${backup_id}/`,data);
}



export{
    restoreDb
}