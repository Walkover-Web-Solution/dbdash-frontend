import React, { useState } from 'react'
import { PropTypes } from 'prop-types';
import OptionalParameter from '../optionalParameter/optionalParameter';
import { Typography } from "@mui/material";
import CodeBlock from '../Codeblock/Codeblock';
import Records from '../records/records';
import ResponseBox from '../responseBox';
import './updateRecord.scss'; // Import the CSS file

function UpdateRecord(props) {
  const [value, setValue] = useState('');
  const [arr, setArr] = useState([]);
  const [age, setAge] = useState('');

  return (
    <>
      <div className="container">
        <CodeBlock code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}/{:rowId}${value !== "" ? `?${value}` : ``}`} header={`-H auth-key: AUTH-TOKEN -H Content-Type: application/json `} body={arr} />
        <ResponseBox response={`{
  "employee": {
    "name": "sonoo",
    "salary": 56000,
    "married": true.
  }
}`} />
      </div>
      <div className="response-container">
        <Typography className="bold-heading">To Update records in the</Typography>
        <br />
        <Records db={props?.db} setArr={setArr} arr={arr} table={props?.table} />
        <br />
        <OptionalParameter setValue={setValue} age={age} value={value} setAge={setAge} />
      </div>
    </>
  )
}

UpdateRecord.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string
}

export default UpdateRecord;
