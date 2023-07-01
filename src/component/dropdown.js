import React,{useEffect, useState} from 'react'
import PropTypes from 'prop-types';
import { Typography, Menu, MenuItem, Tooltip} from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AlertPopup from './alertPopup';
import ShareOrgModal from './workspaceDatabase/shareOrgModal';
import {  addDbInUser } from '../api/dbApi';
import { useSelector } from 'react-redux';
import { selectOrgandDb } from '../store/database/databaseSelector';
export default function Dropdown(props) {
  
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [dbUsers,setDbUsers]=useState('');
    const [userType,setUserType]=useState('');
  const alldb = useSelector((state) => selectOrgandDb(state));
  

const[openShareDb,setOpenShareDb]=useState(false);
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
const sharedatabase=(email,user_type)=>{
  const adminId = localStorage.getItem("userid");
  let userAccess;
  switch(user_type)
  {
    case 'owner': userAccess='1'; break;
    case 'admin': userAccess='11'; break;
    case 'user':userAccess='111'; break;
    default:break;
  }
  const data={
    email:email,
    userAccess:userAccess
  }
  console.log("dklngg",adminId,data);

  addDbInUser(props?.dbid,adminId,data);
}
// const updateUserinsharedb=()
  return (
    <>
        <Tooltip>
          {/* <IconButton> */}
              <MoreHorizIcon  onClick={(e)=>{
              e.preventDefault();
              e.stopPropagation();
              handleOpenUserMenu(e)}} />
              {/* </IconButton> */}
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
                           
              e.stopPropagation(); props?.setName (true);
              if (typeof props?.setTabIndex === 'function') 
              {
                props?.setTabIndex(props?.tabIndex)
              }
              }}>{props?.first}</Typography>
            </MenuItem>
            {props?.second!=="" && props?.second && <MenuItem onClick={(e)=>{e.preventDefault();
              e.stopPropagation();handleCloseUserMenu(e);setOpen(true);}}>
              <Typography  onClick={handleClickOpen} textAlign="center" >{props?.second}</Typography>
            </MenuItem>}
           {props?.third==="Move" && <MenuItem onClick={(e)=>{e.preventDefault(); e.stopPropagation();
           handleCloseUserMenu;
              props?.setName(false);
              props?.setOpenmove(true);
              if (typeof props?.setTabIndex === 'function') 
              {
                props?.setTabIndex(props?.tabIndex)
              }}}>
              <Typography   textAlign="center" >{props?.third}</Typography>
            </MenuItem> }

            {props?.exportCSV==="Export CSV" && <MenuItem onClick={(e)=>{e.preventDefault();
              e.stopPropagation();handleCloseUserMenu(e); props?.exportCSVTable(props?.tableId)}}>
              <Typography  textAlign="center" >{props?.exportCSV}</Typography>
            </MenuItem>}
            {props?.shareDb && <MenuItem onClick={(e)=>{e.preventDefault();
              e.stopPropagation();handleCloseUserMenu(e); setOpenShareDb(true); }}>
              <Typography  textAlign="center" >{props?.shareDb}</Typography>
            </MenuItem>}

          <AlertPopup open={open} setOpen ={setOpen} tables={props?.tables} tableId ={props?.tableId} title={props?.title } deleteFunction={props?.deleteFunction}  />
          </Menu>
          <ShareOrgModal title={'Share Database'} useCase={'sharedb'} shareOrg={openShareDb} setShareOrg={setOpenShareDb} userType={userType} setUserType={setUserType} org={dbUsers} setOrg={setDbUsers}
           shareWorkspace={sharedatabase}
          //               removeUserFromWorkspace={}
          //               updateUserTypeInOrg = {} 
                        />
    </>
  )
}
Dropdown.propTypes = {
  first: PropTypes.string,
  second: PropTypes.string,
  third: PropTypes.string,
  shareDb:PropTypes.any,

  setName: PropTypes.func,
  title: PropTypes.string,
  tableId : PropTypes.string,
  dbid:PropTypes.any,
  deleteFunction : PropTypes.func, 
  setTabIndex:PropTypes.func,
  tabIndex:PropTypes.number,
  tables:PropTypes.any,
  setOpenmove:PropTypes.func,
  exportCSV: PropTypes.any,
  exportCSVTable: PropTypes.any
  
};