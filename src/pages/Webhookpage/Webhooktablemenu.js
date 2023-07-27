import React, { useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Popover, MenuItem, Box } from '@mui/material';
import PropTypes from 'prop-types';
import Createwebhook from './createwebhook';
import './Webhookpage.scss'
import { CustomSwitch } from '../../muiStyles/muiStyles';
function Webhooktablemenu(props) {
  const { anchorEl, closeDropdown, handleUpdateActive, handleDeleteWebhook, isActive } = props;
  const [active, setActive] = useState(isActive);
  const [addWebhook, setAddWebhook] = useState(false);

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
          <div className="webhook-table-menu-active ">
            <Box className="webhook-table-menu-active-box-1" >Active</Box>
            <Box className="webhook-table-menu-active-box-2">
              <CustomSwitch
                checked={active}
                onChange={() => { setActive(!active); handleUpdateActive() }}
              />
            </Box>
          </div>
        </MenuItem>

       
        <MenuItem onClick={handleAddWebhook} >
          <Box >Edit</Box>
        </MenuItem>
        <MenuItem className="webhook-table-menu-delete webhook-table-menu-active " onClick={() => handleDeleteWebhook()}>
          <Box className="webhook-table-menu-delete-box-1" >Delete</Box>
          <Box className="webhook-table-menu-delete-box-2" >
            <DeleteOutlineIcon />
          </Box>
        </MenuItem>
      </Popover>
      <Createwebhook
        filters={props.filters}
        newcreated={props.newcreated}
        heading={'edit webhook'}
        setNewcreated={props.setNewcreated}
        condition={props.condition}
        webhookname={props.webhookname}
        webhookid={props.webhookid}
        dataforwebhook={props?.dataforwebhook}
        setWebhooks={props?.setTabledata}
        dbId={props.dbId}
        tableId={props?.tableId}
        filterId={props.filterId}
        weburl={props.weburl}
        closeDropdown={props?.closeDropdown}
        open={addWebhook}
        setOpen={setAddWebhook}
        handleClose={handleAddWebhook}
      />
    </div>
  );
}

Webhooktablemenu.propTypes = {
  anchorEl: PropTypes.any,
  webhookname: PropTypes.any,
  weburl: PropTypes.any,
  filterId: PropTypes.any,
  filters: PropTypes.any,
  closeDropdown: PropTypes.func.isRequired,
  webhookid: PropTypes.string.isRequired,
  setNewcreated: PropTypes.any,
  dataforwebhook:PropTypes.any,
  newcreated: PropTypes.any,
  isActive: PropTypes.any,
  condition: PropTypes.string.isRequired,
  dbId: PropTypes.string.isRequired,
  tableId: PropTypes.string.isRequired,
  setTabledata: PropTypes.any,
  handleUpdateActive: PropTypes.any, handleDeleteWebhook: PropTypes.any,
  tabledata: PropTypes.any
};
export default Webhooktablemenu;
