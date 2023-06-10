import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import CodeBlock from '../Codeblock/Codeblock';
import React, { useState } from 'react';
import Records from '../records/records';
import OptionalParameter from '../optionalParameter/optionalParameter';
import ResponseBox from '../responseBox';
import './deleteRecord.scss'; // Import the CSS file
import variables from '../../../../assets/styling.scss';
function DeleteRecord(props) {
  const [age, setAge] = useState('');
  const [value, setValue] = useState('');
  const [arr, setArr] = useState([]);

  return (
    <>
      <div className="delete-record-container">
        <CodeBlock
          code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props?.db}/${props?.table}/{:rowId}${value != "" ? `?${value}` : ``}`}
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
        <Box className="records-container">
          <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >Delete Table Records</Typography>
          <Typography>
            <Box>
              <br />
              <Records db={props?.db} table={props?.table} setArr={setArr} arr={arr} />
              <br />
              <OptionalParameter  db={props?.db} table={props?.table} setValue={setValue} age={age} value={value} setAge={setAge} />
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
