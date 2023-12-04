import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createField,
  deleteField,
  hideAllField,
  updateField,
} from "../../api/fieldApi";
import { getTable } from "../../api/tableApi";
import { insertRow, uploadImage, updateRow, deleteRow, insertMultipleRows } from "../../api/rowApi";
import {
  addOptionToColumn,
  setTableLoading,
  updateColumnType,
} from "./tableSlice";
import { allOrg } from "../database/databaseSelector";
import { runQueryonTable } from "../../api/filterApi";
import { createView, deleteFieldInView } from "../../api/viewApi";
// import { getTableInfo } from "./tableSelector";
import { getAllTableInfo } from "../allTable/allTableSelector";
import { setAllTablesData } from "../allTable/allTableSlice";
import {
  BulkAddColumnsTypes,
  DeleteColumnsTypes,
  FilterDataTypes,
  UpdateColumnHeaderTypes,
  UserInfoTypes,
} from "../../types/tableDataTypes";
import { TableColumType, TableDataType } from "../../types/tableDataTypes";
const replaceCreatedByIdWithName = async (
  userInfo: Array<UserInfoTypes>,
  org_id?: string
): Promise<UserInfoTypes> => {
  const users = userInfo?.find((org) => org?._id == org_id)?.users;
  var userJson = {} as UserInfoTypes;
  users?.forEach((user) => {
    userJson[user.user_id._id] = user?.user_id;
  });
  if (!users) {
    userInfo.forEach((obj) => {
      obj.users.forEach((user) => {
        if (!userJson?.[user.user_id._id])
          userJson[user.user_id._id] = user?.user_id;
      });
    });
  }
  return userJson;
};

