import React from "react";
import {Button,Dialog,DialogTitle,DialogContent,Switch,FormGroup,FormControlLabel,} from "@mui/material";
import PropTypes from "prop-types";

export default function DuplicateFieldPopup(props) {
  return (
    <Dialog open={props?.open} onClose={props?.handleClose}>
      <DialogTitle>Duplicate Field</DialogTitle>
      <DialogContent>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={props?.duplicateField}
                onChange={props?.handleUniqueChange}
              />
            }
            label="Duplicate Cells"
          />
        </FormGroup>
      </DialogContent>
      <Button onClick={props?.handleClose}>Cancel</Button>
      <Button onClick={props?.handleDuplicate}>Duplicate Field</Button>
    </Dialog>
  );
}

DuplicateFieldPopup.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleDuplicate: PropTypes.func,
  isUnique: PropTypes.bool,
  handleUniqueChange: PropTypes.func,
  duplicateField: PropTypes.any
};
