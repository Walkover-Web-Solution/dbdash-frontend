import { createAsyncThunk } from "@reduxjs/toolkit";
import { renameDb,moveDb,deleteDbForUser, restoreDbForUser} from "../../api/dbApi";
import { addUserInOrg, createOrg, getAllOrgs, removeUserInOrg, updateOrg, updateUserType } from "../../api/orgApi";
import { findUserByEmail } from "../../api/userApi";
import { createDbThunkPayloadType, RenameDbThunkPayloadType, DeleteAndRestoreDbThunkPayloadType, RenameOrgThunkPayloadType, CreateOrgThunkPayloadType, ShareOrgThunkPayloadType } from "../../types/databaseDataType";
// import {  any } from "../../types/databaseDataType";

export const bulkAdd = createAsyncThunk(
    "organdDb/bulkAdd", async (payload:{email:string}) => {
        
        const data = await findUserByEmail(payload?.email);
        localStorage.setItem("userid", data?.data?.data?._id);
        var result = {};
        try {
            data?.data?.data?.dbs.map((item) => {
               
               result[item.org_id._id] = result[item?.org_id?._id] ? [...result[item?.org_id?._id], item] : [item]
            })
        } catch (error) {
                console.log(error)
        }
       
        const orgIds = Object.keys(result);
        const allorgs = await getAllOrgs(orgIds)
        const ans = {
            result:result,
            allorgs:allorgs?.data?.data
        }
        return ans;
    }
);

export const createDbThunk = createAsyncThunk(
    "organdDb/createDbThunk", async (payload:createDbThunkPayloadType) => {
        return payload?.data;
    }
);

export const moveDbThunk=createAsyncThunk(
"organdDb/moveDbThunk",async({orgId,dbId,data}:{orgId:string,dbId:string,data:{newOrgId:string}})=>{
        const response=await moveDb(orgId,dbId,data);
       const moveData  = {
             data1 : response?.data?.data,
             orgId : orgId
       }
        return moveData ;
    }
);

export const renameDBThunk = createAsyncThunk(
    "organdDb/renameDBThunk", async (payload:RenameDbThunkPayloadType) => {
        await renameDb(payload.orgId, payload.id, payload.data);

        const data = {
            name: payload.data.name,
            _id: payload.id,
            org_id: payload.orgId
        }
        return data;
    }
);




export const deleteDbThunk = createAsyncThunk(
    "organdDb/deleteDbThunk", async (payload:DeleteAndRestoreDbThunkPayloadType) => {
        const data =   await deleteDbForUser(payload.orgId, payload.dbId);
        return data?.data?.data;
    }
);

export const restoreDbThunk = createAsyncThunk(
    "organdDb/restoreDbThunk", async (payload:DeleteAndRestoreDbThunkPayloadType) => {
        const data = await restoreDbForUser(payload.orgId, payload.dbId);
        return data?.data?.data;
    }
);
export const renameOrgThunk = createAsyncThunk(
    "organdDb/renameOrgThunk", async (payload:RenameOrgThunkPayloadType) => {
        const data = await updateOrg(payload.orgId, payload.data);
        return data.data.data;
    }
);


export const createOrgThunk = createAsyncThunk(
    "organdDb/createOrgThunk", async (payload:CreateOrgThunkPayloadType) => {
        const data = await createOrg({ name: payload.name, user_id: payload.user_id });
        const allorgs = await getAllOrgs(data.data.data.org_id)
     
        const allData= {
            data:data.data.data,
            allorgs:allorgs?.data?.data
        }
        return allData;
    }
);

    export const shareUserInOrgThunk = createAsyncThunk(
        "organdDb/shareUserInOrgThunk", async (payload:ShareOrgThunkPayloadType) => {
            await addUserInOrg(payload.orgId,payload.data);
            const allorgs = await getAllOrgs(payload.orgId)
            const allData= {
                allorgs:allorgs?.data?.data
            }
            return allData;
        }
);  
export const updateUserInOrgThunk=createAsyncThunk(
    "organdDb/updateUserInOrgThunk", async (payload:ShareOrgThunkPayloadType) => {
        await updateUserType(payload.orgId, payload.data);
        const allorgs = await getAllOrgs(payload.orgId)
        const allData= {
            allorgs:allorgs?.data?.data
        }
        return allData;
    }
)
export const removeUserInOrgThunk = createAsyncThunk(
    "organdDb/removeUserInOrgThunk", async (payload:ShareOrgThunkPayloadType) => {
        
         await removeUserInOrg(payload.orgId, payload.data);
        const allorgs = await getAllOrgs(payload.orgId)
        const allData= {
            allorgs:allorgs?.data?.data
        }
        return allData;
    }
);  


