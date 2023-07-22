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