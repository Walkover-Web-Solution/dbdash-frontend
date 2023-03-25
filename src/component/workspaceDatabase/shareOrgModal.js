import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';


export default function ShareOrgModal(props) {
  const [email, setEmail] = useState("");

  const handleClose = () => {
    props.setShareOrg(false);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSendInvite = () => {
    props.shareWorkspace(email);
    handleClose();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendInvite();
      handleClose();
    }
  };

  const handleRemoveUser = (email) => {
    props.removeUserFromWorkspace(email);
  };

  return (
    <div>
      <Dialog open={props.shareOrg} onClose={handleClose}>
        <DialogTitle>Add User to Organization</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={handleEmailChange}
            onKeyDown={handleKeyDown}

          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendInvite}
          >
            Send Invite
          </Button>
          
        </DialogActions>
         <Typography variant="h6">Shared with:</Typography>
        {Object.values(props.org.users).map((user) => (
          <div key={user.user_id.email}>
            <Typography>{user.user_id.email}</Typography>
            <IconButton
              aria-label="delete"
              onClick={() => handleRemoveUser(user.user_id.email)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </Dialog>
    </div>
  );
}

ShareOrgModal.propTypes = {
  shareOrg: PropTypes.bool,
  setShareOrg: PropTypes.func,
  shareWorkspace: PropTypes.func,
  org: PropTypes.shape({
    users: PropTypes.object
  }),
  removeUserFromWorkspace: PropTypes.func
};
