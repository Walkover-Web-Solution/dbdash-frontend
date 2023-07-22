import {AllTableDataType, UserAcessType} from './alltablesDataType';
export interface DbStateType {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    orgId: OrgIdObjType|{};
    allOrg: OrgObj[];
  }
  
  export interface OrgIdObjType {
    [orgId: string]: DbObject[];
  }
  
  export interface DbObject {
    name: string;
    _id: string;
    org_id: OrgId;
  }
  
  export interface OrgId {
    _id: string;
    name?: string;
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
  orgId?: OrgIdObjType|{};
  allorgs: OrgObj[];
  result:OrgIdObjType|{};
}



export interface CreateRestoreAndDeleteDBDetails extends DbObject,VersionData{
created_by:string;
users:UserAcessType;
tables:AllTableDataType ;
userMapping:UsersMapping|{};
deleted?:string;
lastActivedbTime?:number;
auth_keys?:Auth_keysMappingType;
webhook?:Webhooks;

}

interface Auth_keysMappingType{
  [authkey:string]:AuthkeyobjType;
  }
  interface AuthkeyobjType{
  access:TableToScopeMappingType;
  name:string;
  user:string;
  createDate:string;
  }
  interface TableToScopeMappingType{
  [tableId:string]:ScopeObjType;
  }
  interface ScopeObjType{
  scope:string;
  }

interface Webhooks{
condition:WebhookMapType;
}
interface WebhookMapType{
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
  allorgs: OrgObj[];
  data?:CreateRestoreAndDeleteDBDetails|{}
} 

export interface createDbThunkPayloadType{
 data:CreateRestoreAndDeleteDBDetails;
}
export interface RenameDbThunkPayloadType{
  orgId:string;
  id:string;
  data:{
    name:string;
  }
 }
 export interface DeleteAndRestoreDbThunkPayloadType{
  orgId:string;
  dbId:string;
 }
 
 export interface RenameOrgThunkPayloadType{
  orgId:string;
  user_id:string;
  data:{
    name:string;
  }
 }
 export interface CreateOrgThunkPayloadType{
  name:string;
  user_id:string;
 }
 export interface ShareOrgThunkPayloadType{
  orgId:string;
  adminId:string;
  data:DatainShareOrgType;
 }
 export interface DatainShareOrgType{
  email:string;
  user_type?:number;
 }