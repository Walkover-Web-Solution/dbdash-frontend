export interface DbStateType {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    orgId: OrgIdObj|{};
    allOrg: OrgObj[];
  }
  
  export interface OrgIdObj {
    [orgId: string]: DbObject[];
  }
  
  export interface DbObject {
    name: string;
    _id: string;
    org_id: OrgId;
  }
  
  export interface OrgId {
    _id: string;
    name: string;
  }
  
  export interface OrgObj {
    version: number;
    _id: string;
    name: string;
    users: User[];
    _v: number;
  }
  
  export interface User {
    user_id: UsersMapping;
    user_type: number;
    _id: string;
  }
  
  export interface UsersMapping {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  }

  // export interface DBActionType{
  //   payload:PayloadRemaneforbulkAdd ;
  // }

  // export interface PayloadRemaneforbulkAdd{
  //   allorgs:Array<AllOrgArrType>;
  //   result:OrgIdObj;
  //   type:string;
  // }

  // export interface AllOrgArrType{
  //   name:string;
  //   users:Array<UsersDetailType>;
  //   version:number;
  //   _v:number;
  //   _id:string;
  // }

  // export interface UsersDetailType{
  //   user_id:UsersMapping;
  //   user_type:number;
  //   _id:string;
  // }

export interface ActionMoveDB{
  payload:MovePayloadType;
}


export interface MovePayloadType{
  orgId:string;
  data1:MovePayloadData1Info;
  
}

export interface MovePayloadData1Info{
org_id:string;
_id:string;
}

export interface ActionRenameDB{
  payload:RenameDBData;
}
export interface RenameDBData{
  name: string;
  _id: string;
  org_id: string;
}

export interface ActionBulkAdd{
  payload:BulkAddData
}

export interface BulkAddData{
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  orgId: OrgIdObj|{};
  allorgs: OrgObj[];
  result:OrgIdObj;
}

