import {AllTableDataType} from './alltablesDataType'
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
  
  export interface OrgObj extends VersionData{
   
    _id: string;
    name: string;
    users: User[];
   
  }
  export interface VersionData{
    version: number;
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

 

export interface ActionDataType<T>{
  payload:T;
  
}


export interface MovePayloadType{
  orgId:string;
  data1:MovePayloadData1Info;
  
}

export interface MovePayloadData1Info{
org_id:string;
_id:string;
}


export interface RenamePayloadType{
  name: string;
  _id: string;
  org_id: string;
}

export interface ActionBulkAdd{
  payload:BulkAddData
}

export interface BulkAddData{
  status?: 'idle' | 'loading' | 'succeeded' | 'failed';
  orgId?: OrgIdObj|{};
  allorgs: OrgObj[]|[];
  result:OrgIdObj|{};
}


// export interface ActionOnCreateDB{
//   payload:CreateDBDetails;
// }

export interface CreateRestoreAndDeleteDBDetails extends DbObject,VersionData{
created_by:string;
users:UsersAccess;
tables:AllTableDataType ;
userMapping:UsersMapping|{};
deleted?:string;
lastActivedbTime?:number;
auth_keys?:Auth_keys;
webhook?:Webhooks;

}
export interface UsersAccess{
  [users:string]:{access:number}
}

interface Auth_keys{
  [authkey:string]:Authkeyobj;
  }
  interface Authkeyobj{
  access:AccessObj;
  name:string;
  user:string;
  createDate:string;
  }
  interface AccessObj{
  [tableId:string]:ScopeObj;
  }
  interface ScopeObj{
  scope:string;
  }

interface Webhooks{
condition:WebhookObj;
}
interface WebhookObj{
[webhookId:string]:Webhook;
}
interface Webhook{
name:string;
url:string;
tableId:string;
filterId:string;
isActive:boolean;
createdAt:number;
createdBy:string;
}

export interface createAndUpdateOrgThunkData{
  allorgs: OrgObj[]|[];
  data?:CreateRestoreAndDeleteDBDetails|{}
} 

export interface DatainThunkPayload{
  created_by?:string;
  name?:string;
  org_id?:OrgId;
  tables?:AllTableDataType;
  users?:UserAccessDataType;
  usersMapping?:UsersMapping;
  version?:Number;
  _v?:number;
  
  _id?:string;
}
export interface UserAccessDataType{
  [userId:string]:{
    access:number;
  }
}
export interface PayloadinThunkDataType{
  orgId?:string;
  id?:string;
  data:DatainThunkPayload;
  dbId?:string;
  name?:string;
  user_id?:string;
  email?:string;
  user_type?:number;
  adminId?:string|null;
}