export const selectOrgandDb = (state) =>{
       const alldata = state.dataBase.orgId
    return alldata;
}

export const allOrg = (state) =>{
    const allOrg = state.dataBase.allOrg
    return allOrg;
}
