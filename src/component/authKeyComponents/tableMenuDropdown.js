
import React, { useState } from 'react';
// import {useParams} from 'react-router-dom'
import PropTypes from 'prop-types';
import {Typography,Menu,MenuItem,Tooltip,IconButton} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteAuthKeyPopup from './authKeyTablePopup/deleteAuthkeyPopup';
import DisplayAuthKeyPopup from './authKeyTablePopup/displayAuthkeyPopup';
import CreateAuthKey from '../../pages/createAuth/createAuth';

export default function AuthDropdown(props) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [open, setOpen] = useState(false);
  const[display,setDisplay]=useState(false);
  console.log("hdfjflkjefljflh;wefhjkkkkkkkkkkk",props.dbId)
  // const navigate = useNavigate();
  // const params = useParams();
const[open1,setOpen1]=useState(false);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    // event.stopPropagation();
    setAnchorElUser(null);
  };
  //const authKeylastThreeChar=
  
  const handleClose=()=>{
    setOpen1(false);
  }
  console.log(props.dbId,"dddddddwwwwwww")
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

        <MenuItem onClick={() => {setOpen1(true)}}>
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
     { open1 &&<CreateAuthKey dbId={props.dbId} open={open1} handleClose={handleClose} />
    
}
    </>
  );
}
AuthDropdown.propTypes = {
  first: PropTypes.string,
  second: PropTypes.string,
  third: PropTypes.string,
  title: PropTypes.string,
  dbId:PropTypes.any,
  deleteFunction: PropTypes.func,
  authData :PropTypes.object,
};