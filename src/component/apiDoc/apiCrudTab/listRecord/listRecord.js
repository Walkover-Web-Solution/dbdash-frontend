import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Typography } from '@mui/material';
import CodeBlock from '../Codeblock/Codeblock';
import OptionalParameter from '../optionalParameter/optionalParameter';
import ResponseBox from '../responseBox';
import './listRecord.scss'; // Import the CSS file
import variables from '../../../../assets/styling.scss';


function ListRecord(props) {
  const[value,setValue]=useState('');
  const[age,setAge]=useState('')
 
  return (
    <>
    <div
      className="list-record-container"
      >
     <CodeBlock   code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props?.db}/${props?.table}${value!="" ? `?${value}`:``}`} header={`-H auth-key: YOUR_SECRET_API_TOKEN `}/>
     <ResponseBox response={`{
"employee": {
"name": "sonoo",
"salary": 56000,
"married": true.
}
}`} />
     </div>
     <div className='records-container'>
        <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >List records</Typography>
        <Typography  fontSize={variables.textsize} >
        To list records in {props.table} ,issue a GET request to the {props.table} endpoint using {props.table} ids<br/>
        You can filter, sort, and format the results with the following query parameters.
        <br/>
        <br/>
        <OptionalParameter  db={props?.db} table={props?.table}  setValue={setValue} age={age} value={value} setAge={setAge}/>
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