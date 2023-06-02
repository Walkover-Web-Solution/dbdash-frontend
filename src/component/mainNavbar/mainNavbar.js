import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectActiveUser } from '../../store/user/userSelector.js';
import { UserAuth } from '../../context/authContext.js';
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

function MainNavbar(props) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = UserAuth();
  const { dbId } = useParams();
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
          <Typography variant="h6" component="span" className="main-navbar-title">
            dbDash
          </Typography>
        </Link>
      </Box>

      {props?.dbData && (
        <Typography
          variant="body1"
          align="center"
          fontWeight={200}
          fontFamily="Inter"
          fontSize={24}
          color="black"
        >
          {props?.dbData?.db.name}
        </Typography>
      )}

      <Box>
        {(shouldShowTypography || shouldShowTableButton) && (
          <Tooltip title="APIs">
            <Button
              variant="outlined"
              className="main-navbar-button"
              component={Link}
              style={shouldShowTableButton ? { backgroundColor: 'lightgrey', pointerEvents: 'none' } : {}}
              to={{ pathname: `/apiDoc/db/${dbId}` }}
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
              style={shouldShowTypography ? { backgroundColor: 'lightgrey', pointerEvents: 'none' } : {}}
              to={{ pathname: `/db/${dbId}` }}
            >
              Tables
            </Button>
          </Tooltip>
        )}

        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} className="main-navbar-avatar-button">
            <Avatar alt={userDetails?.fullName} src={userDetails?.fullName || user?.user?.photoURL} />
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
};

export default MainNavbar;
