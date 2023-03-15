import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;

const createForm = async (db_id,tableName) =>
{
    return await axios.post(URL +`/dbs/${db_id}/table/${tableName}/form`)
}




export {
    createForm
}