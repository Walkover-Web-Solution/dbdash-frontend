import React, { useMemo } from 'react';
import {Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Tooltip, MenuItem,  Divider, Button} from '@mui/material';
import { UserAuth } from "../context/authContext.js"
import { Link, useNavigate, useParams,useLocation} from 'react-router-dom';
import { useSelector} from 'react-redux';
import { selectActiveUser } from '../store/user/userSelector.js';
import PropTypes from 'prop-types';
import dbDashLogo from '../table/img/dbDashLogo.png';

function MainNavbar(props) {

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = UserAuth();
  var {dbId} = useParams();
  console.log(dbId);
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
    <Container sx={{bgcolor: "#212529", height: '8vh',position:'absolute',top:0}} maxWidth="false" >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '8vh' }} disableGutters>
        <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', width: '20%', height: '50px' }}>
          <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "center" }}>
            <Link to="/dashboard">
              <img style={{ width: "100px", height: '3vh' }}
                src={dbDashLogo}
                alt="Db Dash" /> 
            </Link>
          </Box>
        </Box>


        
        {props?.dbData &&
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60%', height: '50px',mb: "2.5px" }}>
            <Typography variant="body1" align="center" fontWeight={600} color="white">
              {props?.dbData?.db.name}
            </Typography>
          </Box>
        
        }

                <Box ml="auto">
         {shouldShowTypography && <Tooltip title="APIs">
            <Button variant="outlined" className="mui-button-outlined"  component={Link} to={{ pathname: `/apiDoc/db/${dbId}` }} sx={{ textDecoration: 'none', color: '#fff', mb: '8px',fontWeight: 'bold',  
          }}>APIs</Button>
          </Tooltip>}

          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ mb: "9px",ml:10 }}>
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

MainNavbar.propTypes= {
  dbData:PropTypes.any
}