import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify'

export default function ShareOrgModal(props) {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const userId = localStorage.getItem("userid");
  const { users } = props.org;
  
  const handleClose = () => {
      props.setShareOrg(false);
      setEmail("");
      setUserType(""); // Reset user type state
    };
    const handleUserTypeChange = (event) => {
      setUserType(event.target.value);
    };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSendInvite = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      toast.error("Email field cannot be empty");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Invalid email");
      return;
    }

    const existingUser = users.find(user => user.user_id?.email === email);
    if (existingUser) {
      if (existingUser.user_id._id === userId) {
        toast.error("You cannot invite yourself");
      } else {
        toast.error("User already exists");
      }
      return;
    }

    props.shareWorkspace(email,userType);
    handleClose();
    toast.success("Invitation sent successfully");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendInvite();
      handleClose();
    }
  };

  const handleRemoveUser = (email) => {
    props.removeUserFromWorkspace(email);
    toast.success("User removed successfully");
  };
  return (
    <Dialog open={props.shareOrg} onClose={handleClose}>
      <DialogTitle sx={{ width: 500 }}>Add User to Organization</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
  <TextField
    autoFocus
    margin="dense"
    label="Email Address"
    type="email"
    fullWidth
    value={email}
    onChange={handleEmailChange}
    onKeyDown={handleKeyDown}
    sx={{ flex: "3", marginRight: "1rem" }} 
  />
  <FormControl sx={{ flex: "1.2", marginLeft: "1" }}> 
    <InputLabel>User Type</InputLabel>
    <Select value={userType} onChange={handleUserTypeChange}>
      <MenuItem value="user">User</MenuItem>
      <MenuItem value="admin">Admin</MenuItem>
    </Select>
  </FormControl>
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

      <Box sx={{ m: 1 }}>
        <Typography variant="h6">
          <strong>Shared with:</strong>
        </Typography>
      </Box>
      <Box>
        {users.map((user) => {
          if (
            user?.user_id?._id !== userId &&
            (user?.user_type !== "owner" || user?.user_type !== "admin" || userId !== user?.user_id?._id)
          ) {

            return (
              <Box
                key={user?.user_id?.email}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ m: 1 }}>
                  <Typography>{user?.user_id?.email}</Typography>
                </Box>
                <Box sx={{ m: 1 }}>
                  <Typography fontWeight="bold">{user?.user_type}</Typography>
                </Box>
                <Box sx={{ alignItems: "center" }}>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleRemoveUser(user?.user_id?.email)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            );
          } else {
            return null; // don't render the user if they are an admin or the current user
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
