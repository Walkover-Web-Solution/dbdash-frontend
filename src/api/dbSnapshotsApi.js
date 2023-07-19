import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;



const restoreDb=async(db_id,backup_id,data)=>
{
    return await axios.post(URL+`/dbSnapshots/${db_id}/${backup_id}/`,data);
}



export{
    restoreDb
}