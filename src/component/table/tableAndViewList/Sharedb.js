import React, {memo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from 'prop-types';

import { useParams } from "react-router-dom";
import ShareOrgModal from "../../workspaceDatabase/shareOrgModal";
import {
  addDbInUserThunk,
  removeDbInUserThunk,
  updateAccessOfUserInDbThunk,
} from "../../../store/allTable/allTableThunk";
import { customUseSelector } from "../../../store/customUseSelector";

function Sharedb(props) {
  const {setOpenShareDb,openShareDb}=props;
  const params = useParams();
  const adminId = localStorage.getItem("userid");
  const dispatch = useDispatch();
  const userAcess = customUseSelector((state) =>state.tables?.userAcess);
  const userDetail = customUseSelector((state) =>state.tables?.userDetail);
  const [dbUsers, setDbUsers] = useState();
  const [userType, setUserType] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  // const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    let arr = [];
    Object.entries(userDetail).map(([key, value]) => {
      let obj = {};
      obj[`user_type`] = userAcess[key]?.access;
      obj[`user_id`] = value;
      arr.push(obj);
    });
    let userObj = {
      users: arr,
    };
   userObj.users.map(userObj=>{
      if(userObj.user_id?._id==adminId )
      {
        if(userObj.user_type==1) setIsOwner(true);
        else if(userObj.user_type==11) setIsAdmin(true);
       
        return;
      }
    
    })
    
    setDbUsers(userObj);
  }, [userDetail]);
  

  const sharedatabase = async (email, user_type) => { 
    const data = {
      email: email,
      userAccess: user_type,
    };
    

    dispatch(addDbInUserThunk({ dbId: params.dbId, adminId, data }));
  };
  const updateUserinsharedb = (email, user_type) => {
    let obj = { ...dbUsers };
    let originalObj={...dbUsers};
    obj.users = obj.users.map((user) => {
      if (user.user_id.email === email) {
        return { ...user, user_type: user_type };
      }
      return user;
    });
  setDbUsers(obj);
    const data = {
      email: email,
      userAccess: { access: user_type },
    };
    dispatch(updateAccessOfUserInDbThunk({ dbId: params.dbId, adminId, data })).then(e=>{
      if(e.type.includes('rejected'))
      {
setDbUsers(originalObj);
      }
    });
  };
  const removeUserFromDb = (email, userId) => {
    const data = {
      email: email,
    };
  
    dispatch(removeDbInUserThunk({ dbId: params.dbId, adminId, data, userId }));
  };
  return (
    <div>
   

     {openShareDb && (isAdmin || isOwner) && <ShareOrgModal
        title={"Share Database"}
        useCase={"sharedb"}
        shareOrg={openShareDb}
        setShareOrg={setOpenShareDb}
        userType={userType}
        setUserType={setUserType}
        org={dbUsers}
        setOrg={setDbUsers}
        shareWorkspace={sharedatabase}
        updateUserTypeInOrg={updateUserinsharedb}
        removeUserFromWorkspace={removeUserFromDb}
      />}
    </div>
  );
}

Sharedb.propTypes = {
  openShareDb: PropTypes.any,
  setOpenShareDb:PropTypes.any,
};
export default memo(Sharedb);
