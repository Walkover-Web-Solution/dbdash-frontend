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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, MenuItem } from '@mui/material';
import { useSelector,useDispatch } from 'react-redux';
import AddOptionPopup from './addOptionPopup';
import { useParams } from 'react-router-dom';
import { updateColumnHeaders } from '../../store/table/tableThunk';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

export default function ManageFieldDropDown(props) {
  const dispatch = useDispatch();
   
 const classes = useStyles();
 const fields1 = useSelector((state) => state.table.columns);
 const [openAddFields, setOpenAddFields] = React.useState(false);
 const [fieldId,setFieldId] = useState("");
 const [fieldType,setFieldType] = useState("");
 const params = useParams();

  const handleClose = () => {
    props.setOpenManageField(false);
  };
  const columnId = (fieldid,fieldType)=>{
    setFieldId(fieldid)
    setFieldType(fieldType)
  }
  const handleOpen = () => setOpenAddFields(true);
  var defaultArr = fields1.map((column) => {
    return !column?.metadata?.hide;
  })
  
  const hideColumn = async (columnId, isChecked) => {
    const metaData = { hide: isChecked };
    dispatch(
      updateColumnHeaders({
        dbId: params?.dbId,
        tableName: params?.tableName,
        columnId: columnId,
        metaData: metaData,
        filterId : params?.filterName
      })
    );
  };
  const toggleColumn = (columnId, i) => {
    var newArr = [...defaultArr]
    newArr[i] = !newArr[i]
    defaultArr = newArr
    hideColumn(columnId, !newArr[i]);
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
            <TableCell>Hide Fields</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {fields1.map((field, index) => {
    return (
      <TableRow key={index}>
        <TableCell>{field.title}</TableCell>
        <TableCell>{field.dataType}</TableCell>
        {field.dataType === "singleselect" || field.dataType === "multipleselect" ? (
          <TableCell>
            <Button onClick={() => { handleOpen(); columnId(field.id, field.dataType) }} variant="contained">Add option</Button>
          </TableCell>
        ) : (
          <TableCell></TableCell>
        )}
        <TableCell>
          <MenuItem
            key={index}
            sx={{
              fontSize: '12px',
              minHeight: 'auto',
              padding: '2px 8px',
            }}
          >
            <input
              style={{ width: "15px", height: "15px" }}
              type="checkbox"
              checked={defaultArr[index]}
              onChange={() => toggleColumn(field?.id, index)}
            />
            {field?.title}
          </MenuItem>
        </TableCell>
      </TableRow>
    );
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