import React from 'react'
import { useParams } from 'react-router-dom'
import { restoreDb } from '../../api/dbSnapshotsApi'
import PropTypes from "prop-types";
import CloseIcon from '@mui/icons-material/Close';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { createDbThunk } from '../../store/database/databaseThunk';

import { Box, Button, ClickAwayListener, TextField, Typography } from '@mui/material';
import variables from '../../assets/styling.scss';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

function DbSnapshotsMenu(props) {
  const params = useParams();
  const dispatch=useDispatch();
  
  const items= props?.dbSnapshots ? Object?.entries(props?.dbSnapshots) : [];//?should change variable name 
  const [inside, setInside] = useState(null);//?should change variable name 
  const [value,setValue]=useState('');
  

  const calculatePosition = () => {
    const { scrollX, scrollY } = window;
    const { innerWidth, innerHeight } = window;
    let top = props?.revisionbuttonref.top + props?.revisionbuttonref.height + scrollY;
    let left = props?.revisionbuttonref.left + scrollX;
    const popupHeight = 300;
    const popupWidth = 300;
    if (top + popupHeight > innerHeight) {
      top = props?.revisionbuttonref.top - popupHeight + scrollY;
    }
    if (left + popupWidth > innerWidth) {
      left = props?.revisionbuttonref.right - popupWidth + scrollX;
    }
    return { top, left };
  };
  const style = {
    position: "absolute",
    ...calculatePosition(),
    transform: "translate(-2vw, -9.5vh)", backgroundColor: variables.bgcolorvalue,
    zIndex: 110,
    borderRadius: "0px",
    border: `1px solid ${variables.basictextcolor}`,
    width: "300px",
  };
  const handleClose = () => {
    props.setOpen(false);
  };
  
  const restoredb = async(backup_id, dbname) => {
    const data = {
      name: dbname
    }
    const response=await restoreDb(params.dbId, backup_id, data)
    if(response.status==201)
    {
      toast.success('DB restored Successfully.');
    }
    dispatch(createDbThunk({
      data: response?.data?.data
    }));
    handleClose();
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box sx={style}>
        <div className="popupheader" style={{ marginBottom: '5%' }}>    <Typography sx={{ ml: 2 }} id="title" variant="h6" component="h2">
          revision history
        </Typography>
          <div>
            {inside && <KeyboardBackspaceIcon sx={{ '&:hover': { cursor: 'pointer' } }} onClick={() => setInside(null)} />}<CloseIcon sx={{ '&:hover': { cursor: 'pointer' } }} onClick={handleClose} />
          </div></div>
        {!inside ?
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '27vh' }}>
            {props?.dbSnapshots && items?.length > 0 ? items?.map((item) => {
              return (
                <Button sx={{ height: '10%', width: '100%', my: '3%', textAlign: "center" }}
                  onClick={() => {
                    setInside(item);
                  }}
                  key={item[0]} className="mui-button-outlined">
                  {new Date(item[1]?.snapshotTime * 1000)?.toLocaleString()}
                </Button>
              );
            }) : <Typography textAlign={'center'} sx={{ pt: "8vh" }}>Snapshot not created yet.</Typography>}
          </Box> : <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 2, height: '27vh' }}>
            <Typography fontWeight={variables.mainnavbarfontweight}>{new Date(inside?.[1]?.snapshotTime * 1000).toLocaleString()}
            </Typography>
            <TextField value={value || `${props?.dbname}(${new Date(inside?.[1]?.snapshotTime * 1000).toLocaleDateString()})`} onChange={(e)=>{setValue(e.target.value)}} />
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Button variant='contained' sx={{ m: 2 }} className="mui-button" onClick={() => { restoredb(inside?.[0],value || `${props?.dbname}(${new Date(inside?.[1]?.snapshotTime * 1000).toLocaleDateString()})`) }}>Restore</Button></div>
          </Box>}


      </Box>
    </ClickAwayListener>

  )
}

export default DbSnapshotsMenu

DbSnapshotsMenu.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  revisionbuttonref: PropTypes.any,
  dbname: PropTypes.any,
  dbSnapshots:PropTypes.any
}