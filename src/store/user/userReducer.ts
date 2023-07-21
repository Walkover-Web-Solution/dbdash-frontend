


// import { current } from '@reduxjs/toolkit';
import { removeUser, saveUser } from './userThunk';
import { UserType } from '../../types/userType'
import {  UserActionType } from '../../types/userDataType';
import { ActionReducerMapBuilder, SliceCaseReducers, ValidateSliceCaseReducers } from '@reduxjs/toolkit';
import { NoInfer } from 'react-redux';

export const initialState: UserType = {
  status: 'idle',
  userLogIn: false,
  userLogOut: true,
  userFirstName: "",
  userLastName: "",
  userEmail: "",
  userProfilePic: "",
  userId: ""
};

export const reducers: ValidateSliceCaseReducers<UserType, SliceCaseReducers<UserType>> = {
  add(state, action: UserActionType) {
    if (action.payload) {
      const { first_name, last_name, _id, email, profile_pic } = action.payload;
      state.userFirstName = first_name;
      state.userLastName = last_name;
      state.userId = _id;
      state.userEmail = email;
      state.userProfilePic = profile_pic;
      state.userLogIn = true;
      state.userLogOut = false;
    }
  },
  remove(state: UserType) {
    state.userFirstName = '';
    state.userLastName = '';
    state.userId = '';
    state.userEmail = '';
    state.userProfilePic = '';
    state.userLogIn = false;
    state.userLogOut = true;
  }
};
export function extraReducers(builder: ActionReducerMapBuilder<NoInfer<UserType>>): void {

  // export function extraReducers(builder:((builder: ActionReducerMapBuilder<NoInfer<UserType>>) => void)) {
  builder
    //   // save User
    .addCase(saveUser.pending, (state) => {

      state.status = "loading"

    })
    .addCase(saveUser.fulfilled, (state: UserType) => {

      state.status = "succeeded";

    })
    .addCase(saveUser.rejected, (state: UserType) => {


      state.status = "failed";

    })


    .addCase(removeUser.pending, (state: UserType) => {

      state.status = "loading"
    })
    .addCase(removeUser.fulfilled, (state: UserType) => {

      state.status = "succeeded";

    })
    .addCase(removeUser.rejected, (state: UserType) => {

      state.status = "failed";
    });
}


