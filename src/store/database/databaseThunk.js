import { createAsyncThunk} from "@reduxjs/toolkit";
import { renameDb ,deleteDb ,createDb} from "../../api/dbApi";
import { createOrg, deleteOrg, updateOrg } from "../../api/orgApi";
import { findUserByEmail } from "../../api/userApi";
// import { UserAuth } from "../../context/authContext";

// import { updateDb } from './databaseSlice';


export const bulkAdd = createAsyncThunk (
    "organdDb/bulkAdd", async (payload) =>{
        // const data = await getCurrentUser();
        // console.log(payload.email)
        const data = await findUserByEmail(payload?.email);  
        localStorage.setItem("userid",data?.data?.data?._id);
        var result = {};
        data?.data?.data?.dbs.map((item)=>{        
            result[item.org_id._id]=result[item.org_id._id]?[...result[item.org_id._id],item]:[item]
        })        
    //   console.log("result",result);
      return result;
}
);

export const createDbThunk = createAsyncThunk (
    "organdDb/createDbThunk", async (payload ) =>{
       const data =await createDb(payload.orgId, payload.data);      
        // dispatch(bulkAdd({data:data.data.data}));

        console.log("email,",payload)
        return data?.data?.data;
    //     const data = await findUserByEmail(payload?.email);  
    //     localStorage.setItem("userid",data?.data?.data?._id);
    //     var result = {};
    //     data?.data?.data?.dbs.map((item)=>{        
    //         result[item.org_id._id]=result[item.org_id._id]?[...result[item.org_id._id],item]:[item]
    //     })    
    //   return result;

    }
);

export const renameDBThunk = createAsyncThunk (
    "organdDb/renameDBThunk", async (payload) =>{
        // dispatch(renameDb());
        const data=await renameDb(payload.orgId, payload.id, payload.data);

        // console.log(data);

        return data.data.data;
    }
);

export const removeDbThunk = createAsyncThunk (
    "organdDb/removeDbThunk", async (payload ) =>{

        // console.log(payload);
        await deleteDb(payload.orgId, payload.dbId);

    return payload;
    }
);

export const renameOrgThunk = createAsyncThunk (
    "organdDb/renameOrgThunk", async (payload) =>{
        // dispatch(renameDb());
        const data=await updateOrg(payload.orgId, payload.data, payload.userid);
        return data.data.data;
    }
);

export const deleteOrgThunk = createAsyncThunk (
    "organdDb/deleteOrgThunk", async (payload) =>{
        // dispatch(renameDb());
        await deleteOrg(payload.orgId,payload.userid);
        return payload.orgId;
    }
);

export const createOrgThunk = createAsyncThunk (
    "organdDb/createOrgThunk", async (payload) =>{
        const data=await createOrg({name:payload.name,user_id: payload.user_id});
        // console.log(data);
        return data.data.data;
    }
);