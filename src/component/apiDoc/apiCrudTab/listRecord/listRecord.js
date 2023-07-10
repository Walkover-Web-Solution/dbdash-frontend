import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Typography,Link } from '@mui/material';
import CodeBlock from '../Codeblock/Codeblock';
import OptionalParameter from '../optionalParameter/optionalParameter';
import ResponseBox from '../responseBox';
import './listRecord.scss'; // Import the CSS file
import variables from '../../../../assets/styling.scss';
import FilterConditionTable from '../filterConditionTable';
import AiFilter from '../aiFilter';


function ListRecord(props) {
  const[value,setValue]=useState('');
  const[age,setAge]=useState('')
 const response=`
 {
  "success": true,
  "message": "'tbliu656v'rows retrieved successfully",
  "data": {
    "offset": null,
    "rows": [
      {
        "fldiu656vrlu": "7",
        "fldiu656vupdatedat": "1686986548"
      },
      {
        "fldiu656vrlu": "-1",
        "fldiu656vupdatedat": "1686987070"
      }
    ]
  }
}`;
  return (
    <>
    <div
      className="list-record-container"
      style={{ height: `${(window?.screen?.height * 61) / 100}px`,overflowY:"scroll"}}
      >
     <CodeBlock method="GET"  code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props?.db}/${props?.table}${value!="" ? `?${value}`:``}`} header={`auth-key: AUTH_TOKEN `}/>
     <ResponseBox response={response} />
     </div>
     <div style={{width:'700px',overflowX:"hidden"}}>

     <div className='records-container'>
        <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >List/GET Records -</Typography>
        <Typography fontSize={variables.textsize}>
  {/* {`To retrieve a list of records from the "${props?.alltabledata[props.table].tableName}" table, you can initiate a GET request to the "${props.table}" endpoint using the "${props.table}" IDs. Furthermore, you have the option to filter, sort, and format the results by utilizing the provided query parameters.`} */}
  To retrieve all records from the &quot;licenseKey&quot; table, you can send a GET request to the &quot;licenseKey&quot; table with the table ID &quot;tbl6rtzef&quot;
<br/>
  Additionally, you have the flexibility to filter, sort, and format the results by using the avallable query parameters.
  <br />
  <br />
  <Typography fontWeight={variables.titleweight} fontSize={Number(variables.titlesize)} variant={variables.titlevariant}>
       Optional parameters
        </Typography><br/>
        <Typography   style={{ fontWeight: "bold" ,fontSize:20}}>
        Where Condition :
 </Typography>
        <Typography  fontSize={variables.textsize} >

        &quot;filter&quot; conditions in the APIs enable you to retrieve specific records that meet specific criteria. By applying &quot;filter&quot; conditions, you can refine the results based on specific field values or patterns.
        <br/>
        {/* To implement a filter condition in the APIs, you can include the "filter" parameter in your API request. The "filter" parameter occepts formula expressions that can include various operators and functions, allowing you to create complex filter conditions. You can utilize logical operators such as "AND," "OR," and "NOT" to combine multiple conditions. Additionally, comparison operators like "=""> "<" and functions like "FINDO), "LEN()," and "IS_BEFORE()" can be used to specify precise criteria for filtering */}

</Typography><br/>
 <Typography   style={{ fontWeight: "bold" ,fontSize:20}}>
 Examples for where conditions:
 </Typography>
 <br />

 <Typography  sx={{backgroundColor:"#E6E6E6"}} >
 GET <span style={{textDecoration: "underline"}}>https://dbdash-backend-h7duexlbuq-el.a.run.app/Your_DataBase_ID/Your_Table_ID? filter=FieldID1 != `John”</span>
 </Typography>
 <br />
 <br/>
 <Typography style={{fontSize:15 ,p:5}}>
  Select Column name and click on the CheckBox to generate API on the right side
 </Typography>

 <FilterConditionTable/>
 <Link href="#" style={{ fontSize: `${variables.linksizeoptionalparameter}px` }}>
          More....
        </Link>
 <br />
 <br />
 <br />
        <Typography   style={{ fontWeight: "bold" ,fontSize:20}}>
        Still need help?Ask AI to generate your Filter condition
 </Typography>
 <br />
 <AiFilter/>
 <br />
 <br />
 
 <Typography   style={{ fontWeight: "bold" ,fontSize:20}}>
 Fileds to show:
 </Typography>
 <Typography  fontSize={variables.textsize} >
 The &quot;Fields to show&quot; parameter in the List Record API enables you to precisely define which fields you wish to receive in the response.
<br/>
<br/>
To utilize the &quot;Fields to show&quot; parameter, simply include it as a query parameter in your API request. Specify the desired field names or field IDs as a comma-separated list. The API response will only contain the specified fields, excluding all others.
<br/>
<br/>
Here&apos;s an example of utilizing the &quot;Fields to show&quot; parameter in the API

</Typography>
        <br />
        <Typography  sx={{backgroundColor:"#E6E6E6"}} >
        curl-X GET
<br/><span style={{textDecoration: "underline"}}>
https://dbdosh-backend-h7duexlbuq-ela.run.opp/(YourDotoBoselD)/(YourTableID)?fields=Field1,Fleld2,Feld3</span>
<br/>
. Hauth key AUTH_TOKEN&apos;
 </Typography>
 <br />
 <br />
 
 
 <Typography   style={{ fontWeight: "bold" ,fontSize:20}}>
 Sort by, Limit and Offset:
 </Typography>
 <Typography  fontSize={variables.textsize} >
 The API provides a list of sort objects to define the order in which records will be arranged. Each sort object should include a field key that indicates the field name for sorting. Additionally, you can optionally include a direction key with a value of either &ldquo;asc&ldquo; (ascending) or &ldquo;desc&ldquo; (descending) to specify the sorting direction. By default, the sorting direction is set to &ldquo;asc&ldquo;.
<br/>
<br/>
By default, the limit of records is set to 100. If there are additional records beyond this limit, the response will include an OFFSET value. To retrieve the next page of records, include the offset value as a parameter in your subsequent request. The pagination process will continue until you have reached the end of your table.
</Typography>
     
  <OptionalParameter alltabledata={props?.alltabledata} parent="listrecord" db={props?.db} table={props?.table} setValue={setValue} age={age} value={value} setAge={setAge} />
</Typography>

        <br/>
   </div>
   
    </div>
    </>
  )
}
ListRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string,
  alltabledata:PropTypes.any
}
export default ListRecord