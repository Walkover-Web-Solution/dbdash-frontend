export const getAllTableInfo=(state)=>{
    const {tables }=state.tables;
    console.log("foghgoi",tables);
    const {dbId ,userAcess,userDetail}=state.tables; 
    return {tables,dbId,userAcess,userDetail};  
}