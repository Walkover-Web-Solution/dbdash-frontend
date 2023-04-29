import { createSlice } from "@reduxjs/toolkit";

import { initialState, reducers ,extraReducers } from "./databaseReducer";

const databaseSlice = createSlice({
    name: "organdDb",
    initialState,
    reducers,
    extraReducers
  });


export const { bulkAdd, createOrg, renameOrg, deleteOrg, createDb, updateDb, deleteDb,moveDb } = databaseSlice.actions;

export default databaseSlice.reducer;
