import React, { useState } from "react";
import { Box, Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField,Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
export default function ShareOrgModal(props) {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState(111);
  const userId = localStorage.getItem("userid");
  const [editable, setEditable] = useState(null);
  const handleClose = () => {
    props.setShareOrg(false);
    setEmail("");
    setUserType(111);
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
  
    const { org, shareWorkspace } = props;
    const { users } = org;
  
    const existingUser = users.find((user) => user.user_id?.email === email);
    if (existingUser) {
      if (existingUser.user_id._id === userId) {
        toast.error("You cannot invite yourself");
      } else {
        toast.error("User already exists");
      }
      return;
    }
  
    
    shareWorkspace(email, userType);
    setEmail("");
    setUserType(111);
    toast.success("Invitation sent successfully");
  };
  

  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleSendInvite();

  };

  const handleUpdateUserType = (email, user_type) => {
    
    props.updateUserTypeInOrg(email, user_type);
  };

  const handleRemoveUser = (email) => {
    const currentUser = props?.org?.users.find(
      (user) => user.user_id?.email === email
    );

    if (currentUser && currentUser.user_type === 1) {
      toast.error("You cannot remove an owner");
      return;
    }
    let updatedOrg = {
      ...props?.org,
      users: props?.org.users.filter((user) => user.user_id.email !== email),
    };
    props.setOrg(updatedOrg);
    props.removeUserFromWorkspace(email);
    toast.success("User removed successfully");
  };

  const handleRemoveUserindb = (email, userId) => {
   
    props.removeUserFromWorkspace(email, userId);
    toast.success("User removed successfully");
  };

  return (
    <Dialog open={props.shareOrg} onClose={handleClose}>
      <ClickAwayListener
      
        onClickAway={handleClose}
      >
        <div
         
        >
          {" "}
          <DialogTitle sx={{ width: 500 }}>{props?.title}</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
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
              <Select
                value={userType}
                MenuProps={{
                  disablePortal: true,
                  onClick: (e) => {
                    e.stopPropagation(); // Stop the event from propagating to the dialog
                  },
                }}
                label="selectusertype"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // Stop the event from propagating to the dialog
                }}
             
                onChange={handleUserTypeChange}
              >
                <MenuItem value={111}>User</MenuItem>
                <MenuItem value={11}>Admin</MenuItem>
                {props?.useCase === "sharedb" && (
                  <MenuItem value={1}>Owner</MenuItem>
                )}
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
          {props?.org?.users?.length > 1 && (
            <Box sx={{ m: 1 }}>
              <Typography variant="h6">
                <strong>Shared with:</strong>
              </Typography>
            </Box>
          )}
          <Box
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {props?.org?.users?.map((user,index) => {
                if ( user?.user_id?._id !== userId ) {
                  return (
                    <Box
                      key={user?.user_id?.email}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingBottom: index === props?.org?.users?.length - 1 ? 2 : undefined
                      }}
                      
                    >
                      <Box sx={{ m: 1 }}>
                        <Typography>{user?.user_id?.email}</Typography>
                      </Box>
                      <Box sx={{ m: 1 }}>
                        {props?.useCase === "sharedb" ? (
                          editable === user ? (
                            <Select
                              sx={{ height: "30px" }}
                              value={user?.user_type}
                              MenuProps={{
                                disablePortal: true,
                                onClick: (e) => {
                                  e.stopPropagation(); // Stop the event from propagating to the dialog
                                },
                              }}
                           
                              onChange={(e) => {
                                setEditable(null);
                                handleUpdateUserType(
                                  user?.user_id?.email,
                                  e.target.value
                                );
                              }}
                            >
                              <MenuItem value={111}>User</MenuItem>
                              <MenuItem value={11}>Admin</MenuItem>
                              <MenuItem value={1}>Owner</MenuItem>
                            </Select>
                          ) : (
                            <Typography>
                              {user?.user_type === 111
                                ? "User"
                                : user?.user_type === 11
                                ? "Admin"
                                : "Owner"}
                            </Typography>
                          )
                        ) : editable === user ? (
                          <Select
                            sx={{ height: "30px" }}
                            value={user?.user_type}
                            MenuProps={{
                              disablePortal: true,
                              onClick: (e) => {
                                e.stopPropagation(); // Stop the event from propagating to the dialog
                              },
                            }}
                         
                            onChange={(e) => {
                              setEditable(null);
                              handleUpdateUserType(
                                user?.user_id?.email,
                                e.target.value
                              );
                            }}
                          >
                            <MenuItem value={111}>User</MenuItem>
                            <MenuItem value={11}>Admin</MenuItem>
                          </Select>
                        ) : (
                          <Typography>
                            {user?.user_type === 111 ? "User" : "Admin"}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ m: 1 }}>
                        <ModeEditIcon
                          onClick={() => {
                            if (editable != user) {
                              setEditable(user);
                            } else setEditable(null);
                          }}
                        />
                      </Box>
                      <Box sx={{ alignItems: "center" }}>
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            if (props?.useCase === "sharedb") {
                              handleRemoveUserindb(
                                user?.user_id?.email,
                                user?.user_id?._id
                              );
                            } else handleRemoveUser(user?.user_id?.email);
                          }}
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
        </div>
      </ClickAwayListener>
    </Dialog>
  );
}

ShareOrgModal.propTypes = {
  shareOrg: PropTypes.bool,
  setShareOrg: PropTypes.func,
  shareWorkspace: PropTypes.func,
  title: PropTypes.any,
  setOrg: PropTypes.any,
  org: PropTypes.any,
  useCase: PropTypes.any,
  removeUserFromWorkspace: PropTypes.func,
  updateUserTypeInOrg: PropTypes.func,
};
