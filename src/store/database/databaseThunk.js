import { createAsyncThunk} from "@reduxjs/toolkit";
import { renameDb ,deleteDb ,createDb} from "../../api/dbApi";
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
      console.log("result",result);
      return result;
}
);

export const createDbThunk = createAsyncThunk (
    "organdDb/createDbThunk", async (payload ) =>{
        const data = await createDb(payload.orgId, payload.data);      
        // dispatch(bulkAdd({data:data.data.data}));

        return data?.data?.data;
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
        // const user = UserAuth();
        // console.log("user",user?.email);
       const data = await deleteDb(payload.orgId, payload.dbId);
    //    const data = await findUserByEmail(user?.email);  
    //     localStorage.setItem("userid",data?.data?.data?._id);
    //     console.log("data",data);
    //     var result = {};
    //     data?.data?.data?.dbs.map((item)=>{        
    //         result[item.org_id._id]=result[item.org_id._id]?[...result[item.org_id._id],item]:[item]
    //     })        
    //   console.log("result",result);
      return data.data.data;
    }
);