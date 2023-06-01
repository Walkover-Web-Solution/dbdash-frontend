import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import CodeBlock from './Codeblock';
import React, { useState } from 'react';
import Records from './records';
import OptionalParameter from './optionalParameter';
import ResponseBox from './responseBox';
import '../apiCrudTabCss/deleteRecord.css'; // Import the CSS file

function DeleteRecord(props) {
  const [age, setAge] = useState('');
  const [value, setValue] = useState('');
  const [arr, setArr] = useState([]);

  return (
    <>
      <div className="delete-record-container">
        <CodeBlock
          code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}/{:rowId}${value != "" ? `?${value}` : ``}`}
          header="-H auth-key: AUTH_TOKEN"
          body={arr}
        />
        <ResponseBox response={`{
          "employee": {
          "name": "sonoo",
          "salary": 56000,
          "married": true.
          }
          }`} />
      </div>

      <div className="records-container">
        <Box>
          <Typography className="bold-heading">Delete Table Records</Typography>
          <Typography>
            <Box>
              <br />
              <Records db={props.db} table={props.table} setArr={setArr} arr={arr} />
              <br />
              <OptionalParameter setValue={setValue} age={age} value={value} setAge={setAge} />
            </Box>
          </Typography>
        </Box>
      </div>
    </>
  );
}

DeleteRecord.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string,
};

export default DeleteRecord;
