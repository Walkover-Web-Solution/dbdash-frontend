import React, { useMemo } from 'react';
import { Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Tooltip, MenuItem, Divider, Button } from '@mui/material';
import { UserAuth } from "../../context/authContext.js"
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectActiveUser } from '../../store/user/userSelector.js';
import PropTypes from 'prop-types';
import dbDashLogo from '../../../src/table/img/dbDashLogo.png';
import './mainNavbar.scss';

function MainNavbar(props) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = UserAuth();
  var { dbId } = useParams();
  const logOut = user?.logOut;
  const userDetails = useSelector((state) => selectActiveUser(state));

  const shouldShowTypography = useMemo(() => {
    const currentPath = location.pathname;
    return currentPath.startsWith(`/db/${dbId}`) || currentPath.startsWith(`/db/${dbId}/table`);
  }, [dbId, location.pathname]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      localStorage.clear();
      navigate("/")
    }
    catch (e) {
      console.log(e)
    }
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Container className="main-navbar-container" maxWidth="false">
      <Toolbar className="main-navbar-toolbar" disableGutters>
        <Box className="main-navbar-logo">
          <Box>
            <Link to="/dashboard">
              <img className="main-navbar-logo-image" src={dbDashLogo} alt="Db Dash" />
            </Link>
          </Box>
        </Box>
        {props?.dbData &&
          <Box className="main-navbar-dbname">
            <Typography variant="body1" align="center" fontWeight={600} color="white">
              {props?.dbData?.db.name}
            </Typography>
          </Box>
        }

        <Box ml="auto">
          {shouldShowTypography && <Tooltip title="APIs">
            <Button className="main-navbar-apis-button" component={Link} to={{ pathname: `/apiDoc/db/${dbId}` }}>
              APIs
            </Button>
          </Tooltip>}

          <Tooltip title="Open settings">
            <IconButton className="main-navbar-settings-button" onClick={handleOpenUserMenu}>
              <Avatar className="main-navbar-avatar" alt={userDetails?.fullName} src={userDetails?.fullName || user?.user?.photoURL} />
            </IconButton>
          </Tooltip>

          <Menu
            className="main-navbar-user-menu"
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
              <Typography className="main-navbar-user-menu-item-name" textAlign="center">{userDetails?.fullName}</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography className="main-navbar-user-menu-item-email" textAlign="center">{userDetails?.email}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleLogOut() }}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </Container>
  );
}
export default MainNavbar;

MainNavbar.propTypes = {
  dbData: PropTypes.any
}
