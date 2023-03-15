// import React,{useState} from 'react'
// import PropTypes from 'prop-types';
// import { Typography, Menu, MenuItem, Tooltip, IconButton } from '@mui/material'
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import AuthKeyPopup from './authKeyPopup';
// export default function TableMenuDropdown(props) {
//   console.log("inside Table manu dropdown",props)
//     const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//     const [anchorElUser, setAnchorElUser] = useState(null);
//     const handleOpenUserMenu = (event) => {
//       setAnchorElUser(event.currentTarget);
//     };
//     const handleCloseUserMenu = () => {
//       setAnchorElUser(null);
//     };
//   return (
//     <>
//         <Tooltip>
//             <IconButton onClick={(e)=>{
//               e.preventDefault();
//               handleOpenUserMenu(e)}}>
//               <MoreHorizIcon />
//             </IconButton>
//           </Tooltip>
//           <Menu
//             sx={{ mt: '45px' }}
//             id="menu-appbar"
//             anchorEl={anchorElUser}
//             anchorOrigin={{
//               vertical: 'top',
//               horizontal: 'left',
//             }}
//             keepMounted
//             transformOrigin={{
//               vertical: 'top',
//               horizontal: 'left',
//             }}
//             open={Boolean(anchorElUser)}
//             onClose={handleCloseUserMenu}
//           >
//             <MenuItem onClick={handleCloseUserMenu}>
//               <Typography textAlign="center" onClick={(e) =>{e.preventDefault();
//              }}>{props?.first}</Typography>
//             </MenuItem>
//             <MenuItem onClick={(e)=>{e.preventDefault();
//              handleCloseUserMenu(e)}}>
//               <Typography textAlign="center" >{props?.second}</Typography>
//             </MenuItem>
//             <MenuItem>
//               <Typography textAlign="center"  onClick={handleOpen} >{props?.third}</Typography>
//               <AuthKeyPopup open={open}
//               setOpen={setOpen}/>
//             </MenuItem>
//           </Menu>
//     </>
//   )
// }
// TableMenuDropdown.propTypes = {
//   first: PropTypes.string,
//   second: PropTypes.string,
//   third: PropTypes.string,
//   title: PropTypes.string,
//   deleteFunction : PropTypes.func
// };


import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteAuthKeyPopup from './authKeyTablePopup/deleteAuthkeyPopup';
import DisplayAuthKeyPopup from './authKeyTablePopup/displayAuthkeyPopup';
export default function AuthDropdown(props) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [open, setOpen] = useState(false);
  const[display,setDisplay]=useState(false);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = (event) => {
    event.stopPropagation();
    setAnchorElUser(null);
  };
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
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
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElUser)}
        display ={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleCloseUserMenu}>
          <Typography textAlign="center">{props?.first}</Typography>
        </MenuItem>
        <MenuItem
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleCloseUserMenu(event);
            setOpen(true);
          }}
        >
          <Typography textAlign="center">{props?.second}</Typography>
        </MenuItem>
        <MenuItem onClick={(event)=>{handleCloseUserMenu(event);setDisplay(true)}}>
          <Typography textAlign="center">{props?.third}</Typography>
        </MenuItem>
        <DeleteAuthKeyPopup
          open={open}
          setOpen={setOpen}
          title={props?.title}
          deleteFunction={props?.deleteFunction}
        />
        <DisplayAuthKeyPopup display={display} setDisplay={setDisplay} title={props?.title}/>
      </Menu>
    </>
  );
}
AuthDropdown.propTypes = {
  first: PropTypes.string,
  second: PropTypes.string,
  third: PropTypes.string,
  title: PropTypes.string,
  deleteFunction: PropTypes.func,
};