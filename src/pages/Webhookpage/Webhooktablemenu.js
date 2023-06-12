import React ,{useState} from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Popover, MenuItem, Box,Switch } from '@mui/material';
import { withStyles } from '@mui/styles';

import PropTypes from 'prop-types';
import Createwebhook from './createwebhook';
function Webhooktablemenu(props) {
  

  const { anchorEl, closeDropdown, handleUpdateActive,handleDeleteWebhook,isActive } = props;
const[active,setActive]=useState(isActive);
  const styles = {
    root: {
      width: 40,
      height: 20,
      padding: 0,
      display: 'flex',
      backgroundColor: 'transparent', // Added transparent background
    },
    switchBase: {
      padding: 2,
      '&$checked': {
        transform: 'translateX(20px)',
        color: '#fff',
        '& + $track': {
          opacity: 0.7,
          backgroundColor: '006400',
        },
      },
    },
    thumb: {
      width: 16,
      height: 16,
      boxShadow: 'none',
    },
    track: {
      width: '100%',
      height: 17,
      borderRadius: 10,
      borderColor: 'black',
      opacity: 0.7,
      backgroundColor: '#000',
    },
    checked: {},
  };
  
  // Create a custom Switch component with the applied styles
  const CustomSwitch = withStyles(styles)(Switch);
  const[addWebhook,setAddWebhook]=useState(false);
  const[newcreated,setNewcreated]=useState(0);


  
  const handleAddWebhook = () => {
    setAddWebhook(!addWebhook);
  };


  return (
    <div>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closeDropdown}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ mr: 2 }}>Active</Box>
            <Box sx={{ ml: 2 }}>
              <CustomSwitch
                checked={active}
                onChange={() => {setActive(!active);handleUpdateActive()}}
              />
            </Box>
          </div>
        </MenuItem>

        <MenuItem onClick={() => handleDeleteWebhook()}>
          <Box sx={{ mr: 2 }}>Delete</Box>
          <Box sx={{ ml: 2 }}>
            <DeleteOutlineIcon />
          </Box>
        </MenuItem>
        <MenuItem onClick={handleAddWebhook} >
        <Box >Edit</Box>
        
        <Createwebhook
          newcreated={newcreated}
          setNewcreated={setNewcreated}
          condition={props.condition}
          webhookname={props.webhookname}
          webhookid={props.webhookid}
          dbId={props.dbId}
          tableId={props?.tableId}
          filterId={props.filterId}
          weburl={props.weburl}
          // tableId={props.table}
  // filters={props?.dataforwebhook[props?.table]?.filters}
  open={addWebhook}
  setOpen={setAddWebhook}
  handleClose={handleAddWebhook}
/>

        </MenuItem>
      </Popover>
    </div>
  );
}

Webhooktablemenu.propTypes = {
    anchorEl: PropTypes.any,
    // webhookid:PropTypes.any,
    // condition:PropTypes.any,
    
    webhookname:PropTypes.any,
    weburl:PropTypes.any,
    filterId:PropTypes.any,

    closeDropdown: PropTypes.func.isRequired,
    webhookid: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    condition: PropTypes.string.isRequired,
    dbId: PropTypes.string.isRequired,
    tableId: PropTypes.string.isRequired,
    setTabledata: PropTypes.func.isRequired,
    handleUpdateActive:PropTypes.any,handleDeleteWebhook:PropTypes.any,
  };
export default Webhooktablemenu;
