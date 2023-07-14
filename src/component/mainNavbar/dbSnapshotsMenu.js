import React from 'react'
import { useParams } from 'react-router-dom'
import { restoreDb } from '../../api/dbSnapshotsApi'
import { useEffect } from 'react';
import PropTypes from "prop-types";
import CloseIcon from '@mui/icons-material/Close';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import { Box, Button, ClickAwayListener, TextField, Typography } from '@mui/material';
import variables from '../../assets/styling.scss';
import { useState } from 'react';

function DbSnapshotsMenu(props) {
  const params = useParams();
  const items= Object.entries(props?.revision_history) || [];//?should change variable name 
  const [inside, setInside] = useState(null);//?should change variable name 
  useEffect(async () => {
    if (!params?.dbId) return;
    // const data = await getAllRevision(params?.dbId);
    // setItems(Object.entries(data.data.data));

  }, [params?.dbId])

  const calculatePosition = () => {
    const { scrollX, scrollY } = window;
    const { innerWidth, innerHeight } = window;
    // Calculate the initial position below the button
    let top = props?.revisionbuttonref.top + props?.revisionbuttonref.height + scrollY;
    let left = props?.revisionbuttonref.left + scrollX;
    // Check if there is enough space below the button
    const popupHeight = 300; // Assuming the popup height is 300px
    const popupWidth = 300; // Assuming the popup width is 300px
    if (top + popupHeight > innerHeight) {
      // Not enough space below, position above the button instead
      top = props?.revisionbuttonref.top - popupHeight + scrollY;
    }
    // Check if there is enough space on the right
    if (left + popupWidth > innerWidth) {
      // Not enough space on the right, align with the right edge of the button
      left = props?.revisionbuttonref.right - popupWidth + scrollX;
    }
    return { top, left };
  };
  const style = {
    position: "absolute",
    ...calculatePosition(),
    transform: "translate(-20%, -42%)",
    backgroundColor: "#fff",
    zIndex: 110,
    borderRadius: "0px",
    // boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
    border: `1px solid ${variables.basictextcolor}`,
    width: "300px",
  };
  const handleClose = () => {
    props.setOpen(false);
  };
  const handleClickAway = () => {
    handleClose();
  }; //?remove this function if not needed

  const restoredb = (backup_id, dbname) => {
    const data = {
      dbName: dbname
    }
    restoreDb(params.dbId, backup_id, data);//we may need to implement reducer
    handleClose();
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={style}>
        <div className="popupheader" style={{ marginBottom: '5%' }}>    <Typography sx={{ ml: 2 }} id="title" variant="h6" component="h2">
          revision history
        </Typography>
          <div>
            {inside && <KeyboardBackspaceIcon sx={{ '&:hover': { cursor: 'pointer' } }} onClick={() => setInside(null)} />}<CloseIcon sx={{ '&:hover': { cursor: 'pointer' } }} onClick={handleClose} />
          </div></div>
        {!inside ?
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '30vh' }}>
            {items.length > 0 ? items.map((item) => {
              return (
                <Button sx={{ height: '10%', width: '100%', my: '3%', textAlign: "center" }}
                  onClick={() => {
                    setInside(item);
                  }}
                  key={item[0]} className="mui-button-outlined">
                  {new Date(item[1].revisionTime * 1000).toLocaleString()}
                </Button>
              );
            }) : <Typography textAlign={'center'} sx={{ pt: "10vh" }}>History not created yet.</Typography>}
          </Box> : <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 2, height: '30vh' }}>
            <Typography fontWeight={variables.mainnavbarfontweight}>{new Date(inside[1].revisionTime * 1000).toLocaleString()}
            </Typography>
            <TextField defaultValue={`${props?.dbname}(${new Date(inside[1].revisionTime * 1000).toLocaleDateString()})`} />
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Button variant='contained' sx={{ m: 2 }} className="mui-button" onClick={(e) => { restoredb(inside[0], e.target.value) }}>Restore</Button></div>
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
  revision_history:PropTypes.any
}