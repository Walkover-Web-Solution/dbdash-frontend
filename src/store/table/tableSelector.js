export const getTableInfo=(state)=>{
    const {table}=state;
    const {columns,data,skipReset,tableId,dbId,pageNo}=table;
    return {columns,data, skipReset,tableId,dbId,pageNo};
}