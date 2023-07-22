export const getAllTableInfo=(state)=>{
    // console.log("state", state);
    const {tables }=state.tables;
    // console.log("foghgoi",tables);
    const {dbId ,userAcess,userDetail}=state.tables; 
    return {tables,dbId,userAcess,userDetail};  
}