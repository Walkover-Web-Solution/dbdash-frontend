export const getTableInfo=(state)=>{
    const {table}=state;
    const {columns,data,skipReset,tableId,dbId}=table;
    return {columns,data, skipReset,tableId,dbId};
}