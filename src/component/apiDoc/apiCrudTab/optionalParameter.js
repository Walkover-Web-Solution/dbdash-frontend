import { MenuItem, Typography,Select,InputLabel,FormControl,Link,TextField,Box } from '@mui/material';
import React from 'react'
import { PropTypes } from 'prop-types';



function OptionalParameter(props) {
    const handleChange=(e)=>{
        props?.setAge(e.target.value);
      }
  return (
    <div><Box
    component="div"
    style={{ border: '2px solid black', borderRadius: '1px', padding: '10px', width: "54.5vw", backgroundColor: 'lightgrey' }}
  >
    <Typography style={{ fontWeight: 'bold', fontSize: '17px' }}>Optional parameter</Typography>
    <Typography style={{ fontWeight: 'bold', fontSize: '17px' ,paddingTop:'10px'}}>Where</Typography>
    <Typography style={{paddingBottom:'15px'}}>To filter record based on certain</Typography>
    <TextField id="outlined-basic" value={props?.value} label=" " onChange={(e)=>{props?.setValue(e.target.value)}}variant="outlined" style={{ height: '0px', width: 450 }} />
    <br />
    <br />
    <br/>
    <Link href="#" style={{ontSize: '15px'}}>Learn more about the where clause</Link>
    <Typography style={{ fontWeight: 'bold', fontSize: '17px' ,paddingBottom:'8px',paddingTop:'13px'}}>Limit</Typography>
    <Typography>Limit Column/Field in response</Typography>
    <div>
      <FormControl sx={{ m: 1, minWidth: 60 }}>
        <InputLabel id="demo-simple-select-helper-label" style={{fontSize:'15px', paddingbottom:'40px'}}>All</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={props?.age}
          label="Age"
          onChange={handleChange}
          style={{height:'50px'}}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
      </FormControl>
    </div>
  </Box></div>
  )
}
OptionalParameter.propTypes={
    age:PropTypes.number,
    setAge:PropTypes.func,
    value:PropTypes.any,
    setValue:PropTypes.func
}
export default OptionalParameter