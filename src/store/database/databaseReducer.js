
import { removeDbThunk, renameDBThunk, createDbThunk, moveDbThunk,bulkAdd, renameOrgThunk,  createOrgThunk, shareUserInOrgThunk, removeUserInOrgThunk, deleteDbThunk,restoreDbThunk, updateUserInOrgThunk, addDbInUserThunk, removeDbInUserThunk} from './databaseThunk';
export const initialState = {
  status: 'idle',
  orgId: {

  },
  allOrg:[]
};

export const reducers = {
  createDb(state, payload) {

    if (payload.payload) {
      const { database_name } = payload.payload;
      state.dbName = database_name;
    }
  },

  
moveDb(state)
{

  state.orgId='';
  state.dbId='';
  state.data='';
},
  renameDb(state) {
    state.dbId = '';
    state.orgId = '';
    state.data = '';


  },
  

  removeDb(state) {
    state.dbId = '';
    state.orgId = '';

  }

};

export function extraReducers(builder) {
  builder
    //    //   rename Db
    .addCase(moveDbThunk.pending,(state)=>{
      state.status="loading"
    })
    .addCase(moveDbThunk.fulfilled,(state,action)=>{
    
      state.status = "succeeded";
    let oldArr = state.orgId[action.payload.orgId] || [];
    let newArr = state.orgId[action.payload.data1.org_id] || [];
    
    let object = oldArr.find((obj) => obj._id === action.payload.data1._id);
    if (object) {
    oldArr = oldArr.filter((obj) => obj._id !== action.payload.data1._id);
    
    object.org_id._id = action.payload.data1.org_id;
    
    newArr.push(object);
    
     state.orgId = {
    ...state.orgId,
    [action.payload.orgId]: oldArr,
    [action.payload.data1.org_id]: newArr,
    };
     }
    })
    .addCase(moveDbThunk.rejected, (state) => {
    
      state.status = "failed";
     
    })
    

    .addCase(renameDBThunk.pending, (state) => {

      state.status = "loading"
    })
    .addCase(renameDBThunk.fulfilled, (state, action) => {

      state.status = "succeeded";
      let arr = state.orgId[action.payload.org_id] || [];
      let object = arr.map((obj) => {
        if (obj._id == action.payload._id) {
          obj.name = action.payload.name
          return obj;
        }
        return obj
      })
      state.orgId = { ...state.orgId, [action.payload.org_id]: object };



    })
    .addCase(renameDBThunk.rejected, (state) => {

      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })



    // bulkAdd
    .addCase(bulkAdd.pending, (state) => {

      state.status = "loading"

    })
    .addCase(bulkAdd.fulfilled, (state, action) => {
      state.orgId = action.payload.result
      state.allOrg = action.payload.allorgs
      state.status = "succeeded";
    })
    .addCase(bulkAdd.rejected, (state) => {


      state.status = "failed";

    })


    .addCase(addDbInUserThunk.pending, (state) => {

      state.status = "loading"
    })
    .addCase(addDbInUserThunk.fulfilled, (state, action) => {
const payloadData=action.payload?.data?.data;
      state.status = "succeeded";
      let arr = state.orgId[payloadData.org_id] || [];
      arr.map((obj) => {
        if(obj._id==payloadData._id)
        obj.users = payloadData.users
      })
      state.orgId = { ...state.orgId, [payloadData._id]: arr };

    })
    .addCase(addDbInUserThunk.rejected, (state) => {

      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })

    .addCase(removeDbInUserThunk.pending, (state) => {

      state.status = "loading"
    })
    .addCase(removeDbInUserThunk.fulfilled, (state, action) => {

      console.log("lgi",action.payload);
const payloadData=action.payload?.response?.data?.data;
      state.status = "succeeded";
      let arr = state.orgId[payloadData._id] || [];
      console.log("hfgkh")
      arr.map((obj) => {
        if(obj._id==payloadData._id)
        delete obj.users[action.payload?.userId];
      })

      
      state.orgId = { ...state.orgId, [payloadData._id]: arr };
      console.log("ofhg",state.orgId);


    })
    .addCase(removeDbInUserThunk.rejected, (state) => {

      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })




    .addCase(renameOrgThunk.pending, (state) => {

      state.status = "loading"
    })
    .addCase(renameOrgThunk.fulfilled, (state, action) => {

      state.status = "succeeded";
      let arr = state.orgId[action.payload._id] || [];
      arr.map((obj) => {
        obj.org_id.name = action.payload.name
      })
      state.orgId = { ...state.orgId, [action.payload._id]: arr };

    })
    .addCase(renameOrgThunk.rejected, (state) => {

      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })


    //   create Org

    .addCase(createOrgThunk.pending, (state) => {

      state.status = "loading"
    })
    .addCase(createOrgThunk.fulfilled, (state, action) => {
     
      state.status = "succeeded";
      let arr = state.orgId[action.payload.allorgs[0]._id] || [];
      const newArr = [...arr, action.payload.data];
      state.orgId = { ...state.orgId, [action.payload.allorgs[0]._id]: newArr };
   
      if (state.allOrg)
      state.allOrg = [...state.allOrg , action.payload.allorgs[0]]
      else
      state.allOrg = [action.payload.allorgs[0]]
    })
    
    .addCase(createOrgThunk.rejected, (state) => {

      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })

    // //   create Db

    .addCase(createDbThunk.pending, (state) => {

      state.status = "loading"
    })
    .addCase(createDbThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      let arr = state.orgId[action?.payload?.org_id] || [];
      const newArr = [...arr, action.payload];
      state.orgId = { ...state.orgId, [action?.payload?.org_id]: newArr };

    })
    .addCase(createDbThunk.rejected, (state) => {

      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })

    //   Delete Org

    // .addCase(deleteOrgThunk.pending, (state) => {

    //   state.status = "loading"
    // })
    // .addCase(deleteOrgThunk.fulfilled, (state, action) => {

    //   state.status = "succeeded";
    //   const deletedOrgId = action.payload;
    //   let orgIdArr = state.orgId;
    //   delete orgIdArr[deletedOrgId];
    //   state.orgId = { ...orgIdArr };
    //   state.allOrg = state.allOrg.filter(org => org._id !== deletedOrgId);
      
    // })
    // .addCase(deleteOrgThunk.rejected, (state) => {

    //   state.status = "failed";
    //   // MDBToast.error("Unable to fetch jamaats.");
    // })

    //   Delete Db

    .addCase(removeDbThunk.pending, (state) => {
      state.status = "loading"
    })
    .addCase(removeDbThunk.fulfilled, (state, actions) => {
      state.status = "succeeded";
      const arr = state.orgId[actions.payload.orgId];
      const newArr = arr.filter(ele => {
        return ele._id !== actions.payload.dbId;
      });
      state.orgId[actions.payload.orgId] = newArr;
    })
    .addCase(removeDbThunk.rejected, (state) => {
      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })


     //  add deleted db time for restoring again 

     .addCase(deleteDbThunk.pending, (state) => {
      state.status = "loading"
    })
    .addCase(deleteDbThunk.fulfilled, (state, actions) => {
      state.status = "succeeded";
      const arr = state.orgId[actions.payload.org_id];
      let newArr = arr.filter(ele => {
        return ele._id !== actions.payload._id;
      });
      newArr.push(actions?.payload)
      state.orgId[actions.payload.org_id] = newArr;
    })
    .addCase(deleteDbThunk.rejected, (state) => {
      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })
    .addCase(restoreDbThunk.pending, (state) => {
      state.status = "loading"
    })
    .addCase(restoreDbThunk.fulfilled, (state, actions) => {
      state.status = "succeeded";
      const arr = state.orgId[actions.payload.org_id];
      let newArr = arr.filter(ele => {
        return ele._id !== actions.payload._id;
      });
      newArr.push(actions?.payload)
      state.orgId[actions.payload.org_id] = newArr;
    })
    .addCase(restoreDbThunk.rejected, (state) => {
      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })
    


    //   Add user in Org

    .addCase(shareUserInOrgThunk.pending, (state) => {

      state.status = "loading"
    })
    .addCase(shareUserInOrgThunk.fulfilled, (state, action) => {

      var arr = state.allOrg;
      arr.find((temp,index)=>{
        if(temp._id==action.payload.allorgs[0]._id)
        {
          arr[index]= action.payload.allorgs[0];
        }
      })
      state.allOrg = arr
      state.status = "succeeded";
    })
    .addCase(shareUserInOrgThunk.rejected, (state) => {

      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })

    //   Remove user from Org
    .addCase(updateUserInOrgThunk.pending, (state) => {

      state.status = "loading"
    })
    .addCase(updateUserInOrgThunk.fulfilled, (state, action) => {

      var arr = state.allOrg;
      arr.find((temp,index)=>{
        if(temp._id==action.payload.allorgs[0]._id)
        {
          arr[index]= action.payload.allorgs[0];
        }
      })
      state.allOrg = arr
      state.status = "succeeded";
    })
    .addCase(updateUserInOrgThunk.rejected, (state) => {

      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })
    .addCase(removeUserInOrgThunk.pending, (state) => { 

      state.status = "loading"
    })
    .addCase(removeUserInOrgThunk.fulfilled, (state, action) => {

      var arr = state.allOrg;
      arr.find((temp,index)=>{
        if(temp._id==action.payload.allorgs[0]._id)
        {
          arr[index]= action.payload.allorgs[0];
        }
      })
      state.allOrg = arr
      state.status = "succeeded";
    })
    .addCase(removeUserInOrgThunk.rejected, (state) => {

      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })



}

