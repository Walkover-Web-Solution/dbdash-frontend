import { DbStateType,OrgObj,BulkAddData,CreateRestoreAndDeleteDBDetails,createAndUpdateOrgThunkData , ActionDataType, MovePayloadType, RenamePayloadType} from "../../types/databaseDataType";
import { ActionReducerMapBuilder, SliceCaseReducers, ValidateSliceCaseReducers } from '@reduxjs/toolkit';
import { NoInfer } from 'react-redux';

import {
  renameDBThunk,createDbThunk,
  moveDbThunk,
  bulkAdd,
  renameOrgThunk,
  createOrgThunk,
  shareUserInOrgThunk,
  removeUserInOrgThunk,
  deleteDbThunk,
  restoreDbThunk,
  updateUserInOrgThunk,
} from "./databaseThunk";
export const initialState: DbStateType = {
status: "idle",
  orgId: {},
  allOrg: [],
};

export const reducers: ValidateSliceCaseReducers<DbStateType, SliceCaseReducers<DbStateType>> = {
 
};

export function extraReducers(builder: ActionReducerMapBuilder<NoInfer<DbStateType>>): void {
  builder
    //    //   rename Db
    .addCase(moveDbThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(moveDbThunk.fulfilled, (state, action:ActionDataType<MovePayloadType>) => {
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
      state.status = "loading";
    })
    .addCase(renameDBThunk.fulfilled, (state, action:ActionDataType<RenamePayloadType>) => {
      state.status = "succeeded";
      let arr = state.orgId[action.payload.org_id] || [];
      let object = arr.map((obj) => {
        if (obj._id == action.payload._id) {
          obj.name = action.payload.name;
          return obj;
        }
        return obj;
      });
      state.orgId = { ...state.orgId, [action.payload.org_id]: object };
    })
    .addCase(renameDBThunk.rejected, (state) => {
      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })

    // bulkAdd
    .addCase(bulkAdd.pending, (state) => {
      state.status = "loading";
    })
    .addCase(bulkAdd.fulfilled, (state, action:ActionDataType<BulkAddData>) => {
      state.orgId = action.payload.result;
      state.allOrg = action.payload.allorgs;
      state.status = "succeeded";
    })
    .addCase(bulkAdd.rejected, (state) => {
      state.status = "failed";
    })

    .addCase(renameOrgThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(renameOrgThunk.fulfilled, (state, action:ActionDataType<OrgObj>) => {
      state.status = "succeeded";
      let arr = state.orgId[action.payload._id] || [];
      arr.map((obj) => {
        obj.org_id.name = action.payload.name;
      });
      state.orgId = { ...state.orgId, [action.payload._id]: arr };
    })
    .addCase(renameOrgThunk.rejected, (state) => {
      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })

    //   create Org

    .addCase(createOrgThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(createOrgThunk.fulfilled, (state, action:ActionDataType<createAndUpdateOrgThunkData>) => {
      state.status = "succeeded";
      let arr = state.orgId[action.payload.allorgs[0]._id] || [];
      const newArr = [...arr, action.payload.data];
      state.orgId = { ...state.orgId, [action.payload.allorgs[0]._id]: newArr };

      if (state.allOrg)
        state.allOrg = [...state.allOrg, action.payload.allorgs[0]];
      else state.allOrg = [action.payload.allorgs[0]];
    })

    .addCase(createOrgThunk.rejected, (state) => {
      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })

    // //   create Db

    .addCase(createDbThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(createDbThunk.fulfilled, (state, action:ActionDataType<CreateRestoreAndDeleteDBDetails>) => {

      state.status = "succeeded";
      let arr = state.orgId[action?.payload?.org_id._id] || [];
      const newArr = [...arr, action.payload];
      state.orgId = { ...state.orgId, [action?.payload?.org_id._id]: newArr };
    })
    .addCase(createDbThunk.rejected, (state) => {
      state.status = "failed";
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

    
    //  add deleted db time for restoring again

    .addCase(deleteDbThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(deleteDbThunk.fulfilled, (state, actions:ActionDataType<CreateRestoreAndDeleteDBDetails>) => {
      state.status = "succeeded";
      const arr = state.orgId[actions.payload.org_id._id];
      let newArr = arr.filter((ele) => {
        return ele._id !== actions.payload._id;
      });
      newArr.push(actions?.payload);
      state.orgId[actions.payload.org_id._id] = newArr;
    })
    .addCase(deleteDbThunk.rejected, (state) => {
      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })
    .addCase(restoreDbThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(restoreDbThunk.fulfilled, (state, actions:ActionDataType<CreateRestoreAndDeleteDBDetails>) => {      
      state.status = "succeeded";
      const arr = state.orgId[actions.payload.org_id._id];
      let newArr = arr.filter((ele) => {
        return ele._id !== actions.payload._id;
      });
      newArr.push(actions?.payload);
      state.orgId[actions.payload.org_id._id] = newArr;
    })
    .addCase(restoreDbThunk.rejected, (state) => {
      state.status = "failed";
    })

    .addCase(shareUserInOrgThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(shareUserInOrgThunk.fulfilled, (state, action:ActionDataType<createAndUpdateOrgThunkData>) => {
      var arr = state.allOrg;
      arr.find((temp, index) => {
        if (temp._id == action.payload.allorgs[0]._id) {
          arr[index] = action.payload.allorgs[0];
        }
      });
      state.allOrg = arr;
      state.status = "succeeded";
    })
    .addCase(shareUserInOrgThunk.rejected, (state) => {
      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })

    //   Remove user from Org
    .addCase(updateUserInOrgThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateUserInOrgThunk.fulfilled, (state, action:ActionDataType<createAndUpdateOrgThunkData>) => {
      var arr = state.allOrg;
      arr.find((temp, index) => {
        if (temp._id == action.payload.allorgs[0]._id) {
          arr[index] = action.payload.allorgs[0];
        }
      });
      state.allOrg = arr;
      state.status = "succeeded";
    })
    .addCase(updateUserInOrgThunk.rejected, (state) => {
      state.status = "failed";
      // MDBToast.error("Unable to fetch jamaats.");
    })
    .addCase(removeUserInOrgThunk.pending, (state) => {
      state.status = "loading";
    })
    .addCase(removeUserInOrgThunk.fulfilled, (state, action:ActionDataType<createAndUpdateOrgThunkData>) => {
      var arr = state.allOrg;
      arr.find((temp, index) => {
        if (temp._id == action.payload.allorgs[0]._id) {
          arr[index] = action.payload.allorgs[0];
        }
      });
      state.allOrg = arr;
      state.status = "succeeded";
    })
    .addCase(removeUserInOrgThunk.rejected, (state) => {
      state.status = "failed";
    });
}