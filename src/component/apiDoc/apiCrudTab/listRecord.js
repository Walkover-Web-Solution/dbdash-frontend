import React from 'react'
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
// import { getTable } from '../../../api/tableApi'
import CodeSnippet from '../codeSnippet';
import { Typography } from '@mui/material';
function ListRecord(props) {
  return (
    <>
    <div>
        <h2>List records</h2>
        <p>
        To list records in {props.table} ,issue a GET request to the {props.table} endpoint using {props.table} ids<br/>
        You can filter, sort, and format the results with the following query parameters.
        <br/>
        <br/>
      <b>Specific fields</b> &nbsp;Only data for fields whose names are in this list will be included in the result.<br/>
                    If you do not need every field, you can use this parameter to reduce the amount of<br/>
                    data transferred.<br/>
                    http://localhost:5000/:dbId/:tableId/?fields=field1,field2,field3<br/>
                    <br/>
                    <br/>
      <b>filterByFormula</b> &nbsp;A formula used to filter records. The formula will be evaluated for each record,and if the result is<br/>
                               not 0, false, NaN, [] or #Error! the record will be included in the response.We recommend testing your<br/>
                            formula in the Formula field UI before using it in your API request.If combined with the view parameter,<br/>
                            only records in that view which satisfy the formula will be returned.The formula must be encoded first<br/>
                             before passing it as a value. You can use this tool to not only encode the formula but also create<br/>
                            the entire url you need.
                            <br/>
                            http://localhost:5000/:dbId/:tableId/?fields=field1,field2,field3&filter=field1=!nullANDfield2=&quot;10&quot;<br/>
                            <br/>
                            <br/>
             <b>pageSize</b>&nbsp;The number of records returned in each request.Must be less than or equal to 100.<br/>
                                 Default is 100.
                                 <br/>
                                 http://localhost:5000/:dbId/:tableId/?page=2&limit=10
                                 <br/>
                                 <br/>
                     <b>sort</b>&nbsp; A list of sort objects that specifies how the records will be ordered.<br/>
                     http://localhost:5000/:dbId/:tableId/?fields=field1,field2,field3&sort=field1,asc.
        </p>
        </div>
        <br/>
    <Box>
      <CodeSnippet  codeString={`"https://localhost:5000/${props.db}/${props.table}"` }/>
      <p>{`-H "Authorization: Bearer YOUR_SECRET_API_TOKEN" `}</p>
    </Box>
    <Box>
      <Typography></Typography>
    </Box>
    </>
  )
}
ListRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default ListRecord
