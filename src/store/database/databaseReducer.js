import { current } from '@reduxjs/toolkit';
import { removeDbThunk, renameDBThunk,createDbThunk,bulkAdd, renameOrgThunk, deleteOrgThunk, createOrgThunk } from './databaseThunk';

export const initialState = {
    status:'idle',
    orgId: {
       
    },
};

export const reducers = {
    createDb(state,payload){

        if(payload.payload){
          const {database_name}=payload.payload;
          state.dbName=database_name;
        }
    },
    renameDb(state){
      state.dbId='';
      state.orgId='';
      state.data='';  
     

    },
    
    removeDb(state){
      state.dbId='';
      state.orgId='';
  
    }
  
};

export function extraReducers(builder) {
    builder
    //    //   rename Db
    
       .addCase(renameDBThunk.pending, (state) => {
    
        state.status ="loading"
      })
      .addCase(renameDBThunk.fulfilled, (state,action) => {
    
        state.status = "succeeded";
        // console.log(current(state));
        let arr=state.orgId[action.payload.org_id] || [];
        // console.log("arr", arr)
       let object =  arr.map((obj)=>{
        if(obj._id == action.payload._id)
          {obj.name= action.payload.name
            return obj;}
          return obj
        })
        state.orgId={...state.orgId,[action.payload.org_id]:object};

        // console.log(current(state));
        
    
      })
      .addCase(renameDBThunk.rejected, (state) => {
    
        state.status = "failed";
        // MDBToast.error("Unable to fetch jamaats.");
      })



      // bulkAdd
      .addCase(bulkAdd.pending, (state) => {
        
        state.status ="loading"
    
      })
      .addCase(bulkAdd.fulfilled, (state,action) => {
        // console.log("state",action.payload);
        state.orgId = action.payload
        state.status = "succeeded";


      })
      .addCase(bulkAdd.rejected, (state) => {


        state.status = "failed";

        // MDBToast.error("Unable to fetch jamaats.");
      })

    //   rename Org

      .addCase(renameOrgThunk.pending, (state) => {
  
        state.status ="loading"
      })
      .addCase(renameOrgThunk.fulfilled, (state,action) => {

        state.status = "succeeded";
        let arr=state.orgId[action.payload._id] || [];
        arr.map((obj)=>{
          obj.org_id.name= action.payload.name
        })
        // console.log("arr",current(arr))
        state.orgId={...state.orgId,[action.payload._id]:arr};
        // console.log("new state ",current(state))

      })
      .addCase(renameOrgThunk.rejected, (state) => {

        state.status = "failed";
        // MDBToast.error("Unable to fetch jamaats.");
      })


       //   create Org

       .addCase(createOrgThunk.pending, (state) => {
  
        state.status ="loading"
      })
      .addCase(createOrgThunk.fulfilled, (state) => {

        state.status = "succeeded";
        


      })
      .addCase(createOrgThunk.rejected, (state) => {

        state.status = "failed";
        // MDBToast.error("Unable to fetch jamaats.");
      })

    // //   create Db

       .addCase(createDbThunk.pending, (state) => {
  
        state.status ="loading"
      })
      .addCase(createDbThunk.fulfilled, (state,action) => {
        console.log(action.payload)
        state.orgId = action.payload
        state.status = "succeeded";
        // let arr=state.orgId[action.payload.org_id] || [];
        // const newArr=[...arr,action.payload];
        // state.orgId={...state.orgId,[action.payload.org_id]:newArr};
        console.log(current(state));

        
      })
      .addCase(createDbThunk.rejected, (state) => {

        state.status = "failed";
        // MDBToast.error("Unable to fetch jamaats.");
      })

    //   Delete Org

    .addCase(deleteOrgThunk.pending, (state) => {
  
        state.status ="loading"
      })
      .addCase(deleteOrgThunk.fulfilled, (state) => {

        state.status = "succeeded";

      })
      .addCase(deleteOrgThunk.rejected, (state) => {

        state.status = "failed";
        // MDBToast.error("Unable to fetch jamaats.");
      })
   
    //   Delete Db

    .addCase(removeDbThunk.pending, (state) => {
      state.status ="loading"
    })
    .addCase(removeDbThunk.fulfilled, (state,actions) => {
      state.status = "succeeded";
      const arr=state.orgId[actions.payload.orgId];
      const newArr=arr.filter(ele => {
        return ele._id!==actions.payload.dbId;
      });
      state.orgId[actions.payload.orgId]=newArr;
    })
    .addCase(removeDbThunk.rejected, (state) => {
      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })

}
  

