export interface UserType {
    status?: string;
    userLogIn?: boolean;
    userLogOut?: boolean;
    userFirstName: string | null ;
    userLastName: string | null;
    userEmail: string | null;
    userProfilePic?: string | null;
    userId: string | null;
}
export interface UserActionType {
  payload:AddPayloadType;
   
  }
  export interface AddPayloadType{
    first_name: string;
    last_name: string;
    _id: string;
    email: string;
    profile_pic: string;
  }