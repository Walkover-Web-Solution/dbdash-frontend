import React from 'react'
import { PropTypes } from 'prop-types';
import { Box } from '@mui/system';
// import { getTable } from '../../../api/tableApi'
// import CodeSnippet from '../codeSnippet';
import { Typography } from '@mui/material';
import CodeBlock from './Codeblock';
function ListRecord(props) {
  return (
    <>
     <CodeBlock   code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}`} header={`-H auth-key: YOUR_SECRET_API_TOKEN `}/>
     
        <Typography style={{fontWeight: 'bold',fontSize: '24px'}}>List records</Typography>
        <Typography>
        To list records in {props.table} ,issue a GET request to the {props.table} endpoint using {props.table} ids<br/>
        You can filter, sort, and format the results with the following query parameters.
        <br/>
        <br/>
      <b>Specific fields</b> &nbsp;Only data for fields whose names are in this list will be included in the result.<br/>
                    If you do not need every field, you can use this parameter to reduce the amount of<br/>
                    data transferred.<br/>
                    {`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}` }?fields=field1,field2,field3<br/>
                    <br/>
                    <br/>
      <b>filterByFormula</b> &nbsp;A formula used to filter records. The formula will be evaluated for each record,and if the result is<br/>
                               not 0, false, NaN, [] or #Error! the record will be included in the response.Get a row filter=id=rowId<br/>
                            {/* We recommend testing your formula in the Formula field UI before using it in your API request.If combined with the view parameter,<br/> */}
                            {/* only records in that view which satisfy the formula will be returned.The formula must be encoded first<br/> */}
                             {/* before passing it as a value. You can use this tool to not only encode the formula but also create<br/> */}
                            {/* the entire url you need. */}
                            {/* <br/> */}
                            {`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}` }<br/>?fields=field1,field2,field3&filter=field1=!null AND field2=&lsquo;xyz&rsquo;<br/>

                            <br/>
                            <br/>
             <b>pageSize</b>&nbsp;The number of records returned in each request.Must be less than or equal to 200.<br/>
                                 Default is 200.
                                 <br/>
                                 {`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}` }?page=1&limit=200
                                 <br/>
                                 <br/>
                     <b>sort</b>&nbsp; A list of sort objects that specifies how the records will be ordered.<br/>
                     {`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}` }?fields=field1,field2,field3&sort=field1,asc.
        </Typography>
        <br/>
    {/* <Box>
      <CodeSnippet  codeString={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}`}
      />
      <p>{`-H auth-key: YOUR_SECRET_API_TOKEN `}</p>
    </Box> */}
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