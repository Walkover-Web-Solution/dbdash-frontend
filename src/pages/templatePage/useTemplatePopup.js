import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogContent,
    Box,
    DialogContentText,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
    import {makeStyles} from '@mui/styles';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';

import { useTemplate } from '../../api/templateApi';
import { useDispatch, useSelector } from 'react-redux';
import { allOrg } from '../../store/database/databaseSelector';
import { useNavigate, useParams } from 'react-router-dom';
import { createDbThunk } from '../../store/database/databaseThunk';

const UseTemplatePopup = (props) => {
    const allorgss = useSelector((state) => allOrg(state));
    const params = useParams();
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const [selectedOrg, setSelectedOrg] = React.useState('none');

    const handleClose = () => {
        props?.setOpen(false);
    };

    const handleUseTemplate = async () => {
        const data = {
            org_id: selectedOrg
        }
       const response= await useTemplate(props?.categoryName, params?.templateId, data);
        toast.success('Database created successfully!');
        navigate(`/db/${response.data.data._id}`);
        dispatch(createDbThunk({
            data: response?.data?.data
          }));
        handleClose();
    };
    const useStyles = makeStyles({
        dialogPaper: {
          borderRadius: 0,
        },
      });
      const classes = useStyles();

    const handleOrgChange = (event) => {
        setSelectedOrg(event.target.value);
    };

    return (
        <div onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}>
            <Dialog 
             classes={{
                paper: classes.dialogPaper, // Apply custom styles to the dialog paper
              }}
            open={props?.open} onClose={handleClose}>
            <div className="popupheader">    <Typography sx={{ml:2}}id="title" variant="h6" component="h2">
            use this template
          </Typography><CloseIcon sx={{'&:hover': { cursor: 'pointer' }}} onClick={handleClose}/></div>

       
                <DialogContent sx={{p:0,pl:2,pr:1}}>
                    <DialogContentText>
                        To which organization would you like to install this new base?
                    </DialogContentText>
                    <Select 
                       sx={{borderRadius:0}}
                    value={selectedOrg} onChange={handleOrgChange} >
                        <MenuItem value={'none'}>--Select a Workspace--</MenuItem>
                        {allorgss.map((org) => (
                            <MenuItem key={org._id} value={org._id}>
                                {org.name}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <Box sx={{ display: "flex", m:2,justifyContent: "space-between" }}>
                    <Button disabled={selectedOrg=='none'} className="mui-button" onClick={handleUseTemplate} variant="contained" color="primary">
                        Create
                    </Button>
                </Box>
            </Dialog>
        </div>
    );
};

UseTemplatePopup.propTypes = {
    open: PropTypes.any,
    setOpen: PropTypes.any,
    categoryName: PropTypes.any,
};

export default UseTemplatePopup;
