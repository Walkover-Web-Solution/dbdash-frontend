import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
export default function ShareOrgModal(props) {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("user");
  const userId = localStorage.getItem("userid");
  const [editable,setEditable]=useState(null);
  const handleClose = () => {
      props.setShareOrg(false);
      setEmail("");
      setUserType("user"); 
    };
    const handleUserTypeChange = (event) => {
      setUserType(event.target.value);
    };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSendInvite = () => {
    console.log("hello");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      toast.error("Email field cannot be empty");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Invalid email");
      return;
    }

    if(Array.isArray( props?.org?.users))
    {
    const existingUser = props?.org?.users?.find(user => user.user_id?.email === email);
    if (existingUser) {
      if (existingUser.user_id._id === userId) {
        toast.error("You cannot invite yourself");
      } else {
        toast.error("User already exists");
      }
      return;
    }
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

  const handleUpdateUserType = (email,user_type)=>{
     props.updateUserTypeInOrg(email,user_type);
  }

  const handleRemoveUser = (email) => {
    const currentUser = props?.org?.users.find((user) => user.user_id?.email === email);

    if (currentUser && currentUser.user_type === "1") {
      toast.error("You cannot remove an owner");
      return;
    }

    props.removeUserFromWorkspace(email);
    toast.success("User removed successfully");
  };
   

  return (
    <Dialog open={props.shareOrg} onClick={(e)=>{e.preventDefault();e.stopPropagation()}}>
      <DialogTitle sx={{ width: 500 }}>{props?.title}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
  <TextField
    autoFocus
    margin="dense"
    placeholder="Email Address"
    type="email"
    fullWidth
    value={email}
    onChange={handleEmailChange}
    onKeyDown={handleKeyDown}
    
    sx={{ flex: "3", marginRight: "1rem" }} 
  />
  <FormControl sx={{ flex: "1.2", marginLeft: "1" }}> 
    <InputLabel>User Type</InputLabel>
    <Select value={userType} label={'selectusertype'} onChange={handleUserTypeChange}>
      <MenuItem value="user">User</MenuItem>
      <MenuItem value="admin">Admin</MenuItem>
      {props?.useCase=='sharedb' &&<MenuItem value='owner'>Owner</MenuItem>}
    </Select>
  </FormControl>
</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          className="mui-button"
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
        {Array.isArray(props?.org?.users) && props?.org?.users?.map((user) => {
          
          if (
            user?.user_id?._id !== userId &&
            (user?.user_type !== "1" || user?.user_type !== "11" || userId !== user?.user_id?._id)
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

     {editable==user ? <Select sx={{height:'30px'}} value={user?.user_type} onChange={(e)=>{handleUpdateUserType(user?.user_id?.email,e.target.value)}}>
        <MenuItem value="user">User</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
        {props?.useCase=='sharedb' &&<MenuItem value='owner'>Owner</MenuItem>}
      </Select>:<Typography>{user?.user_type}</Typography>}
    </Box>
    <Box sx={{ m: 1 }}>
     <ModeEditIcon onClick={()=>{
      if(editable!=user)
      {
        setEditable(user);
      }
      else setEditable(null)}}/>
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
  title:PropTypes.any,
  // org: PropTypes.shape({
  //   props?.org?.users: PropTypes.any
  // }),
  org:PropTypes.any,
  useCase:PropTypes.any,
  removeUserFromWorkspace: PropTypes.func,
  updateUserTypeInOrg:PropTypes.func
};
