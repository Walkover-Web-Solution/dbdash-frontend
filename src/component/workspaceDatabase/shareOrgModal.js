import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify'



export default function ShareOrgModal(props) {
  const [email, setEmail] = useState("");
  const userId = localStorage.getItem("userid")
  
  const handleClose = () => {
    props.setShareOrg(false);
    setEmail("");
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSendInvite = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email");
      return;
    }
  
    props.shareWorkspace(email);
    handleClose();
    toast.success("Invitation sent successfully");
  };
  

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendInvite();
      handleClose();
    }
  };

  const handleRemoveUser = (email) => {
    props.removeUserFromWorkspace(email);
    toast.success("User removed successfully");
  };

  return (
    
      <Dialog open={props.shareOrg} onClose={handleClose} >
        <DialogTitle sx={{width:500}}>Add User to Organization</DialogTitle>
        <DialogContent sx={{flex:'none'}}>
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

    <Box sx={{m:1}}>
         <Typography variant="h6"><strong>Shared with:</strong></Typography>
    </Box>
    <Box >
    {Object.values(props.org.users).map((user) => {
  if (user.user_id._id !== userId || user.user_type !== "admin") {
    return (
      <Box key={user.user_id.email} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <Box sx={{ m: 1 }}>
          <Typography>{user.user_id.email}</Typography>
        </Box>
        <Box sx={{ alignItems: "center" }}>
          <IconButton aria-label="delete" onClick={() => handleRemoveUser(user.user_id.email)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    );
  } else {
    return null; // don't render the user if they are an admin
  }
})}
        </Box>
      </Dialog>
  );
}

ShareOrgModal.propTypes = {
  shareOrg: PropTypes.bool,
  setShareOrg: PropTypes.func,
  shareWorkspace: PropTypes.func,
  org: PropTypes.shape({
    users: PropTypes.array
  }),
  removeUserFromWorkspace: PropTypes.func
};
