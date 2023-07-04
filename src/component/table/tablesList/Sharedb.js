import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ShareOrgModal from "../../workspaceDatabase/shareOrgModal";
import {
  addDbInUserThunk,
  removeDbInUserThunk,
  updateAccessOfUserInDbThunk,
} from "../../../store/allTable/allTableThunk";

function Sharedb() {
  const params = useParams();
  const adminId = localStorage.getItem("userid");
  const dispatch = useDispatch();
  const userAcess = useSelector((state) =>state.tables?.userAcess);
  const userDetail = useSelector((state) =>state.tables?.userDetail);
  const [openShareDb, setOpenShareDb] = useState(false);
  const [dbUsers, setDbUsers] = useState();
  const [userType, setUserType] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
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
    const data = {
      email: email,
      userAccess: { access: user_type },
    };
    dispatch(updateAccessOfUserInDbThunk({ dbId: params.dbId, adminId, data }));
  };
  const removeUserFromDb = (email, userId) => {
    const data = {
      email: email,
    };
    dispatch(removeDbInUserThunk({ dbId: params.dbId, adminId, data, userId }));
  };
  return (
    <div>
    { (isAdmin || isOwner) &&  <Button
        variant="contained"
        className="mui-button "
        sx={{ position: "absolute", top: "0%", right: "1%" }}
        onClick={() => {
          setOpenShareDb(true);
        }}
      >
        Share DB
      </Button>}

     {openShareDb &&  <ShareOrgModal
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

export default Sharedb;
