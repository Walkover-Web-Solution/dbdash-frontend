import React,{ useState} from 'react'
import PropTypes from 'prop-types';
import { Typography, Menu, MenuItem, Tooltip} from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AlertPopup from './alertPopup';
import DuplicateDbPopup from './workspaceDatabase/duplicateDbPopup';
import CreateTemplatePopup from './workspaceDatabase/createTemplatePopup';
export default function Dropdown(props) {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [openDuplicate,setOpenDuplicate]=useState(false);
    const [openTemplate,setOpenTemplate]=useState(false);
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

           <MenuItem onClick={(e)=>{e.preventDefault();
              e.stopPropagation();handleCloseUserMenu(e); setOpenDuplicate(true);}}>
           <Typography>{props?.fourth}</Typography>
           </MenuItem>
           <MenuItem onClick={(e)=>{e.preventDefault();
              e.stopPropagation();handleCloseUserMenu(e); setOpenTemplate(true); }}>
           <Typography>{props?.fifth}</Typography>
           </MenuItem>

            {props?.exportCSV==="Export CSV" && <MenuItem onClick={(e)=>{e.preventDefault();
              e.stopPropagation();handleCloseUserMenu(e); props?.exportCSVTable(props?.tableId)}}>
              <Typography  textAlign="center" >{props?.exportCSV}</Typography>
            </MenuItem>}
<DuplicateDbPopup dbId={props?.dbid} db={props?.dbname} open={openDuplicate} setOpen={setOpenDuplicate}/>
<CreateTemplatePopup dbId={props?.dbid} db={props?.dbname} open={openTemplate} setOpen={setOpenTemplate}/>

          <AlertPopup open={open} setOpen ={setOpen} tables={props?.tables} tableId ={props?.tableId} title={props?.title } deleteFunction={props?.deleteFunction}  />
          </Menu>
         
    </>
  )
}
Dropdown.propTypes = {
  first: PropTypes.string,
  second: PropTypes.string,
  third: PropTypes.string,
  fourth: PropTypes.string,
  fifth: PropTypes.string,
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
  exportCSVTable: PropTypes.any,
  dbname:PropTypes.any
  
};