const getHeaders = async (
  dbId: string,
  tableName: string,
  payloadfields,
  { getState },
  fieldArrayInFilter = null
): Promise<TableColumType> => {
  let fields =
    payloadfields ||
    (await getAllTableInfo(getState())?.tables?.[tableName]?.fields);
  const fieldIds =
    fieldArrayInFilter ||
    (await getAllTableInfo(getState())?.tables?.[tableName]?.fieldIds);
  let columns = [] as any;
  // const viewFields  = getAllTableInfo(getState())?.tables?.[tableName]?.view?.fields;
  if (!fieldArrayInFilter) {
    fields = { ...fields };
  }
  fieldIds.forEach((fieldId, index) => {
    const field = fields[fieldId];

    if (field) {
      var json = {
        title: "",
        id: "",
        dataType: "",
        hasMenu: true,
        // minWidth: 100,
        // options: [],
        metadata: {},
        width: field.metaData?.width ? field.metaData.width : 150,
        icon: "",
      };

      json.id = fieldId;
      json.title = field.fieldName?.toLowerCase() || fieldId.toLowerCase();
      if (field.tableId)  json["tableId"] = field.tableId
      if (field.actualFieldId)  json["actualFieldId"] = field.actualFieldId
      // json.accessor = fieldId.toLowerCase();
      json.metadata = field.metaData;
      json.dataType = field.fieldType?.toLowerCase();
      json.icon = field.fieldType?.toLowerCase();
      columns[index] = json; // Replace the existing object at the corresponding index
    }
  });

  let result = columns.filter((el) => el !== "empty");
  return result;
};
const getRowData = async (
  dbId: string,
  tableName: string,
  { getState },
  org_id?: string,
  page?: number
): Promise<TableDataType> => {
  // const data = await getTable(dbId, tableName, page);
  // const obj = data.data.data?.rows || data.data.data;
  const userInfo: UserInfoTypes[] = allOrg(getState());
  // const tableInfo = getTableInfo(getState())
  const userJson = await replaceCreatedByIdWithName(userInfo, org_id);
  // const createdby = "fld" + tableName.substring(3) + "createdby";
  // const updatedby = "fld" + tableName.substring(3) + "updatedby";

  const dataAndPageNo = {
    offset: true,
    rows: [],
  } as any;
    const data = await getTable(dbId, tableName, page);
    const obj = data.data.data?.rows || data.data.data;
    obj.map((row) => {
      row["createdby"] = userJson?.[row["createdby"]]
        ? userJson?.[row["createdby"]]?.first_name +
          " " +
          userJson?.[row["createdby"]]?.last_name
        : row["createdby"];
      row["updatedby"] = userJson?.[row["updatedby"]]
        ? userJson?.[row["updatedby"]]?.first_name +
          " " +
          userJson?.[row["updatedby"]]?.last_name
        : row["updatedby"];
    });
    dataAndPageNo.offset = data.data.data?.offset;
    dataAndPageNo.rows = [...dataAndPageNo.rows, ...obj];
    dataAndPageNo.pageNo = page;
  // if (tableInfo.tableId == tableName && tableInfo.pageNo < page) {
  //     dataAndPageNo.rows = [...tableInfo.data, ...obj];
  //     return dataAndPageNo;
  // }
  // dataAndPageNo.pageNo = 1;
  // dataAndPageNo.rows = obj;
  return dataAndPageNo;
};
export const addColumns = createAsyncThunk(
  "table/addColumns",
  async (payload: TableDataType, { dispatch }) => {
    dispatch(addOptionToColumn(payload));
    return 5;
  }
);
export const bulkAddColumns = createAsyncThunk(
  "table/bulkAddColumns",
  async (payload: BulkAddColumnsTypes, { getState, dispatch }) => {
    let columns;
      columns = await getHeaders(
        payload.dbId,
        payload.tableName,
        payload?.fields,
        { getState }
      ); 
    const data = await getRowData(
      payload.dbId,
      payload.tableName,
      { getState },
      payload.org_id,
      payload.pageNo
    );

    const dataa = {
      columns: columns,
      row: data.rows,
      tableId: payload?.tableName,
      dbId: payload?.dbId,
      pageNo: data?.pageNo || 1,
      isMoreData: !(data?.offset == null),
      filterId: "",
      dispatch: dispatch
    };
    dispatch(setTableLoading(false));
    return dataa;
  }
);
export const filterData = createAsyncThunk(
  "table/bulkAddColumns",
  async (payload: FilterDataTypes, { getState, dispatch }) => {
    var filterQuery;
    const table = getAllTableInfo(getState())?.tables?.[payload?.tableId];
    const filter = table?.filters?.[payload?.filterId];
    let filterFields = filter?.fields;
    if (filterFields && Object.keys(filterFields).length == 0) {
      filterFields = table?.fields;
    }
    const fieldArrayInFilter = filter?.fieldIds;
    if (payload?.filter) {
      filterQuery = payload?.filter;
    } else {
      filterQuery = table?.filters?.[payload?.filterId].query;
    }
    const userInfo = allOrg(getState());
    const userJson = await replaceCreatedByIdWithName(
      userInfo,
      payload?.org_id
    );
    // const createdby = "fld" + payload?.tableId.substring(3) + "createdby";

    var offset = true;
    var rows: any = [];
    var page = 1;
    while (offset) {
      const querydata = await runQueryonTable(
        payload.dbId,
        payload?.tableId,
        payload?.filterId,
        filterQuery,
        page
      );
      querydata?.data?.data?.rows &&
        querydata?.data?.data?.rows?.map((row) => {
          row["createdby"] = userJson?.[row["createdby"]]
            ? userJson?.[row["createdby"]]?.first_name +
              " " +
              userJson?.[row["createdby"]]?.last_name
            : row["createdby"];
        });
      const obj = querydata?.data?.data?.rows;
      offset = !!querydata?.data?.data?.offset;
      rows = [...rows, ...obj];
      page = page + 1;
    }
    let columns = {};
    // const viewFields =table.view?.fields || {}//views fields
    fieldArrayInFilter?.forEach((id) => {
      columns[id] = table?.fields?.[id];
    });
    // if(!fieldArrayInFilter)
    // {
    columns = { ...table?.fields };
    // }

    filterFields &&
      Object.entries(filterFields).map((entry: any) => {
        const id = entry[0];
        const hide = entry[1].hide;
        const width = entry[1].width;
        columns[id] = {
          ...columns[id],
          metaData: { ...columns[id]?.metaData, hide: hide, width: width },
        };
      });

    columns = await getHeaders(
      payload?.dbId,
      payload?.tableId,
      columns,
      { getState },
      fieldArrayInFilter
    );
    const dataa = {
      columns: columns,
      row: rows,
      tableId: payload?.tableId,
      dbId: payload?.dbId,
      // "pageNo": querydata?.data?.data?.pageNo,
      // "isMoreData": !(querydata?.data?.data?.offset == null),
      filterId: payload?.filterId,
    };
    dispatch(setTableLoading(false));
    return dataa;
  }
);
export const deleteColumns = createAsyncThunk(
  "table/deleteColumns",
  async (
    payload: DeleteColumnsTypes,
    { dispatch, getState }: { dispatch: any; getState: any }
  ) => {
    if (payload?.metaData?.isLookup == true) {
      const data = {
        viewFieldId: payload?.fieldName,
      };
      const newDatabase = await deleteFieldInView(
        payload?.dbId,
        payload?.tableId,
        data
      );
      dispatch(
        setAllTablesData({
          dbId: newDatabase?.data?.data?._id,
          tables: newDatabase?.data?.data?.tables,
          orgId: newDatabase?.data?.data?.org_id,
        })
      );
    } else {
      const deletedfield = await deleteField(
        payload?.dbId,
        payload?.tableId,
        payload?.fieldName
      );
      dispatch(
        setAllTablesData({
          dbId: deletedfield?.data?.data?.data?._id,
          tables: deletedfield?.data?.data?.data?.tables,
          orgId: deletedfield?.data?.data?.data?.org_id,
        })
      );
    }
    const { tableId, dbId } = getState().table;
    if (payload?.filterId) {
      dispatch(
        filterData({
          filterId: payload?.filterId,
          tableId: payload?.tableId,
          dbId: payload?.dbId,
        })
      );
    } else {
      dispatch(bulkAddColumns({ tableName: tableId, dbId: dbId }));
    }
    return 2;
  }
);
export const updateColumnHeaders = createAsyncThunk(
  "table/updateColumnHeaders",
  async (payload: UpdateColumnHeaderTypes, { dispatch, getState }) => {
    const data = {
      filterId: payload?.filterId,
      newFieldName: payload?.label,
      newFieldType: payload?.fieldType,
      metaData: payload?.metaData,
    };
    if (payload?.metaData?.isAllHide) {
      await hideAllField(payload?.dbId, payload?.tableName, {
        metaData: payload?.metaData,
        filterId: payload?.filterId,
      });
      return;
    }
    //call api to update backend
    const updatedDbdata = await updateField(
      payload?.dbId,
      payload?.tableName,
      payload?.columnId,
      data
    );
    dispatch(
      setAllTablesData({
        dbId: updatedDbdata?.data?.data?._id,
        tables: updatedDbdata?.data?.data?.tables,
        orgId: updatedDbdata?.data?.data?.org_id,
      })
    );
    if (payload?.metaData?.query) {
      dispatch(
        bulkAddColumns({ tableName: payload?.tableName, dbId: payload?.dbId })
      );
      return;
    }
    let updatedColumn =
      updatedDbdata?.data?.data?.tables?.[payload?.tableName]?.fields?.[
        payload?.columnId
      ];
    if (payload?.filterId) {
      var updatedFilterColumn =
        updatedDbdata?.data?.data?.tables?.[payload?.tableName]?.filters?.[
          payload?.filterId
        ]?.fields?.[payload?.columnId];
      const updatedMetaData = {
        ...updatedColumn.metaData, 
        hide: updatedFilterColumn.hide,
        width: updatedFilterColumn.width,
      };
      updatedColumn = {
        ...updatedColumn, 
        metaData: updatedMetaData, 
      };
    }
    updatedColumn = { [payload?.columnId]: updatedColumn };
    updatedColumn = await getHeaders(
      payload.dbId,
      payload.tableName,
      updatedColumn,
      { getState }
    );
    return updatedColumn[0];
  }
);
export const addColumnrightandleft = createAsyncThunk(
  "table/addColmunsrightandleft",
  async (
    payload: UpdateColumnHeaderTypes,
    { dispatch, getState }: { dispatch: any; getState: any }
  ) => {
    const data = {
      filterId: payload?.filterId,
      fieldName: payload?.fieldName,
      fieldType: payload?.fieldType,
      direction: payload?.direction,
      position: payload?.position,
      metaData: payload?.metaData,
      selectedFieldName: payload?.selectedFieldName,
      selectedTable: payload?.selectedTable,
      query: payload?.query,
      linkedForeignKey: payload?.linkedValueName,
      foreignKey: payload?.foreignKey,
      duplicateField: payload?.duplicateField,
    };
    let createdfield;
    if (payload?.fieldType == "lookup") {
      createdfield = await createView(payload?.dbId, payload?.tableId, data);
      dispatch(
        setAllTablesData({
          dbId: createdfield?.data?.data?._id,
          tables: createdfield?.data?.data?.tables,
          orgId: createdfield?.data?.data?.org_id,
        })
      );
    } else {
      createdfield = await createField(payload?.dbId, payload?.tableId, data);
      dispatch(
        setAllTablesData({
          dbId: createdfield?.data?.data?.data?._id,
          tables: createdfield?.data?.data?.data?.tables,
          orgId: createdfield?.data?.data?.data?.org_id,
        })
      );
    }

    const { tableId, dbId } = getState().table;
    if (payload?.filterId) {
      dispatch(
        filterData({
          filterId: payload?.filterId,
          tableId: payload?.tableId,
          dbId: payload?.dbId,
        })
      );
    } else {
      dispatch(
        bulkAddColumns({
          tableName: tableId,
          dbId: dbId,
          fields: createdfield?.data?.data?.fields,
        })
      );
    }
    return payload;
  }
);
export const addColumsToLeft = createAsyncThunk(
  "table/addColumsToLeft",
  async (
    payload: UpdateColumnHeaderTypes,
    { dispatch, getState }: { dispatch: any; getState: any }
  ) => {
    const data = {
      filterId: payload?.filterId,
      fieldName: payload?.fieldName,
      fieldType: payload?.fieldType,
      metaData: payload?.metaData,
      query: payload?.query,
      selectedFieldName: payload?.selectedFieldName,
      selectedTable: payload?.selectedTable,
      linkedForeignKey: payload?.linkedValueName,
      foreignKey: payload?.foreignKey,
      userQuery: payload?.userQuery,
    };
    let createdfield: any = {};
    if (payload?.fieldType == "lookup") {
      createdfield.data = await createView(
        payload?.dbId,
        payload?.tableId,
        data
      );
      dispatch(
        setAllTablesData({
          dbId: createdfield?.data?.data?.data?._id,
          tables: createdfield?.data?.data?.data?.tables,
          orgId: createdfield?.data?.data?.data?.org_id,
        })
      );
    } else {
      createdfield = await createField(payload?.dbId, payload?.tableId, data);
      dispatch(
        setAllTablesData({
          dbId: createdfield?.data?.data?.data?._id,
          tables: createdfield?.data?.data?.data?.tables,
          orgId: createdfield?.data?.data?.data?.org_id,
        })
      );
    }

    // dispatch(addColumnToLeft(payload));
    const { tableId, dbId } = getState().table;
    if (payload?.filterId) {
      dispatch(
        filterData({
          filterId: payload?.filterId,
          tableId: payload?.tableId,
          dbId: payload?.dbId,
        })
      );
    } else {
      dispatch(
        bulkAddColumns({
          tableName: tableId,
          dbId: dbId,
          fields: createdfield?.data?.data?.fields,
        })
      );
    }
    return payload;
  }
);
export const updateCells = createAsyncThunk(
  "table/updateCells",
  async (payload: UpdateColumnHeaderTypes, { getState }: { getState: any }) => {
    const { tableId, dbId } = getState().table;
    const value = payload?.value;
    const columnId = payload?.columnId;
    const userInfo = allOrg(getState());
    if (payload?.dataTypes == "file") {
      const data = await uploadImage(
        dbId,
        tableId,
        payload.rowIndex,
        columnId,
        payload?.value,
        payload?.imageLink
      );
      payload.value = data?.data?.data;
      return payload;
    }
    let jsonToSend = {
      records: [
        {
          // where: `fld${tableId.substring(3)}autonumber = ${payload.rowIndex}`,
          where: `autonumber = ${payload.rowIndex}`,
          fields: { [columnId]: value },
        },
      ],
    };
    if (payload?.updatedArray) {
      jsonToSend = { records: payload?.updatedArray };
    }

    const data = await updateRow(dbId, tableId, jsonToSend);
    // const createdby = "fld" + tableId.substring(3) + "createdby";
    // const updatedby = "fld" + tableId.substring(3) + "updatedby";
    // const tableInfo = getTableInfo(getState())
    const userJson = await replaceCreatedByIdWithName(
      userInfo,
      getState().tables?.orgId
    );
    data.data.data.map((row) => {
      row["createdby"] = userJson?.[row["createdby"]]
        ? userJson?.[row["createdby"]]?.first_name +
          " " +
          userJson?.[row["createdby"]]?.last_name
        : row["createdby"];
      row["updatedby"] = userJson?.[row["updatedby"]]
        ? userJson?.[row["updatedby"]]?.first_name +
          " " +
          userJson?.[row["updatedby"]]?.last_name
        : row["updatedby"];
    });

    payload.newData = data?.data?.data;
    return payload;
  }
);
export const addRows = createAsyncThunk(
  "table/addRows",
  async (_, { getState }: { getState: any }) => {
    const userInfo = allOrg(getState());
    const { tableId, dbId } = getState().table;
    const newRow = await insertRow(dbId, tableId);
    // const createdby = "fld" + tableId.substring(3) + "createdby";
    userInfo.forEach((obj) => {
      obj.users.forEach((user) => {
        if (user?.user_id?._id == newRow?.data?.data[0]?.["createdby"]) {
          newRow.data.data[0]["createdby"] =
            user?.user_id?.first_name + " " + user?.user_id?.last_name;
          return;
        }
      });
    });
    return newRow?.data?.data[0];
  }
);
export const addMultipleRows = createAsyncThunk(
  "table/addMultipleRows",
  async (payload:{rows: Array<any>}, {getState}:{getState:any}) => {
    const userInfo = allOrg(getState());
    const {tableId, dbId} = getState().table;
    const newRows = await insertMultipleRows(dbId, tableId, payload.rows);
    
      userInfo.forEach((obj) => {
        obj.users.forEach((user) => {
          if (user?.user_id?._id == newRows?.data?.data[0]?.["createdby"]) {
            for(let i in newRows.data.data){
              newRows.data.data[i]["createdby"] =
                user.user_id.first_name + " " + user.user_id.last_name;
            }
            return;
          }
        });
      });
    return newRows.data?.data;
  }
);
export const updateColumnsType = createAsyncThunk(
  "table/updateColumnsType",
  async (payload: TableDataType, { dispatch }) => {
    dispatch(updateColumnType(payload));
    return payload;
  }
);
export const deleteRows = createAsyncThunk(
  "table/deleteRows",
  async (
    payload: { deletedRowIndices: any; dataa: Array<any> },
    { getState }: { getState: any }
  ) => {
    const { tableId, dbId } = getState().table;
    await deleteRow(dbId, tableId, { row_id: payload.deletedRowIndices });
    let rows = payload.dataa;
    let newrows = rows.filter((row) => {
      return !payload.deletedRowIndices.includes(
        Object.entries(row)[1][1] as any
      );
    });
    return newrows;
  }
);
export const updateColumnOrder = createAsyncThunk(
  "table/updateColumnOrder",
  async (
    payload: {
      filterId: string;
      oldIndex: string;
      newIndex: string;
      id: string;
    },
    { getState }: { getState: any }
  ) => {
    const data = {
      filterId: payload?.filterId,
      oldIndex: payload?.oldIndex,
      newIndex: payload?.newIndex,
    };
    const { tableId, dbId } = getState().table;
    await updateField(dbId, tableId, payload?.id, data);
    return payload;
  }
);
export const updateMultiSelectOptions = createAsyncThunk(
  "table/updateMultiSelectOptions",
  async (payload: FilterDataTypes) => {
    const data = {
      newFieldName: payload?.label,
      newFieldType: payload?.fieldType,
      metaData: { option: payload?.metaData },
    };
    await updateField(
      payload?.dbId,
      payload?.tableName,
      payload?.fieldName,
      data
    );
    return payload;
  }
);
