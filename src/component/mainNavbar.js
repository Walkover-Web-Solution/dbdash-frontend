import React, { useMemo } from 'react';
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
import { UserAuth } from '../context/authContext.js';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectActiveUser } from '../store/user/userSelector.js';
import PropTypes from 'prop-types';
import './mainNavbar.scss'
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
    <Container
      sx={{
        bgcolor: 'transparent',
        borderBottom: '2px solid black',
        height: '8vh',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      maxWidth="false"
    >
      <Box>
        <Link
          to="/dashboard"
          style={{
            textDecoration: 'none',
            marginBottom:"8px",
            fontFamily: 'Inter',
            fontSize: '1rem',
            color: 'black',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          <Typography
            variant="h6"
            
            component="span"
            sx={{ '&:hover': { textDecoration: 'underline' } }}
          >
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
      component={Link}
      to={{ pathname: `/apiDoc/db/${dbId}` }}
      sx={{
        fontFamily: 'Inter',
        fontSize: '1rem',
        textDecoration: 'none',
        color: "black",
        backgroundColor: shouldShowTableButton ? 'lightgrey' : 'transparent',
        pointerEvents: shouldShowTableButton ? 'none' : 'auto', // Added pointerEvents property

        mb: '2px',
        border: 'none',
        borderRadius: 0,
        '&:hover': {
          border: 'none',
          backgroundColor: 'transparent',
          color: 'black',
        },
      }}
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
              to={{ pathname: `/db/${dbId}` }}
              sx={{
                fontFamily:'Inter',
                fontSize: '1rem',
                textDecoration: 'none',
                color:"black",
                borderRadius:0,
                backgroundColor: shouldShowTypography ? 'lightgrey' : 'transparent',
                pointerEvents: shouldShowTypography ? 'none' : 'auto',
                mb: '2px',
                border: 'none',
                '&:hover': {
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'black',
                },
              }}
            >
              Tables
            </Button>
          </Tooltip>
        )}

        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ mb: '2px', ml: 10,borderRadius:0 }}>
            <Avatar alt={userDetails?.fullName} src={userDetails?.fullName || user?.user?.photoURL} />
          </IconButton>
        </Tooltip>

        <Menu
          sx={{ mt: '45px' }}
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

export default MainNavbar;

MainNavbar.propTypes = {
  dbData: PropTypes.any,
};
