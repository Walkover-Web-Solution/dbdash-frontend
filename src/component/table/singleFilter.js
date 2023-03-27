import React,{useState} from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box } from '@mui/material';
import FilterDropdown from './filterDropdown';
import PropTypes from 'prop-types';



export default function  SingleFilter(props) {
    const [openFilterDropdown, setOpenFilterDropdown] = useState(false)   

    const handleClickOpen = () => {
        setOpenFilterDropdown(true);
      };

  return (
    <Box key={props.index} marginRight={1}>
    <Box sx={{backgroundColor:"grey",height:30,width:120,display:"flex", gap:"10px", alignItems:"center",justifyContent:"center"}}
      onClick={() => {
        props.onFilterClicked(props.filter[1].query,props.filter[0]);
      }}
      variant="contained"
      color="primary"
    >
      {props.filter[1]?.filterName}
      <MoreHorizIcon onClick={handleClickOpen}/>
      <FilterDropdown openFilterDropdown={openFilterDropdown} handleEdit={props?.handleEdit} setOpenFilterDropdown={setOpenFilterDropdown}/>
    {/* <EditIcon fontSize='small' onClick={()=>{
      handleEdit();
    }}/> */}
    </Box>
  </Box>
  )
}

SingleFilter.propTypes = {
    index:PropTypes.number,
    onFilterClicked:PropTypes.func,
    filter: PropTypes.any,
    handleEdit:PropTypes.func
};
