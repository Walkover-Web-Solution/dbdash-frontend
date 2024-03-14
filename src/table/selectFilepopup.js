
import React, { useState } from "react";
import {
  Box,
  Modal,
  Button,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import './selectfilepopup.scss';
import { Select, MenuItem } from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateCells } from "../store/table/tableThunk";
import { selectFilePopupStyles } from "../muiStyles/muiStyles";
import CustomTextField from "../muiStyles/customTextfield";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


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
  const params=useParams(),dispatch=useDispatch();
  const [imageLink, setImageLink] = useState("");

  const uploadImage = (source, e, type) => {
    if (params?.templateId) return;
    const row = props?.attachment?.cell[1];
    let imageValue = null;
    if (source === "file") {
      if (e.target.files[0] != null) {
        imageValue = e.target.files[0];
      }
    } 
  
    if (imageValue !== null || imageLink !== null) {
      dispatch(
        updateCells({
          columnId: props?.attachment?.fieldId,
          rowIndex: props?.attachment?.rowAutonumber,
          value: imageLink?null:imageValue,
          imageLink: imageLink,
          dataTypes: type,
          indexIdMapping: {
            [props.attachment.rowAutonumber]: row,
          },
        })
      ).then(() => {
        toast.success("Image uploaded successfully!");
      });
    }
  
    // Reset the input field after uploading
    if (source === "file") {
      e.target.value = null;
    } else if (source === "url") {
      const imageUrlInput = document.getElementById("imageUrlInput");
      if (imageUrlInput) {
        imageUrlInput.value = null;
      }
    }
  };
  
  const classes = selectFilePopupStyles();
  // const dispatch=useDispatch();
  const [uploadOption, setUploadOption] = useState("file");
  const handleClose = () => {
    
    props.setOpen(false);
  };
  const handleFileSelection = (e) => {
    uploadImage('file',e, "file");
    handleClose();
  };

   const deleteImage = async(imageUrl)=>{
    dispatch(
      updateCells({
        columnId: props?.attachment?.fieldId,
        rowIndex: props?.attachment?.rowAutonumber,
        value: {delete:[imageUrl]},
        dataTypes: null,
        indexIdMapping: {
        [props.attachment.rowAutonumber]: props?.attachment?.cell[1],       
        },
      })
    )
    props?.setOpen(state => {
      return {
        ...state, 
        d : state.d.filter(image => image !== imageUrl)
      };
    })
 }

  const handleSelectChange = (event) => {
    setImageLink('');

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
  <div style={{ height: '40vh', overflowY: 'hidden', margin: '0.6rem' }}>
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
        <Box key={index} sx={{ p: 2, height: '38vh', width: 'fit-content', position: 'relative' }}>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <img
              height={'100%'}
              className={`carousel-image `}
              src={link}
              alt={`Image ${index + 1}`}
            />
            <div className="transparent-blur-background" onClick={(e)=>{
              e.stopPropagation();
              e.preventDefault();
              deleteImage(link)}} >
              delete
            <DeleteOutlineIcon  sx={{fontSize:'18px'}} />
          </div>
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
                  <CustomTextField
                    margin="dense"
                    id="text-field"
                    label="Image Link"
                    type="text"
                    value={imageLink}
                    onChange={(event) => {
                      setImageLink(event.target.value);
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                      const text = event.clipboardData.getData("text/plain");
                      setImageLink(text);

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
                      uploadImage('url',e, "file");

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


