export const getAllTableInfo=(state)=>{
    const {tables }=state.tables;
    const {dbId ,userAcess,userDetail, rowHistory}=state.tables; 
    return {tables,dbId,userAcess,userDetail, rowHistory};  
}