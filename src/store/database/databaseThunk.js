import { createAsyncThunk } from "@reduxjs/toolkit";
import { renameDb, deleteDb, createDb } from "../../api/dbApi";
import { createOrg, deleteOrg, updateOrg } from "../../api/orgApi";
import { findUserByEmail } from "../../api/userApi";
// import { UserAuth } from "../../context/authContext";
// import { updateDb } from './databaseSlice';


export const bulkAdd = createAsyncThunk(
    "organdDb/bulkAdd", async (payload) => {
        const data = await findUserByEmail(payload?.email);
        localStorage.setItem("userid", data?.data?.data?._id);
        var result = {};
        data?.data?.data?.dbs.map((item) => {
            result[item.org_id._id] = result[item.org_id._id] ? [...result[item.org_id._id], item] : [item]
        })
        return result;
    }
);

export const createDbThunk = createAsyncThunk(
    "organdDb/createDbThunk", async (payload) => {
        const data = await createDb(payload.orgId, payload.data);
        return data?.data?.data;
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

export const renameOrgThunk = createAsyncThunk(
    "organdDb/renameOrgThunk", async (payload) => {
        const data = await updateOrg(payload.orgId, payload.data, payload.userid);
        return data.data.data;
    }
);

export const deleteOrgThunk = createAsyncThunk(
    "organdDb/deleteOrgThunk", async (payload) => {
        await deleteOrg(payload.orgId, payload.userid);
        return payload.orgId;
    }
);

export const createOrgThunk = createAsyncThunk(
    "organdDb/createOrgThunk", async (payload) => {
        const data = await createOrg({ name: payload.name, user_id: payload.user_id });
        return data.data.data;
    }
);