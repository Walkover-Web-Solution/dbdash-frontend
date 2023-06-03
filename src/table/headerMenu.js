import React from 'react'
import { useLayer } from "react-laag";
import PropTypes from "prop-types";
import { makeStyles } from '@mui/styles';
import QueueOutlinedIcon from '@mui/icons-material/QueueOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
const useStyles = makeStyles(() => ({
  simpleMenu: {
    width: '175px',
    padding: '8px 0',
    borderRadius: '6px',
    boxShadow: '0px 0px 1px rgba(62, 65, 86, 0.7), 0px 6px 12px rgba(62, 65, 86, 0.35)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
  },
  danger: {
    color: 'rgba(255, 40, 40, 0.8)',
    '&:hover': {
      color: 'rgba(255, 40, 40, 1)',
    },
  },
  menuItem: {
    padding: '6px 8px',
    color: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      color: 'rgba(0, 0, 0, 0.9)',
    },
    transition: 'background-color 100ms',
    cursor: 'pointer',
  },
}));
export default function Headermenu(props) {
const classes = useStyles();
const isOpen = props?.menu !== undefined;

const { layerProps, renderLayer } = useLayer({
  isOpen,
  auto: true,
  placement: "bottom-end",
  triggerOffset: 2,
  onOutsideClick: () => props?.setMenu(undefined),
  trigger: {
    getBounds: () => ({
      left: props?.menu ? props?.menu.bounds?.x : 0,
      top: props?.menu ? props?.menu.bounds?.y : 0,
      width: props?.menu ? props?.menu.bounds?.width : 0,
      height: props?.menu ? props?.menu.bounds?.height : 0,
      right: (props?.menu ? props?.menu.bounds?.x : 0) + (props?.menu ? props?.menu.bounds?.width : 0),
      bottom: (props?.menu ? props?.menu.bounds?.y : 0) + (props?.menu ? props?.menu.bounds?.height : 0),
    }),
  },
});
  return (
<>
{isOpen &&
   renderLayer(
    <div className={classes.simpleMenu} {...layerProps}>
      {/* <div>Property type</div> */}
      <div className={`${classes.menuItem} ${classes.danger}`}>Property type</div>
      <div className={classes.menuItem}><VisibilityOffIcon fontSize='2px'/>Hide Field</div>
      <div onClick={() => {props?.setOpen(true)}} className={classes.menuItem}><WestIcon fontSize='2px'/>Insert Left</div>
      <div onClick={() => {props?.setOpen(true)}} className={classes.menuItem}><EastIcon fontSize='2px'/>Insert Right</div>
      <div className={classes.menuItem}><NorthIcon fontSize='2px'/>Sort ascending</div>
      <div className={classes.menuItem}><SouthIcon fontSize='2px'/>Sort descending</div>
      <div  className={classes.menuItem}> <QueueOutlinedIcon fontSize='2px'/>Duplicate cell</div>
      <div className={classes.menuItem}><DeleteOutlineIcon fontSize='2.5px'/>Delete</div>
    </div>
    )}
   </>
 );
}

Headermenu.propTypes = {
 menu: PropTypes.any,
 setMenu: PropTypes.any,
 setOpen: PropTypes.any,
};
