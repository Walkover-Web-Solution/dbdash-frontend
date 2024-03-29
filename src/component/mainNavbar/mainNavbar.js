import React, { memo, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

import { selectActiveUser } from "../../store/user/userSelector.js";
import { UserAuth } from "../../context/authContext.js";
import variables from "../../assets/styling.scss";
import {
  Box,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
  Divider,
  Button,
} from "@mui/material";
import "./mainNavbar.scss";
import { selectOrgandDb } from "../../store/database/databaseSelector.js";
import Sharedb from "../table/tablesList/Sharedb.js";
import CreateTemplatePopup from "../workspaceDatabase/createTemplatePopup/createTemplatePopup.js";
import DbSnapshotsMenu from "./dbSnapshotsMenu/dbSnapshotsMenu.js";
import { useRef } from "react";
import { customUseSelector } from "../../store/customUseSelector";

function MainNavbar(props) {
  const { dbId, id, tableName } = useParams();
  const [openTemplate, setOpenTemplate] = useState(false);
  const [openShareDb, setOpenShareDb] = useState(false);
  const [openDbSnapshot, setOpenDbSnapshot] = useState(false);
  const revisionbuttonref = useRef(null);

  const alldb = customUseSelector((state) => selectOrgandDb(state));
  let dbname = "";
  Object.entries(alldb).forEach(([, dbs]) => {
    const matchingDb = dbs.find((db) => db?._id === props.dbtoredirect);
    if (matchingDb) {
      dbname = matchingDb.name;
    }
  });

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElMenu, setAnchorElMenu] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const user = UserAuth();

  const logOut = user?.logOut;
  const userDetails = customUseSelector((state) => selectActiveUser(state));
  const shouldShowTypography = useMemo(() => {
    const currentPath = location.pathname;
    return (
      currentPath.startsWith(`/db/${dbId}`) ||
      currentPath.startsWith(`/db/${dbId}/table`)
    );
  }, [dbId, location.pathname]);

  const shouldShowTableButton = useMemo(() => {
    const currentPath = location.pathname;
    return (
      currentPath.startsWith("/apiDoc/db") ||
      currentPath.startsWith("/authkeypage")
    );
  });

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenMenu = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      localStorage.clear();
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const userAvatar = useMemo(
    () => (
      <Tooltip title="Open settings">
        <IconButton
          size="small"
          onClick={handleOpenUserMenu}
          className="main-navbar-avatar-button"
        >
          <Avatar
            sx={{
              height: variables.profileiconheight,
              width: variables.profileiconwidth,
            }}
            alt={userDetails?.fullName}
            src={userDetails?.fullName || user?.user?.photoURL}
          />
        </IconButton>
      </Tooltip>
    ),
    [userDetails?.fullName, user?.user?.photoURL]
  );

  const apiButtonWithTooltip = useMemo(
    () => (
      <Tooltip title="APIs">
        <Button
          variant="outlined"
          className={
            shouldShowTableButton
              ? "main-navbar-button show-table"
              : "main-navbar-button"
          }
          onClick={()=>{
            navigate(`/apiDoc/db/${dbId}`, {state: tableName});
          }}
        >
          APIs
        </Button>
      </Tooltip>
    ),
    [shouldShowTableButton, dbId, tableName]
  );

  const tableButtonWithTooltip = useMemo(
    () => (
      <Tooltip title="Tables">
        <Button
          variant="outlined"
          component={Link}
          className={
            shouldShowTypography
              ? "main-navbar-button show-table"
              : "main-navbar-button"
          }
          to={
            props.dbtoredirect && props.tabletoredirect
              ? {
                  pathname: `/db/${props.dbtoredirect}/table/${props.tabletoredirect}`,
                }
              : props.dbtoredirect
              ? { pathname: `/db/${props.dbtoredirect}` }
              : { pathname: `/db/${dbId || id}` }
          }
        >
          Tables
        </Button>
      </Tooltip>
    ),
    [shouldShowTypography, props.dbtoredirect, props.tabletoredirect, dbId, id]
  );

  return (
    <Container className="main-navbar-container" maxWidth={false}>
      <Box>
        <Link to="/dashboard" className="main-navbar-link">
          <Typography
            variant={variables.homebuttonvariant}
            component="span"
            className="main-navbar-title"
          >
            dbDash   
          </Typography>
        </Link>
      </Box>

      {(props?.dbData || props?.dbtoredirect) && (
        <Typography
          fontWeight={Number(variables.mainnavbarfontweight)}
          fontFamily={variables.fontFamily}
          sx={{ paddingBottom: 0.85 }}
          fontSize={Number(variables.titlesize)}
          color={variables.mainnavbartextcolor}
        >
          {props?.dbData?.db?.name || dbname}
        </Typography>
      )}

      <Box>
        {openTemplate && (
          <CreateTemplatePopup
            dbId={dbId}
            db={props?.dbData?.db?.name || dbname}
            open={openTemplate}
            setOpen={setOpenTemplate}
          />
        )}
        {openDbSnapshot && (
          <DbSnapshotsMenu
            dbSnapshots={props?.dbData?.db?.dbSnapshots || {}}
            revisionbuttonref={revisionbuttonref.current?.getBoundingClientRect()}
            dbname={props?.dbData?.db?.name || dbname}
            pen={openDbSnapshot}
            setOpen={setOpenDbSnapshot}
          />
        )}
        {openShareDb && (
          <Sharedb setOpenShareDb={setOpenShareDb} openShareDb={openShareDb} />
        )}
        {dbId && (
          <>
            <IconButton
              size="small"
              onClick={handleOpenMenu}
              className="main-navbar-avatar-button"
            >
              <MenuIcon />
            </IconButton>

            {apiButtonWithTooltip}
          </>
        )}

        {(shouldShowTypography || shouldShowTableButton) &&
          tableButtonWithTooltip}

        {userAvatar}

        <Menu
          className="main-navbar-menu"
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          PaperProps={{
            style: {
              marginTop: "-15px", // Adjust the margin as needed
            },
          }}
        >
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography className="text-align-center">
              {userDetails?.fullName}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography className="text-align-center">
              {userDetails?.email}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogOut}>
            <Typography className="text-align-center">Logout</Typography>
          </MenuItem>
        </Menu>

        <Menu
          className="main-navbar-menu"
          id="menu-appbar"
          anchorEl={anchorElMenu}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            style: {
              marginTop: "-15px", // Adjust the margin as needed
            },
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElMenu)}
          onClose={handleCloseMenu}
        >
          <MenuItem
            onClick={() => {
              setOpenTemplate(true);
              handleCloseMenu();
            }}
          >
            <Typography className="text-align-center">
              Create Template
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenShareDb(true);
              handleCloseMenu();
            }}
          >
            <Typography className="text-align-center">Share DB</Typography>
          </MenuItem>
          <MenuItem
            ref={revisionbuttonref}
            onClick={() => {
              setOpenDbSnapshot(true);
              handleCloseMenu();
            }}
          >
            <Typography className="text-align-center">Db Snapshots</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Container>
  );
}

MainNavbar.propTypes = {
  dbData: PropTypes.any,
  dbtoredirect: PropTypes.any,
  tabletoredirect: PropTypes.any,
};

export default memo(MainNavbar);
