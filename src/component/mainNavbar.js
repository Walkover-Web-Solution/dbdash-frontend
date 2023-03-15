import React from 'react';
import {Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Tooltip, MenuItem,  Divider} from '@mui/material';
import { UserAuth } from "../context/authContext.js"
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectActiveUser } from '../store/user/userSelector.js';

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
    <Container sx={{bgcolor: "#212529", height: '55px'}} maxWidth="false" >

      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '50px' }} disableGutters>

        <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', width: '20%', height: '50px' }}>

          <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "center" }}>
            <Link to="/dashboard">
              {/* <img style={{ width: "120px", height: 'auto' }}
                src={viaScoketWhiteImg}
                alt="Via Socket" />  */}
              DB Dash
            </Link>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: "white", ':hover': { color: 'black', cursor: 'pointer' } }}>

          </Box>
        </Box>



        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30px', }}>

          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={userDetails?.fullName} src={userDetails?.fullName || user?.user?.photoURL}/>
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

