import React, {useState} from 'react';
// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// import ListItemText from '@mui/material/ListItemText';
// import ListItem from '@mui/material/ListItem';
// import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import PropTypes from "prop-types";
import { makeStyles } from '@mui/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import AddOptionPopup from './addOptionPopup';
import HideFieldDropdown from './hidefieldDropdown';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

export default function ManageFieldDropDown(props) {
   
 const classes = useStyles();
 const fields1 = useSelector((state) => state.table.columns);
 const [openAddFields, setOpenAddFields] = React.useState(false);
 const [fieldId,setFieldId] = useState("");
 const [fieldType,setFieldType] = useState("");

  const handleClose = () => {
    props.setOpenManageField(false);
  };
  const columnId = (fieldid,fieldType)=>{
    setFieldId(fieldid)
    setFieldType(fieldType)
  }
  const handleOpen = () => setOpenAddFields(true);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={props.setOpenManageField}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={()=>{handleClose()}}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="My Table">
        <TableHead>
          <TableRow>
            <TableCell>Field Name</TableCell>
            <TableCell>Field Type</TableCell>
            <TableCell></TableCell>
            <TableCell>
          <Button sx={{ fontSize: "11px" }} onClick={handleMenuOpen}>Hide Fields</Button>
          <HideFieldDropdown   menuAnchorEl={menuAnchorEl} setMenuAnchorEl={setMenuAnchorEl} />

            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {fields1.map((field, index) => {
              if (field.dataType === "singleselect" || field.dataType === "multipleselect") {
                return (
                  <TableRow key={index}>
                    <TableCell>{field.title}</TableCell>
                    <TableCell>{field.dataType}</TableCell>
                   
                    <TableCell><Button onClick={() => { handleOpen(); columnId(field.id,field.dataType)}} variant="contained">Add option</Button></TableCell>
                  
                  </TableRow>

                );
              }
              return null;
            })}
          </TableBody>
      </Table>
    </TableContainer>
      </Dialog>
      <AddOptionPopup openAddFields={openAddFields} fieldType={fieldType} columnId={fieldId}  setOpenAddFields={setOpenAddFields}/>
    </div>
  );
}

ManageFieldDropDown.propTypes = {
    setOpenManageField: PropTypes.any,
}