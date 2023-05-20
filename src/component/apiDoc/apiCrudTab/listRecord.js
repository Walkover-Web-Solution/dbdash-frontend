import React ,{useState} from 'react'
import { PropTypes } from 'prop-types';
import {Typography} from '@mui/material';
import CodeBlock from './Codeblock';
import OptionalParameter from './optionalParameter';
import ResponseBox from './responseBox';

function ListRecord(props) {
  const[value,setValue]=useState('');
  const[age,setAge]=useState('')
 
  return (
    <>
    <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          right: 0,
          width: "36vw",
          padding: "10px",
          height: "65vh",
          overflowY: "scroll",
          whiteSpace: "pre-wrap",
        }}
      >
     <CodeBlock   code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}${value!="" ? `?${value}`:``}`} header={`-H auth-key: YOUR_SECRET_API_TOKEN `}/>
     <ResponseBox response={`{
"employee": {
"name": "sonoo",
"salary": 56000,
"married": true.
}
}`} />
     </div>
     <div style={{width:'700px',height:"65vh",overflowY:"scroll",whiteSpace:"pre-wrap",padding:"2px"}}>
        <Typography style={{fontWeight: 'bold',fontSize: '24px'}}>List records</Typography>
        <Typography>
        To list records in {props.table} ,issue a GET request to the {props.table} endpoint using {props.table} ids<br/>
        You can filter, sort, and format the results with the following query parameters.
        <br/>
        <br/>
        <OptionalParameter setValue={setValue} age={age} value={value} setAge={setAge}/>

        {/* <Box
          component="div"
          style={{ border: '2px solid black', borderRadius: '1px', padding: '10px', width: "54.5vw", backgroundColor: 'lightgrey' }}
        >
          <Typography style={{ fontWeight: 'bold', fontSize: '17px' }}>Optional parameter</Typography>
          <Typography style={{ fontWeight: 'bold', fontSize: '17px' ,paddingTop:'10px'}}>Where</Typography>
          <Typography style={{paddingBottom:'15px'}}>To filter record based on certain</Typography>
          <TextField id="outlined-basic" value={value} label=" " onChange={(e)=>{setValue(e.target.value)}}variant="outlined" style={{ height: '0px', width: 450 }} />
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
                value={age}
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
        </Box> */}
        </Typography>
        <br/>
   
   
    </div>
    </>
  )
}
ListRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default ListRecord