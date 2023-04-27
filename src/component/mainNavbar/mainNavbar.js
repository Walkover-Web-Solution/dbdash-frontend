import React from 'react';
import {Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Tooltip, MenuItem,  Divider} from '@mui/material';
import { UserAuth } from "../../context/authContext.js"
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectActiveUser } from '../../store/user/userSelector.js';
import './mainNavbar.css';
function MainNavbar() {

  const user = UserAuth();
  const logOut = user?.logOut;
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const userDetails = useSelector((state) => selectActiveUser(state));

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
    <Container className="first"  maxWidth="false" >

      <Toolbar className="toolbar"  disableGutters>

        <Box className="boxone" >

          <Box  className="boxtwo" >
            <Link to="/dashboard">
          
              DB Dash
            </Link>
          </Box>

          <Box className="boxthree" >
          </Box>
        </Box>

        <Box  className="boxfour" >

          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu}  className="mb9" >
              <Avatar alt={userDetails?.fullName} src={userDetails?.fullName || user?.user?.photoURL}/>
            </IconButton>
          </Tooltip>

          <Menu
          className='mt45'
            
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

