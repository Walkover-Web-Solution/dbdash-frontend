import React,{useState} from 'react'
import PropTypes from 'prop-types';
import { Typography, Menu, MenuItem, Tooltip, IconButton } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AlertPopup from './alertPopup';
// import SelectFilepopup from '../table/selectFilepopup';


export default function Dropdown(props) {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [open, setOpen] = useState(false);

    // const [csvfile,setCsvFile] = useState(null)
    //  const [, setDataType] = useState("")
    // const [uploadCsvClicked, setUploadCsvClicked] = useState(false);
    // console.log("csv",csvfile);
    
    // console.log("setcsv",setCsvFile);

    // const onChangeFiles = (e, type) => {
    //   console.log("in onchange file")
    //   setDataType(type)
    //   console.log(e.target.files[0])
    // if (e.target.files[0] != null) {
    //   setCsvFile(e.target.files[0])
    //   }
    //   e.target.value = null;
    // };

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
              e.stopPropagation(); props?.setName (true);
              if (typeof props?.setTabIndex === 'function') 
              {
                props?.setTabIndex(props?.tabIndex)
              }
              }}>{props?.first}</Typography>
            </MenuItem>
            <MenuItem onClick={(e)=>{e.preventDefault();
              e.stopPropagation();handleCloseUserMenu(e);setOpen(true);}}>
              <Typography  onClick={handleClickOpen} textAlign="center" >{props?.second}</Typography>
            </MenuItem>
            
            {/* <MenuItem  onClick={(e)=>{e.preventDefault();
              e.stopPropagation();handleCloseUserMenu(e); setUploadCsvClicked(true); }}>
             <Typography>{props.third}</Typography>
            </MenuItem>
             { <SelectFilepopup title="uplaodfile"
                  label="UploadFileIcon" open={uploadCsvClicked} setOpen={setUploadCsvClicked} onChangeFile={onChangeFiles} />} */}
          
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
  tables:PropTypes.any
};