import { createTable1,updateTable1,getTable1, removeTable1, addDbInUserThunk, updateAccessOfUserInDbThunk, removeDbInUserThunk } from './allTableThunk';
export const initialState = {
  dbId  : "",
  tables : {},
  orgId :  "", 
  userAcess: {},
  userDetail :{},
  status : "idel"
};
export const reducers = {
  setAllTablesData (state,{payload}){
    return { ...state , 
      tables : payload.tables,
      dbId : payload.dbId ,
      orgId : payload?.orgId ,
      userDetail : payload?.userDetail || state?.userDetail, 
      userAcess : payload?.userAcess  || state?.userAcess
    }
  }
};
export function extraReducers(builder) {
     builder
     .addCase(createTable1.pending, (state) => {
      state.status = "loading"
    })
    .addCase(createTable1.fulfilled, (state,action) => {
      if (action.payload) {
      state.tables = action.payload;
      }
      state.status = "succeeded";
    })
    .addCase(createTable1.rejected, (state) => {
      state.status = "failed";
    })

    .addCase(getTable1.pending, (state) => {
        state.status = "loading"
      })
      .addCase(getTable1.fulfilled, (state, action) => {
        if (action.payload) {
          state.tables = action.payload.tables;
          state.dbId = action.payload._id
        }
        state.status = "succeeded";
      })
      .addCase(getTable1.rejected, (state) => {
        state.status = "failed";
      })


      .addCase(updateTable1.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateTable1.fulfilled, (state,action) => {
        if (action.payload) {
          state.tables = action.payload;
          }
        state.status = "succeeded";
      })
      .addCase(updateTable1.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(removeTable1.pending, (state) => {
        state.status = "loading"
      })
      .addCase(removeTable1.fulfilled, (state,action) => {
        if (action.payload) {
          state.tables = action.payload;
          }
        state.status = "succeeded";
      })
      .addCase(removeTable1.rejected, (state) => {
        state.status = "failed";
      })
      
    .addCase(addDbInUserThunk.pending, (state) => {

      state.status = "loading"
    })
    .addCase(addDbInUserThunk.fulfilled, (state, action) => {
      const payloadData=action.payload?.data?.data;
      
            state.status = "succeeded";
            state.userAcess=payloadData?.[`users`];
            state.userDetail=payloadData?.[`usersMapping`];
    })
    .addCase(addDbInUserThunk.rejected, (state) => {

      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })
    .addCase(updateAccessOfUserInDbThunk.pending, (state) => {

      state.status = "loading"
    })
    .addCase(updateAccessOfUserInDbThunk.fulfilled, (state, action) => {
      const payloadData=action.payload?.data?.data;
      state.status = "succeeded";
      state.userAcess=payloadData?.[`users`];
      state.userDetail=payloadData?.[`usersMapping`];

    })
    .addCase(updateAccessOfUserInDbThunk.rejected, (state) => {

      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })
    
    .addCase(removeDbInUserThunk.pending, (state) => {

      state.status = "loading"
    })
    .addCase(removeDbInUserThunk.fulfilled, (state, action) => {


      delete state.userAcess[action.payload.userId];
      delete state.userDetail[action.payload.userId];
      state.status = "succeeded";
   
    })
    .addCase(removeDbInUserThunk.rejected, (state) => {

      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })


  }