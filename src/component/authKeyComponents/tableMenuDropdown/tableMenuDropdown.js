import React, { useState } from "react";
import PropTypes from "prop-types";
import { Typography, Menu, MenuItem, Tooltip, IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteAuthKeyPopup from "../authKeyTablePopup/deleteAuthkeyPopup";
import DisplayAuthKeyPopup from "../authKeyTablePopup/displayAuthkeyPopup";
import CreateAuthKey from "../../../pages/createAuth/createAuth";
import styling from "../../../assets/styling.scss";
export default function AuthDropdown(props) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState(false);
  const [open1, setOpen1] = useState(false);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClose = () => {
    setOpen1(false);
  };
  return (
    <>
      <Tooltip>
        <IconButton
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleOpenUserMenu(event);
          }}
        >
          <MoreHorizIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElUser)}
        display={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            setOpen1(true);
          }}
        >
          <Typography className="menu-item-typography">{props?.first}</Typography>
        </MenuItem>

        <MenuItem
          onClick={(event) => {
            handleCloseUserMenu(event);
            setDisplay(true);
          }}
        >
          <Typography className="menu-item-typography">{props?.third}</Typography>
        </MenuItem>
        <DeleteAuthKeyPopup
          open={open}
          setOpen={setOpen}
          title={props?.title}
          deleteFunction={props?.deleteFunction}
        />
        <MenuItem
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleCloseUserMenu(event);
            setOpen(true);
          }}
          sx={{ color: styling.deletecolor }}
        >
          <Typography className="menu-item-typography">{props?.second}</Typography>
        </MenuItem>
        <DisplayAuthKeyPopup
          display={display}
          setDisplay={setDisplay}
          title={props?.title}
        />
      </Menu>

      {open1 && (
        <CreateAuthKey
          alltabledata={props?.alltabledata}
          heading={"edit authkey"}
          setAuthKeys={props?.setAuthKeys}
          open={open1}
          id={props.dbId}
          authData={props.authData}
          title={props.title}
          handleClose={handleClose}
        />
      )}
    </>
  );
}
AuthDropdown.propTypes = {
  first: PropTypes.string,
  second: PropTypes.string,
  third: PropTypes.string,
  dbId: PropTypes.any,
  title: PropTypes.string,
  deleteFunction: PropTypes.func,
  authData: PropTypes.object,
  setAuthKeys: PropTypes.any,
  alltabledata: PropTypes.any,
  getCreatedByName: PropTypes.func,
};