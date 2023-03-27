import React from 'react'
import PropTypes from 'prop-types';
import { Typography, Menu, MenuItem } from '@mui/material'

export default function FilterDropdown(props) {
    // const [anchorElUser, setAnchorElUser] = useState(null);

    const handleCloseFilterDropDown = (e) => {
      e.stopPropagation();
      props.setOpenFilterDropdown(false);
    };
    
  return (
    <>
        {/* <Tooltip>
            <IconButton onClick={()=>{
              props.handleClickOpen()}}>
              <MoreHorizIcon />
            </IconButton>
          </Tooltip> */}
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={props.openFilterDropdown}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={props.openFilterDropdown}
            onClose={handleCloseFilterDropDown}
          >

            <MenuItem onClick={handleCloseFilterDropDown}>
              <Typography textAlign="center">Edit</Typography>
            </MenuItem>

            <MenuItem>
              <Typography textAlign="center" >Delete</Typography>
            </MenuItem>

          </Menu>
    </>
  )
}
FilterDropdown.propTypes = {
    setOpenFilterDropdown:PropTypes.bool,
    handleClickOpen:PropTypes.func,
    openFilterDropdown:PropTypes.bool
};