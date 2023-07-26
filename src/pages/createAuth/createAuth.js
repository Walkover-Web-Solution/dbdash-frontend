import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Modal,
} from "@mui/material";
import { PropTypes } from "prop-types";
import AuthKeyPopup from "../../component/authKeyComponents/authKeyPopup/authKeyPopup.js";
import { createAuthkey, updateAuthkey } from "../../api/authkeyApi";
import { selectActiveUser } from "../../store/user/userSelector.js";
import CloseIcon from "@mui/icons-material/Close";
import "./createAuth.scss";
import { allOrg } from "../../store/database/databaseSelector";
import Selectaccessandscope from "./Selectaccessandscope";
import { toast } from "react-toastify";
import { customUseSelector } from "../../store/customUseSelector";

export default function CreateAuthKey(props) {
  const id = props.id;
  const nameRef = useRef("");
  const userDetails = customUseSelector((state) => selectActiveUser(state));
  const [authKey, setAuthKey] = useState("");
  const [open, setOpen] = useState(false);

  const user = customUseSelector((state) => allOrg(state));
  const [scope, setScope] = useState({
    schema: "",
    alltables: "",
  });

  useEffect(() => {
    if (props?.authData && props?.title) {
      setDataForEdit({
        authData: props.authData,
        title: props.title,
      });
    }
  }, [props?.authData, props?.title]);

  function setDataForEdit(authkeydata) {
    if (!authkeydata) return;
    nameRef.current = authkeydata?.authData?.name || "";
    if (!authkeydata?.authData?.access) return;

    const updatedScope = {
      schema: "",
      alltables: "",
    };

    if (authkeydata?.authData?.access === "1") {
      updatedScope.alltables = authkeydata?.authData?.scope;
    } else if (authkeydata?.authData?.access === "11") {
      updatedScope.schema = authkeydata?.authData?.scope;
    } else {
      Object.entries(authkeydata?.authData?.access).forEach(([key, value]) => {
        updatedScope[key] = value.scope;
      });
    }

    setScope(updatedScope);
  }

  function getCreatedByName(data) {
    const createdByName = Object.values(data.updatedDoc.auth_keys)
      .flatMap((key) => {
        return user
          .flatMap((user) => user?.users || [])
          .filter((id) => id?.user_id?._id === key.user)
          .map((id) => id?.user_id?.first_name + " " + id?.user_id?.last_name);
      });

    props?.setCreatedBy(createdByName);
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      createAuth();
    }
  };

  const createAuth = async () => {
    const admin_id = localStorage.getItem("userid");
    const admin_name = userDetails?.fullName;
    if (!nameRef?.current.trim()) {
      toast.warning("Please provide a name.");
      return;
    }

    let data = {
      name: nameRef.current.trim(),
      userId: admin_id,
    };

    if (scope["schema"] && scope["schema"].trim()) {
      data.access = "11";
      data.scope = scope["schema"].trim();
    } else if (scope["alltables"] && scope["alltables"].trim()) {
      data.access = "1";
      data.scope = scope["alltables"].trim();
    } else {
      const access = Object.entries(scope).reduce((acc, [key, value]) => {
        if (key !== "schema" && key !== "alltables" && value.trim()) {
          acc[key] = { scope: value.trim() };
        }
        return acc;
      }, {});

      if (Object.keys(access).length === 0) {
        toast.warning("It is required to make at least one table accessible.");
        return;
      }

      data.access = access;
    }

    if (!props?.authData) {
      const create = await createAuthkey(id, admin_name, data);
      setOpen(true);
      setAuthKey(create?.data?.data?.authKey);
      props?.setAuthKeys(create?.data?.data?.updatedDoc?.auth_keys);
      getCreatedByName(create?.data?.data);
    } else {
      const authKey = props.title;
      const updatedAuthKey = await updateAuthkey(id, admin_id, authKey, data);
      setAuthKey(props.title);
      setOpen(true);
      props?.setAuthKeys(updatedAuthKey?.data?.data?.auth_keys);
    }
  };

  return (
    <>
      <Modal open={props.open} onClose={props.handleClose}>
        <Box className="create-auth-key-main-container" sx={{ p: 0, width: "35vw" }}>
          <div className="popupheader" style={{ marginBottom: "5%" }}>
            <Typography sx={{ ml: 2 }} id="title" variant="h6" component="h2">
              {props?.heading}
            </Typography>
            <CloseIcon sx={{ "&:hover": { cursor: "pointer" } }} onClick={props?.handleClose} />
          </div>

          <Box className="create-auth-key-row" sx={{ ml: 2, pr: 1 }}>
            <Typography className="create-auth-key-label">Name</Typography>
            <TextField
              id="standard-basic"
              label="Name"
              defaultValue={nameRef?.current}
              variant="standard"
              sx={{ width: "300px" }}
              onChange={(e) => {
                nameRef.current = e.target.value;
              }}
              onKeyDown={handleKeyDown}
            />
          </Box>
          <Selectaccessandscope scope={scope} setScope={setScope} alltabledata={props?.alltabledata} />
          <Box sx={{ display: "flex", m: 2, justifyContent: "space-between" }}>
            <Box>
              <Button
                variant="contained"
                onClick={createAuth}
                className="create-auth-key-button mui-button"
              >
                {props?.authData ? "Update" : "Create"}
              </Button>
              <AuthKeyPopup
                handleClose={props?.handleClose}
                open={open}
                setOpen={setOpen}
                title={authKey}
                EditAuthKeyData={props.id}
              />
            </Box>
            <Box></Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

CreateAuthKey.propTypes = {
  EditAuthKeyData: PropTypes.string,
  open: PropTypes.bool,
  authData: PropTypes.any,
  heading: PropTypes.any,
  title: PropTypes.any,
  id: PropTypes.any,
  alltabledata: PropTypes.any,

  handleClose: PropTypes.func,
  setAuthKeys: PropTypes.any,
  getCreatedByName: PropTypes.func,
  setCreatedBy: PropTypes.any,
};
