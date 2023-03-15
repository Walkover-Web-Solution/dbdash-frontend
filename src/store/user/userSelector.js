export const selectActiveUser = (state) =>{
    const user=state.user;
    const fullName=user.userFirstName+" "+user.userLastName;
    const email=user.userEmail;
    const userId = user.userId;
    const  profilePic = user.userProfilePic;
    return {fullName,email,userId,profilePic};
}
