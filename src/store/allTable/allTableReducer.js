import { createTableThunk,renameTableThunk,getAllTableThunk, removeTableThunk } from './allTableThunk';
export const initialState = {
  dbId  : "",
  tables : {},
  status : "idel"
};
export const reducers = {
  setAllTablesData (state,{payload}){
    return { ...state , 
      tables : payload.tables,
      dbId : payload.dbId
    }
  }
};
export function extraReducers(builder) {
     builder
     .addCase(createTableThunk.pending, (state) => {
      state.status = "loading"
    })
    .addCase(createTableThunk.fulfilled, (state,action) => {
      if (action.payload) {
      state.tables = action.payload;
      }
      state.status = "succeeded";
    })
    .addCase(createTableThunk.rejected, (state) => {
      state.status = "failed";
    })

    .addCase(getAllTableThunk.pending, (state) => {
        state.status = "loading"
      })
      .addCase(getAllTableThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.tables = action.payload.tables;
          state.dbId = action.payload._id
        }
        state.status = "succeeded";
      })
      .addCase(getAllTableThunk.rejected, (state) => {
        state.status = "failed";
      })


      .addCase(renameTableThunk.pending, (state) => {
        state.status = "loading"
      })
      .addCase(renameTableThunk.fulfilled, (state,action) => {
        if (action.payload) {
          state.tables = action.payload;
          }
        state.status = "succeeded";
      })
      .addCase(renameTableThunk.rejected, (state) => {
        state.status = "failed";
      })

      
      .addCase(removeTableThunk.pending, (state) => {
        state.status = "loading"
      })
      .addCase(removeTableThunk.fulfilled, (state,action) => {
        if (action.payload) {
          state.tables = action.payload;
          }
        state.status = "succeeded";
      })
      .addCase(removeTableThunk.rejected, (state) => {
        state.status = "failed";
      })
  }