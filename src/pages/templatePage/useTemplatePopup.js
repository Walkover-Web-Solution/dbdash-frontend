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
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import './useTemplatePopup.scss';
import { useTemplate } from '../../api/templateApi';
import { useDispatch } from 'react-redux';
import { allOrg } from '../../store/database/databaseSelector';
import { useNavigate, useParams } from 'react-router-dom';
import { createDbThunk } from '../../store/database/databaseThunk';
import { customUseSelector } from '../../store/customUseSelector';

const UseTemplatePopup = (props) => {
    const allorgss = customUseSelector((state) => allOrg(state));
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
    

    const handleOrgChange = (event) => {
        setSelectedOrg(event.target.value);
    };

    return (
        <div onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}>
            <Dialog 
            
            open={props?.open} onClose={handleClose}>
            <div className="popupheader">    
            <Typography  className='useTemplatePopup-text' id="title" variant="h6" component="h2">
            use this template
          </Typography>
          <CloseIcon className='usetemplatepopup-closeIcon' onClick={handleClose}/></div>

       
                <DialogContent  className='useTemplatepopup-dialogContent'>
                    <DialogContentText>
                        To which organization would you like to install this new base?
                    </DialogContentText>
                    <Select 
                        className='useTemplatepopup-select'
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
