import React, { SyntheticEvent } from 'react';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import "./alerPopup.scss";

interface AlertPopupProps {
  setOpen: (open: boolean) => void;
  open: boolean;
  title: string;
  tableId: string;
  deleteFunction: (tableId: string) => void;
  tables: any; 
}

export default function AlertPopup(props: AlertPopupProps) {
  console.log("propsss",props);
  const handleClose = (e: SyntheticEvent) => {
    e.stopPropagation();
    props.setOpen(false);
  };

  return (
    <>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="popupheader alert-popup-head">
          <Typography className="alerttext" id="title" variant="h6" component="h2">
            {props.title}
          </Typography>
          <CloseIcon
            onClick={(e: SyntheticEvent) => { handleClose(e); e.preventDefault(); e.stopPropagation(); }}
            className="aler-close-icon"
          />
        </div>
        <DialogContent className='dialogContent'>
          <div>
            Are you sure you want to delete the {props.title}?
          </div>
        </DialogContent>
        <Box className='alert-filter-actions'>
          <Button
            className="mui-button"
            onClick={(e: SyntheticEvent) => { e.preventDefault(); e.stopPropagation(); props.deleteFunction(props.tableId); handleClose(e); }}
          >
            Delete
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
