import React,{useState} from 'react'
import PropTypes from 'prop-types';
import { Typography, Menu, MenuItem, Tooltip, IconButton } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AlertPopup from './alertPopup';
// import SelectFilepopup from '../table/selectFilepopup';


export default function Dropdown(props) {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [open, setOpen] = useState(false);

    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = (e) => {
      e.stopPropagation();
      setAnchorElUser(null);
    };
    const handleClickOpen = () => {
      setOpen(true);
    };
  return (
    <>
        <Tooltip>
            <IconButton onClick={(e)=>{
              e.preventDefault();
              e.stopPropagation();
              handleOpenUserMenu(e)}}>
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
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center" onClick={(e) =>{e.preventDefault();
                            props?.setOpenmove(false);
              e.stopPropagation(); props?.setName (true);
              if (typeof props?.setTabIndex === 'function') 
              {
                props?.setTabIndex(props?.tabIndex)
              }
              }}>{props?.first}</Typography>
            </MenuItem>
            {props?.second!=="" && <MenuItem onClick={(e)=>{e.preventDefault();
              e.stopPropagation();handleCloseUserMenu(e);setOpen(true);}}>
              <Typography  onClick={handleClickOpen} textAlign="center" >{props?.second}</Typography>
            </MenuItem>}
           {props?.third==="Move" && <MenuItem onClick={handleCloseUserMenu}>
              <Typography  onClick={(e)=>{e.preventDefault(); e.stopPropagation();
              props?.setName(false);
              props?.setOpenmove(true);
              if (typeof props?.setTabIndex === 'function') 
              {
                props?.setTabIndex(props?.tabIndex)
              }}} textAlign="center" >{props?.third}</Typography>
            </MenuItem> }

          <AlertPopup open={open} setOpen ={setOpen} tables={props?.tables} tableId ={props?.tableId} title={props?.title } deleteFunction={props?.deleteFunction}  />
          </Menu>
          
    </>
  )
}
Dropdown.propTypes = {
  first: PropTypes.string,
  second: PropTypes.string,
  third: PropTypes.string,
  setName: PropTypes.func,
  title: PropTypes.string,
  tableId : PropTypes.string,
  deleteFunction : PropTypes.func, 
  setTabIndex:PropTypes.func,
  tabIndex:PropTypes.number,
  tables:PropTypes.any,
  
  setOpenmove:PropTypes.func
};