import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectActiveUser } from '../../store/user/userSelector.js';
import { UserAuth } from '../../context/authContext.js';
import variables from '../../assets/styling.scss';
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
} from '@mui/material';
import './mainNavbar.scss';
import { selectOrgandDb } from '../../store/database/databaseSelector.js';


function MainNavbar(props) {
  let { dbId  ,id,tableName} = useParams();

  const alldb = useSelector((state) => selectOrgandDb(state));
let dbname = '';
  Object.entries(alldb).forEach(([, dbs]) => {
    const matchingDb = dbs.find(db => db?._id === props.dbtoredirect);
    if (matchingDb) {
      dbname = matchingDb.name;
    }
  });
  
  console.log("props",props);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = UserAuth();
  

  const logOut = user?.logOut;
  const userDetails = useSelector((state) => selectActiveUser(state));
  const shouldShowTypography = useMemo(() => {
    const currentPath = location.pathname;
    return (
      currentPath.startsWith(`/db/${dbId}`) || currentPath.startsWith(`/db/${dbId}/table`)
    );
  }, [dbId, location.pathname]);

  const shouldShowTableButton = useMemo(() => {
    const currentPath = location.pathname;
    return currentPath.startsWith('/apiDoc/db') || currentPath.startsWith('/authkeypage');
  });

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      localStorage.clear();
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Container className="main-navbar-container" maxWidth="false">
      <Box>
        <Link to="/dashboard" className="main-navbar-link">
          <Typography variant={variables.homebuttonvariant} component="span" className="main-navbar-title">
            dbDash
          </Typography>
        </Link>
      </Box>

      {(props?.dbData || props.dbtoredirect)  && (
        <Typography
          fontWeight={Number(variables.mainnavbarfontweight)}
          fontFamily={variables.fontFamily}
          sx={{paddingBottom:0.85}} 
          fontSize={Number(variables.titlesize)}
          color={variables.mainnavbartextcolor}
        >
          {props?.dbData?.db.name || dbname}
        </Typography>
      )}

      <Box>
        {(shouldShowTypography || shouldShowTableButton) && (
          <Tooltip title="APIs">
            <Button
              variant="outlined"
              className="main-navbar-button"
              component={Link}
              style={shouldShowTableButton ? { backgroundColor: variables.highlightedtabbgcolor, pointerEvents: 'none' } : {}}
              to={{ pathname: `/apiDoc/db/${dbId}` }}
              state={tableName}
            >
              APIs
            </Button>
          </Tooltip>
        )}

        {(shouldShowTypography || shouldShowTableButton) && (
          <Tooltip title="Tables">
           <Button
  variant="outlined"
  component={Link}
  className="main-navbar-button"
  style={shouldShowTypography ? { backgroundColor: variables.highlightedtabbgcolor, pointerEvents: 'none' } : {}}
  to={props.dbtoredirect && props.tabletoredirect ? { pathname: `/db/${props.dbtoredirect}/table/${props.tabletoredirect}` }
    : props.dbtoredirect ? { pathname: `/db/${props.dbtoredirect}` }
    : { pathname: `/db/${dbId || id}` }
  }
>


              Tables
            </Button>
          </Tooltip>
        )}

        <Tooltip title="Open settings">
          <IconButton  size="small" onClick={handleOpenUserMenu} className=" main-navbar-avatar-button">
            <Avatar sx={{height:variables.profileiconheight,width:variables.profileiconwidth}} alt={userDetails?.fullName} src={userDetails?.fullName || user?.user?.photoURL} />
          </IconButton>
        </Tooltip>

        <Menu
          className="main-navbar-menu"
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography textAlign="center">{userDetails?.fullName}</Typography>
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography textAlign="center">{userDetails?.email}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogOut}>
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Container>
  );
}

MainNavbar.propTypes = {
  dbData: PropTypes.any,
  dbtoredirect:PropTypes.any,
  tabletoredirect:PropTypes.any,
};

export default MainNavbar;
