
import React, { useState } from "react";
import {
  Box,
  Modal,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import './selectfilepopup.scss';
// import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { makeStyles } from "@mui/styles";
import { Select, MenuItem } from "@mui/material";
// import { updateCells } from "../store/table/tableThunk";
// import { useDispatch } from "react-redux";

const useStyles = makeStyles({
  input: {
    display: "none", // hides the default file input
  },
  label: {
    backgroundColor: "blue",
    color: "white",
    padding: "10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '25vw',
  bgcolor: "background.paper",
  columnGap: "20px",
  outline:'none'
};

export default function SelectFilePopup(props) {
  const classes = useStyles();
  // const dispatch=useDispatch();
  console.log("propsss",props);
  const [uploadOption, setUploadOption] = useState("file");
  const handleClose = () => {
    
    props.setOpen(false);
  };
  const handleFileSelection = (e) => {
    props.onChangeFile(e, "file");
    handleClose();
  };

//    const deleteImage = async(imageUrl)=>{
//     dispatch(
//       updateCells({
//          columnId: props?.attachment?.fieldId,
// rowIndex: props?.attachment?.rowAutonumber,
//         value: {delete:imageUrl},
//        dataTypes: null
//          })
//      )
//  }

  const handleSelectChange = (event) => {
    props?.setImageLink('');

    setUploadOption(event.target.value);
  };
  const isUrlSelected = uploadOption === "url";
  return (
    <Box >
      <Modal
        disableRestoreFocus
        open={props?.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="popupheader" style={{ marginBottom: "5%" }}>
            <Typography sx={{ ml: 2 }} id="title" variant="h6" component="h2">
              Attachments
            </Typography>
            <CloseIcon
              sx={{ "&:hover": { cursor: "pointer" } }}
              onClick={handleClose}
            />
          </div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >

{props?.attachment?.d?.length > 0 && (
  <div style={{ height: '32vh', overflowY: 'hidden', margin: '0.6rem' }}>
    <div
      className="carousel-container"
      style={{
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'scroll',
        scrollBehavior: 'smooth',
        paddingBottom: '50px'
      }}
    >
      {props?.attachment?.d?.map((link, index) => (
        <Box key={index} sx={{ p: 2, height: '30vh', width: 'fit-content', position: 'relative' }}>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <img
              height={'100%'}
              className={`carousel-image `}
              src={link}
              alt={`Image ${index + 1}`}
            />
            {/* <div className="transparent-blur-background " onClick={(e)=>{
              e.stopPropagation();
              e.preventDefault();
              deleteImage(link)}} >
              Delete
            <DeleteOutlinedIcon  sx={{fontSize:'15px'}} />
          </div> */}
          </a>
          
        </Box>
      ))}
    </div>
  </div>
)}

<Typography sx={{m:2}} variant="h6" component="h2" textAlign={'center'}>Upload a file</Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
              }}
            >
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

              {uploadOption === "url" && (
                <div style={{margin:'0.6rem'}}>
                  <TextField
                    margin="dense"
                    id="text-field"
                    label="Image Link"
                    type="text"
                    value={props?.imageLink}
                    onChange={(event) => {
                      props?.setImageLink(event.target.value);
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                      const text = event.clipboardData.getData("text/plain");
                      props?.setImageLink(text);

                    }}
                    sx={{width:'100%'}}
                  />
                </div>
              )}
            </div>

            <Box sx={{ display: "flex", m: 2 ,justifyContent:'space-between'}}>
              {isUrlSelected && (
                <Box>
                  <Button
                  className="mui-button"
                  variant='contained'
                    onClick={(e) => {
                      handleClose();
                      props?.onChangeUrl(e, "file");
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              )}

              {uploadOption === "file" && (
                <div style={{ display: "flex" }}>
                  <input
                    type="file"
                    id="my-file-input"
                    className={classes.input}
                    onChange={(e) => {
                      handleFileSelection(e);
                    }}
                  />
                  <label
                    htmlFor="my-file-input"
                    className={`${classes.label} mui-button`}
                    style={{ marginRight: "8px" ,borderRadius:0}}
                  >
                    Choose a file
                  </label>
                </div>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

SelectFilePopup.propTypes = {
  open: PropTypes.bool,
  attachment: PropTypes.any,
  onChangeFile:PropTypes.any,
  setOpen: PropTypes.func,
  onChangeUrl: PropTypes.func,
  imageLink: PropTypes.any,
  setImageLink: PropTypes.func,
};


