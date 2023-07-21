import { SliceCaseReducers, createSlice } from "@reduxjs/toolkit";

import { initialState, reducers, extraReducers } from "./userReducer";
import { UserType } from "../../types/userType";

const userSlice = createSlice<UserType, SliceCaseReducers<UserType>, "user">({
  name: "user",
  initialState,
  reducers,
  extraReducers
});


export const { add, remove } = userSlice.actions;

export default userSlice.reducer;
