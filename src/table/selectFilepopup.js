import React, {useState} from "react";
import {Box,Modal,Button, TextField} from "@mui/material";
import PropTypes from "prop-types";
import { makeStyles } from '@mui/styles';
import { Select, MenuItem} from "@mui/material";

const useStyles = makeStyles({
  input: {
    display: 'none', // hides the default file input
  },
  label: {
    backgroundColor: 'blue',
    color: 'white',
    padding: '10px',
  
    cursor: 'pointer',
  },
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  columnGap:"20px"
};

export default function selectFilepopup(props) {
  const classes = useStyles();
  const [uploadOption,setUploadOption] = useState("file")
  const handleClose = () => { props.setOpen(false); };

  const handleFileSelection = (e) => {
    props.onChangeFile(e, "file");
    handleClose();
  }

  const handleSelectChange =(event)=>{
    setUploadOption(event.target.value)
  }
 
  const isUrlSelected = uploadOption === "url";

  return (
    <Box>
      <Modal
        disableRestoreFocus
        open={props?.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between" ,flexDirection:"column"}}>
            <div style={{ display: "flex", justifyContent: "space-between" , flexDirection:"column" }}>
          <Select
            labelId="select-label"
            id="select"
            value={uploadOption}
            onChange={handleSelectChange}
            defaultValue="longtext"
            displayEmpty
            sx={{
              margin: 1,
              minWidth: 120,
            }}
          >
            <MenuItem value="file">File</MenuItem>
            <MenuItem value="url">Url</MenuItem>
          </Select>
           

            {uploadOption == "url" &&
            <div>
              <TextField
                  margin="dense"
                  id="text-field"
                  label="Image Link"
                  type="text"
                  value={props?.imageLink}
                  onChange={(event)=>{
                    props?.setImageLink(event.target.value)
                  }}
                  onPaste={(event)=>{
                    event.preventDefault();
                    const text = event.clipboardData.getData("text/plain");
                    props?.setImageLink(text)
                  }}
                  sx={{ width: "92%", mr: 2, ml: 2 }}
          />
            </div>
            }
            </div>
          
        <Box sx={{display:'flex',mt:3}}>
          {isUrlSelected  && <Box>
            <Button style={{borderRadius:0}} onClick={(e)=>{handleClose(); props?.onChangeUrl(e,"file")}}>Submit</Button>
          </Box>}

          {uploadOption == "file" && 
           <div style={{ display:'flex'}}>
           <input
              type="file"
              id="my-file-input"
              className={classes.input}
              onChange={(e)=>{
                handleFileSelection(e)}}
            />
            <label htmlFor="my-file-input" className={classes.label}  style={{ marginRight: "8px" }} >Choose a file
            </label>
            </div>
            }

            <Box>
            <Button style={{borderRadius:0}} variant="outlined" onClick={handleClose}>cancel</Button>
            </Box>
        </Box>

          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

selectFilepopup.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  onChangeUrl:PropTypes.func,
  imageLink:PropTypes.any,
  setImageLink:PropTypes.func
};