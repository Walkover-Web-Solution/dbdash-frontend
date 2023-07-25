import React, { useState } from "react";
import PropTypes from "prop-types";
import { Typography, Menu, MenuItem, Tooltip, IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteAuthKeyPopup from "../authKeyTablePopup/deleteAuthkeyPopup";
import DisplayAuthKeyPopup from "../authKeyTablePopup/displayAuthkeyPopup";
import CreateAuthKey from "../../../pages/createAuth/createAuth";
import styling from "../../../assets/styling.scss";

export default function AuthDropdown(props) {
  const [state, setState] = useState({
    anchorElUser: null,
    open: false,
    display: false,
    open1: false,
  });

  const handleOpenUserMenu = (event) => {
    setState({ ...state, anchorElUser: event.currentTarget });
  };

  const handleCloseUserMenu = () => {
    setState({ ...state, anchorElUser: null });
  };

  const handleClose = () => {
    setState({ ...state, open1: false });
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
        anchorEl={state.anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(state.anchorElUser)}
        display={Boolean(state.anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            setState({ ...state, open1: true });
          }}
        >
          <Typography className="menu-item-typography">{props?.first}</Typography>
        </MenuItem>

        <MenuItem
          onClick={(event) => {
            handleCloseUserMenu(event);
            setState({ ...state, display: true });
          }}
        >
          <Typography className="menu-item-typography">{props?.third}</Typography>
        </MenuItem>
        <DeleteAuthKeyPopup
          open={state.open}
          setOpen={(open) => setState({ ...state, open })}
          title={props?.title}
          deleteFunction={props?.deleteFunction}
        />
        <MenuItem
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleCloseUserMenu(event);
            setState({ ...state, open: true });
          }}
          sx={{ color: styling.deletecolor }}
        >
          <Typography className="menu-item-typography">{props?.second}</Typography>
        </MenuItem>
        <DisplayAuthKeyPopup
          display={state.display}
          setDisplay={(display) => setState({ ...state, display })}
          title={props?.title}
        />
      </Menu>

      {state.open1 && (
        <CreateAuthKey
          alltabledata={props?.alltabledata}
          heading={"edit authkey"}
          setAuthKeys={props?.setAuthKeys}
          open={state.open1}
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
