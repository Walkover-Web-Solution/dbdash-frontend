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
// import {saveAs} from "file-saver";


export default function PreviewAttachment(props) {
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
                console.log("There is something wrong",err))
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
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            Delete
                        </Button>
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItem sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: "50px" }}>
                        <img src={props?.imageLink} alt="Image description" />
                    </ListItem>
                </List>
            </Dialog>
        </div>
    );
}

PreviewAttachment.propTypes = {
    imageLink: PropTypes.any,
    setPreviewModal: PropTypes.func
};