import axiosInstance from '../interceptor/interceptor';

const signUpUser = async (data)=>
{   
    return await axiosInstance.post("/users" ,data );
}

const loginUser = async (email) => {
    return await axiosInstance.post( "/users/login", email);
  }
  const getCurrentUser = async () => {
    return await axiosInstance.get( "/users/profile/me");
  }


const getAllUsers = async()=>
{
    return await axiosInstance.get( "/users")
}

const getUserById = async (id)=>
{
    return await axiosInstance.get( `/users/${id}`)
}

const updateUser = async (id,data) =>
{
    return await axiosInstance.patch( `/users/${id}`,data);
}

const deleteUser = async (id) =>
{
    return await axiosInstance.delete( `/users/${id}`);
}

const findUserByEmail = async (email) =>
{
    return await axiosInstance.get( `/users/email/${email}`);
}




export {
    signUpUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    findUserByEmail,
    loginUser,
    getCurrentUser
}