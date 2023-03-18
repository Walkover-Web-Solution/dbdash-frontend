import { current } from '@reduxjs/toolkit';
import { removeDbThunk, renameDBThunk,createDbThunk,bulkAdd } from './databaseThunk';

export const initialState = {
    status:'idle',
    orgId: {
       
    }
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
      .addCase(renameDBThunk.fulfilled, (state,actions) => {
    
        state.status = "succeeded";
        // console.log(current(state));
        let arr=state.orgId[actions.payload.org_id] || [];
       let object =  arr.map((obj)=>{
        if(obj._id == actions.payload._id)
          {obj.name= actions.payload.name
            return obj;}
          return obj
        })
        state.orgId={...state.orgId,[actions.payload.org_id]:object};

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
        console.log("state",action.payload);
        state.orgId = action.payload
        state.status = "succeeded";


      })
      .addCase(bulkAdd.rejected, (state) => {


        state.status = "failed";

        // MDBToast.error("Unable to fetch jamaats.");
      })

    // //   rename Org

    //   .addCase(renameOrg.pending, (state) => {
  
    //     state.status ="loading"
    //   })
    //   .addCase(renameOrg.fulfilled, (state) => {

    //     state.status = "succeeded";

    //   })
    //   .addCase(renameOrg.rejected, (state) => {

    //     state.status = "failed";
    //     // MDBToast.error("Unable to fetch jamaats.");
    //   })


    //    //   create Org

    //    .addCase(createOrg.pending, (state) => {
  
    //     state.status ="loading"
    //   })
    //   .addCase(createOrg.fulfilled, (state) => {

    //     state.status = "succeeded";

    //   })
    //   .addCase(createOrg.rejected, (state) => {

    //     state.status = "failed";
    //     // MDBToast.error("Unable to fetch jamaats.");
    //   })

    // //   create Db

       .addCase(createDbThunk.pending, (state) => {
  
        state.status ="loading"
      })
      .addCase(createDbThunk.fulfilled, (state,actions) => {

        state.status = "succeeded";
        let arr=state.orgId[actions.payload.org_id] || [];
        // console.log(arr);
        const newArr=[...arr,actions.payload];
        state.orgId={...state.orgId,[actions.payload.org_id]:newArr};

        // console.log(current(state.orgId));

      })
      .addCase(createDbThunk.rejected, (state) => {

        state.status = "failed";
        // MDBToast.error("Unable to fetch jamaats.");
      })

    //   Delete Org

    // .addCase(deleteOrg.pending, (state) => {
  
    //     state.status ="loading"
    //   })
    //   .addCase(deleteOrg.fulfilled, (state) => {

    //     state.status = "succeeded";

    //   })
    //   .addCase(deleteOrg.rejected, (state) => {

    //     state.status = "failed";
    //     // MDBToast.error("Unable to fetch jamaats.");
    //   })
   
    //   Delete Db

    .addCase(removeDbThunk.pending, (state) => {
  
        state.status ="loading"
      })
      .addCase(removeDbThunk.fulfilled, (state,actions) => {

        state.status = "succeeded";

        // console.log(current(state));
        // const { org_id, _id } = actions.payload;
        // console.log(org_id,_id);
        // const newArr = state.orgId[org_id].filter(db => db.id !== _id);
        // console.log("newArr",newArr)
        // state.orgId = { ...state.orgId, [org_id]: newArr };
        state.orgId = actions.payload
        console.log(current(state));
      })
      .addCase(removeDbThunk.rejected, (state) => {

        state.status = "failed";
        // MDBToast.error("Unable to fetch jamaats.");
      })
      
  }
  

