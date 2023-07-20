import { createAsyncThunk } from "@reduxjs/toolkit";
import { renameDb, deleteDb,moveDb,deleteDbForUser, restoreDbForUser} from "../../api/dbApi";
import { addUserInOrg, createOrg, getAllOrgs, removeUserInOrg, updateOrg, updateUserType } from "../../api/orgApi";
import { findUserByEmail } from "../../api/userApi";

export const bulkAdd = createAsyncThunk(
    "organdDb/bulkAdd", async (payload) => {
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
    "organdDb/createDbThunk", async (payload) => {
        // const data = await createDb(payload.orgId, payload.data);
        return payload?.data;
    }
);

export const moveDbThunk=createAsyncThunk(
    "organdDb/moveDbThunk",async({orgid,dbid,data})=>{
        const response=await moveDb(orgid,dbid,data);
       const moveData  = {
             data1 : response?.data?.data,
             orgId : orgid
       }
        return moveData ;
    }
);

export const renameDBThunk = createAsyncThunk(
    "organdDb/renameDBThunk", async (payload) => {
        await renameDb(payload.orgId, payload.id, payload.data);

        const data = {
            name: payload.data.name,
            _id: payload.id,
            org_id: payload.orgId
        }
        return data;
    }
);



export const removeDbThunk = createAsyncThunk(
    "organdDb/removeDbThunk", async (payload) => {
        await deleteDb(payload.orgId, payload.dbId);
        return payload;
    }
);

export const deleteDbThunk = createAsyncThunk(
    "organdDb/deleteDbThunk", async (payload) => {
        const data =   await deleteDbForUser(payload.orgId, payload.dbId);
        return data?.data?.data;
    }
);

export const restoreDbThunk = createAsyncThunk(
    "organdDb/restoreDbThunk", async (payload) => {
        const data = await restoreDbForUser(payload.orgId, payload.dbId);
        return data?.data?.data;
    }
);
export const renameOrgThunk = createAsyncThunk(
    "organdDb/renameOrgThunk", async (payload) => {
        const data = await updateOrg(payload.orgId, payload.data, payload.userid);
        return data.data.data;
    }
);

// export const deleteOrgThunk = createAsyncThunk(
//     "organdDb/deleteOrgThunk", async (payload) => {
//        await deleteOrg(payload.orgId, payload.userid);
     
//         return payload.orgId;
//     }
// );

export const createOrgThunk = createAsyncThunk(
    "organdDb/createOrgThunk", async (payload) => {
        const data = await createOrg({ name: payload.name, user_id: payload.user_id });
        console.log(data.data.data,"thunk")
        const allorgs = await getAllOrgs(data.data.data.org_id)
     
        const allData= {
            data:data.data.data,
            allorgs:allorgs?.data?.data
        }
        return allData;
    }
);

    export const shareUserInOrgThunk = createAsyncThunk(
        "organdDb/shareUserInOrgThunk", async (payload) => {
            await addUserInOrg(payload.orgId, payload.adminId,payload.data);
            const allorgs = await getAllOrgs(payload.orgId)
            const allData= {
                allorgs:allorgs?.data?.data
            }
            return allData;
        }
);  
export const updateUserInOrgThunk=createAsyncThunk(
    "organdDb/updateUserInOrgThunk", async (payload) => {
        await updateUserType(payload.orgId, payload.adminId,{email:payload.email,user_type:payload.user_type});
        const allorgs = await getAllOrgs(payload.orgId)
        const allData= {
            allorgs:allorgs?.data?.data
        }
        return allData;
    }
)
export const removeUserInOrgThunk = createAsyncThunk(
    "organdDb/removeUserInOrgThunk", async (payload) => {
         await removeUserInOrg(payload.orgId, payload.adminId,{email:payload.email});
        const allorgs = await getAllOrgs(payload.orgId)
        const allData= {
            allorgs:allorgs?.data?.data
        }
        return allData;
    }
);  


