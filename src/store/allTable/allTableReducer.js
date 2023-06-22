import { createTable1,updateTable1,getTable1, removeTable1 } from './allTableThunk';
export const initialState = {
  dbId  : "",
  tables : {},
  orgId :  "", 
  status : "idel"
};
export const reducers = {
  setAllTablesData (state,{payload}){
    return { ...state , 
      tables : payload.tables,
      dbId : payload.dbId ,
      orgId : payload?.orgId 
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
        console.log("action.payload",action.payload)
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
  }