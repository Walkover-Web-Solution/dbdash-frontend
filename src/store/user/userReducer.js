// import { current } from '@reduxjs/toolkit';
import { removeUser, saveUser } from './userThunk';

export const initialState = {
    status:'idle',
    userLogIn:false,
    userLogOut:true,
    userFirstName:"",
    userLastName:"",
    userEmail:"",
    userProfilePic:"",
    userId:""
};

export const reducers = {
    add(state,payload){

        if(payload.payload){
          const {first_name,last_name,_id,email,profile_pic}=payload.payload;
          state.userFirstName=first_name;
          state.userLastName=last_name;
          state.userId=_id;
          state.userEmail=email;
          state.userProfilePic=profile_pic;
          state.userLogIn=true;
          state.userLogOut=false;
        }
    },
    remove(state){
      state.userFirstName='';
      state.userLastName='';
      state.userId='';
      state.userEmail='';
      state.userProfilePic='';
      state.userLogIn=false;
      state.userLogOut=true;

    }
  
};

export function extraReducers(builder) {
    builder
    //   // save User
      .addCase(saveUser.pending, (state) => {

        state.status ="loading"

      })
      .addCase(saveUser.fulfilled, (state) => {
        
        state.status = "succeeded";

      })
      .addCase(saveUser.rejected, (state) => {


        state.status = "failed";

        // MDBToast.error("Unable to fetch jamaats.");
      })

    //   remove User

      .addCase(removeUser.pending, (state) => {
  
        state.status ="loading"
      })
      .addCase(removeUser.fulfilled, (state) => {

        state.status = "succeeded";

      })
      .addCase(removeUser.rejected, (state) => {

        state.status = "failed";
        // MDBToast.error("Unable to fetch jamaats.");
      });
  }
  

