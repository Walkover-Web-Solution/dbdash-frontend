import axios from "../interceptor/interceptor.js";
const URL = process.env.REACT_APP_API_BASE_URL;

const signUpUser = async (data)=>
{   
    return await axios.post(URL +"/users" ,data );
}


const loginUser = async (email) => {
    return await axios.post(URL + "/users/login", email);
  }
  const getCurrentUser = async () => {
    return await axios.get(URL + "/users/profile/me");
  }
  

const createUser = async (data)=>
{
    return await axios.post(URL + "/users",data);
}

const getAllUsers = async()=>
{
    return await axios.get(URL + "/users")
}

const getUserById = async (id)=>
{
    return await axios.get(URL + `/users/${id}`)
}

const updateUser = async (id,data) =>
{
    return await axios.patch(URL + `/users/${id}`,data);
}

const deleteUser = async (id) =>
{
    return await axios.delete(URL + `/users/${id}`);
}

const findUserByEmail = async (email) =>
{
    return await axios.get(URL + `/users/email/${email}`);
}




export {
    signUpUser,
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    findUserByEmail,
    loginUser,
    getCurrentUser
}