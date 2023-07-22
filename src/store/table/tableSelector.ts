import { TableDataType } from "../../types/tableDataTypes";
export const getTableInfo = (state): TableDataType => {
  const { table } = state;
  const {
    columns,
    data,
    skipReset,
    tableId,
    dbId,
    pageNo,
    isMoreData,
    filterId,
  } = table;
  return {
    columns,
    data,
    skipReset,
    tableId,
    dbId,
    pageNo,
    isMoreData,
    filterId,
  };
};
