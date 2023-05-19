import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from "prop-types";
import { updateCells } from '../store/table/tableThunk';
import { useDispatch } from 'react-redux';
// import { updateRow } from '../api/rowApi';
// import {saveAs} from "file-saver";


export default function PreviewAttachment(props) {
    const dispatch = useDispatch();
    const deleteImage = async(imageUrl)=>{
        dispatch(
            updateCells({
              columnId: props?.columnId,
              rowIndex: props?.row.original.id ||props?.row.original?.["fld"+props?.tableId.substring(3)+"autonumber"],
              value: {delete:imageUrl},
              dataTypes: null
            })
        )
        // const data = await updateRow(dbId, tableId, payload.rowIndex, { [columnId]: value })
    }

    const downloadImage = (fileLink) => {
        fetch(fileLink)
            .then((r) => r.blob())
            .then((blob) => {
                const element = document.createElement('a');
                document.body.appendChild(element);
                element.setAttribute('href', window.URL.createObjectURL(blob));
                element.setAttribute('download', "chanchal.png");
                element.style.display = '';

                element.click();

                document.body.removeChild(element);
            })
            .catch((err) =>
                console.log("There is something wrong", err))
    };


    const handleClose = () => {
        props?.setPreviewModal(false);
    };

    return (
        <div>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        {/* <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Sound
            </Typography> */}
                        <Button autoFocus color="inherit" onClick={() => {
                            downloadImage(props?.imageLink);
                        }}>
                            Download
                        </Button>
                        <Button autoFocus color="inherit" onClick={()=>{
                            deleteImage(props?.imageLink);
                            handleClose()
                        }}>
                            Delete
                        </Button>
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItem sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: "50px" }}>
                        <img src={props?.imageLink} alt="Image description" width="700" height="600" />
                    </ListItem>
                </List>
            </Dialog>
        </div>
    );
}

PreviewAttachment.propTypes = {
    imageLink: PropTypes.any,
    setPreviewModal: PropTypes.func,
    rowId:PropTypes.any,
    columnId:PropTypes.any,
    id:PropTypes.any,
    tableId:PropTypes.any,
    row:PropTypes.any

};