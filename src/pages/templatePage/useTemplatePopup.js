import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select
} from '@mui/material';
import { toast } from 'react-toastify';
import { useTemplate } from '../../api/templateApi';
import { useSelector } from 'react-redux';
import { allOrg } from '../../store/database/databaseSelector';
import { useNavigate, useParams } from 'react-router-dom';

const UseTemplatePopup = (props) => {
    const allorgss = useSelector((state) => allOrg(state));
    const params = useParams();
    const navigate = useNavigate();
    const [selectedOrg, setSelectedOrg] = React.useState('');

    const handleClose = () => {
        props?.setOpen(false);
    };

    const handleUseTemplate = async () => {
        const data = {
            org_id: selectedOrg
        }
        await useTemplate(props?.categoryName, params?.templateId, data);
        toast.success('Database created successfully!');
        navigate('/dashboard');
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
            <Dialog open={props?.open} onClose={handleClose}>
                <DialogTitle>Use this template</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To which organization would you like to install this new base?
                    </DialogContentText>
                    <Select value={selectedOrg} onChange={handleOrgChange} >
                        {allorgss.map((org) => (
                            <MenuItem key={org._id} value={org._id}>
                                {org.name}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleUseTemplate} variant="contained" color="primary">
                        Create
                    </Button>
                </DialogActions>
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
