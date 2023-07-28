import React, {memo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { restoreDb } from '../../../api/dbSnapshotsApi';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { createDbThunk } from '../../../store/database/databaseThunk';
import { Box, Button, ClickAwayListener, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import './dbSnapshotsMenu.scss';
import CustomTextField from '../../../muiStyles/customTextfield';

function DbSnapshotsMenu(props) {
  const params = useParams();
  const dispatch = useDispatch();

  const items = props.dbSnapshots ? Object.entries(props.dbSnapshots) : [];
  const [inside, setInside] = useState(null);
  const [value, setValue] = useState('');

  const calculatePosition = () => {
    const { scrollX, scrollY } = window;
    const { innerWidth, innerHeight } = window;
    let top = props.revisionbuttonref.top + props.revisionbuttonref.height + scrollY;
    let left = props.revisionbuttonref.left + scrollX;
    const popupHeight = 300;
    const popupWidth = 300;
    if (top + popupHeight > innerHeight) {
      top = props.revisionbuttonref.top - popupHeight + scrollY;
    }
    if (left + popupWidth > innerWidth) {
      left = props.revisionbuttonref.right - popupWidth + scrollX;
    }
    return { top, left };
  };

  const style = {
    ...calculatePosition(),
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  const restoreDbSnapshot = async (backup_id, dbname) => {
    const data = {
      name: dbname,
    };
    try {
      const response = await restoreDb(params.dbId, backup_id, data);
      if (response.status === 201) {
        toast.success('DB restored successfully.');
      }
      dispatch(createDbThunk({
        data: response?.data?.data,
      }));
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error('Failed to restore DB.');
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box sx={style} className="dbsnapshot-style">
        <div className="popupheader dbsnapshot-header">
          <Typography className="dbsnapshots-revision" id="title" variant="h6" component="h2">
            db snapshots
          </Typography>
          <div>
            {inside && <KeyboardBackspaceIcon className="dbsnapshot-spaceIcon" onClick={() => setInside(null)} />}
            <CloseIcon className="dbsnapshot-spaceIcon" onClick={handleClose} />
          </div>
        </div>
        {!inside ? (
          <Box className="snapshot-setInside">
            {items.length > 0
              ? items.map((item) => (
                  <Button
                    onClick={() => {
                      setInside(item);
                    }}
                    key={item[0]}
                    className="mui-button-outlined snapshot-button"
                  >
                    {new Date(item[1]?.snapshotTime * 1000)?.toLocaleString()}
                  </Button>
                ))
              : <Typography className="snapshot-notcreated">Snapshot not created yet.</Typography>}
          </Box>
        ) : (
          <Box className="snapshot-box">
            <Typography fontWeight="bold">{new Date(inside?.[1]?.snapshotTime * 1000).toLocaleString()}</Typography>
            <CustomTextField value={value || `${props.dbname}(${new Date(inside?.[1]?.snapshotTime * 1000).toLocaleDateString()})`} onChange={(e) => { setValue(e.target.value); }} />
            <div className="snapshot-div">
              <Button variant="contained" className="mui-button snapshot-button2" onClick={() => { restoreDbSnapshot(inside?.[0], value || `${props.dbname}(${new Date(inside?.[1]?.snapshotTime * 1000).toLocaleDateString()})`); }}>Restore</Button>
            </div>
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
}

DbSnapshotsMenu.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  revisionbuttonref: PropTypes.any,
  dbname: PropTypes.any,
  dbSnapshots: PropTypes.any,
};

export default memo(DbSnapshotsMenu);
