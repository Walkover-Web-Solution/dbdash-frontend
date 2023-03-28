
import { removeDbThunk, renameDBThunk, createDbThunk, bulkAdd, renameOrgThunk, deleteOrgThunk, createOrgThunk, shareUserInOrgThunk, removeUserInOrgThunk} from './databaseThunk';
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

      // MDBToast.error("Unable to fetch jamaats.");
    })

    //   rename Org

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
      console.log(typeof state.allOrg);
      state.status = "succeeded";
      let arr = state.orgId[action.payload.data.org_id._id] || [];
      const newArr = [...arr, action.payload.data];
      state.orgId = { ...state.orgId, [action.payload.data.org_id._id]: newArr };
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
      let arr = state.orgId[action.payload.org_id._id] || [];
      const newArr = [...arr, action.payload];
      state.orgId = { ...state.orgId, [action.payload.org_id._id]: newArr };

    })
    .addCase(createDbThunk.rejected, (state) => {

      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })

    //   Delete Org

    .addCase(deleteOrgThunk.pending, (state) => {

      state.status = "loading"
    })
    .addCase(deleteOrgThunk.fulfilled, (state, action) => {

      state.status = "succeeded";
      let arr = state.orgId;
      delete arr[action.payload];
      state.orgId = { ...arr }

    })
    .addCase(deleteOrgThunk.rejected, (state) => {

      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })

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


