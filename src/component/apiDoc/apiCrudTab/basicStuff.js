import React, { useEffect, useState } from "react";
import { PropTypes } from 'prop-types';
// import CodeSnippet from '../codeSnippet';
import { getAllfields } from '../../../api/fieldApi';
import { Box } from "@mui/system";
function BasicStuff(props) {
  const [fieldData, setFieldData] = useState(null)
  const tableData = async () => {
    const data = await getAllfields(props.db, props.table)
    setFieldData(data?.data?.data?.fields)
  }
  useEffect(() => {
    tableData();
  }, [props.db, props.table]);
  return (
    <>
      <Box >
        <h5>Database Id - {props.db}</h5>
        <h5>Table Id - {props.table}</h5>
        <br></br>
        <h4>fieldName    fieldId   fieldType </h4>
        {fieldData && Object.entries(fieldData).map((fields, index) => (
          <Box
            key={index}
          >
            {fields[1].fieldName} -
            {fields[0]} -
            {fields[1].fieldType}
          </Box>
        ))}
      </Box>
      {/* <CodeSnippet codeString="const myVar = 'Hello, world!';" /> */}
    </>
  )
}
BasicStuff.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string
}
export default BasicStuff