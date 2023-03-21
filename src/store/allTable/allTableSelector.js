export const getAllTableInfo=(state)=>{
    const {tables }=state.tables;
    const {dbId}=state.tables;
    return {tables,dbId};
}