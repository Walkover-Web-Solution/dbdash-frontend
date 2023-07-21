export interface DbState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    orgId: OrgIdObj;
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
  