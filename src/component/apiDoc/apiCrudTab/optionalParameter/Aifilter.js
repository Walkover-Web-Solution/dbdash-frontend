import React,{useState,useEffect, useRef} from 'react';
import { Box, Button} from '@mui/material';
import variables from '../../../../assets/styling.scss';
import CustomAutoSuggest from '../../../customAutoSuggest/customAutoSuggest';
import PropTypes from "prop-types";
import {  useSelector } from "react-redux";
import { getAllTableInfo } from "../../../../store/allTable/allTableSelector";
import { filterQueryByAi } from '../../../../api/filterApi';
import CircularProgress from '@mui/material/CircularProgress';




export default function AiFilter(props)  {
    // const [html, setHtml] = useState("");
    const [text, setText] = useState("");
  const editableDivRef  = useRef()
  const textFieldRef = useRef(null);
const[showAnsfield,setShowAnsfield]=useState(true);
    const [textAfterWhere, setTextAfterWhere] = useState();
  const [fields, setFields] = useState([]);
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));

  const aiFilterStyle = {
    border: '1px solid #ccc',
    width: '85%' ,// Adjust the width as desired
    marginTop:'1vh'
  };

  const headerStyle = {
    backgroundColor: variables.codeblockbgcolor,
    padding: '10px',
  };

  const contentStyle = {
    marginTop: '10px',
    padding:2
  };




  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'flex-start', // Adjust alignment as needed
    justifyContent: 'flex-start' // Adjust alignment as needed
  };

  const handleTextChange = (text) => {
    setText(text.trim());
    
  };

  const tableData = async () => {
    const myObj = AllTableInfo?.tables[props?.tableName].fields;
    let arr=[];
    Object.entries(myObj).map(([key, value]) => {
      let obj={
        name: value.fieldName,
        content: key
      }
      arr.push(obj);
    });
    
    setFields(arr);
  };

  useEffect(() => {
    tableData();
  }, [props.tableName]);

  const customAutosuggestfunction=(fields)=>{
    return <CustomAutoSuggest
    id="customautosuggest"
    getInputValueWithContext={handleTextChange}
    editableDivRef={editableDivRef}
    suggestion={fields}
    setText={setText}
    defaultValue=''
    symbolForSearching={' '}
    groupByGroupName={false}
    ref={textFieldRef} // Add this line


  />

  }
  const handleQuery=async () => {
    setShowAnsfield(false);

    let textquery = text.trim();

    const data ={
      query: textquery
    }

    const applyFilter=await filterQueryByAi(props.dbId,data);

if(props?.parent!='updaterecord')
{setTextAfterWhere("filter="+applyFilter?.data?.data)
props?.setQuerymade("filter="+applyFilter?.data?.data);}
else {

  setTextAfterWhere(applyFilter?.data?.data)
props?.setQuerymade(applyFilter?.data?.data);
}
setShowAnsfield(true);
    
  }
  return (
    <div style={aiFilterStyle}>
      <div style={headerStyle}>Filter</div>
      <div style={contentStyle}>
        <div style={buttonContainerStyle}>
        <Box style={{ display: 'flex', flexDirection: text === '' ? 'row' : 'column', width: '100%' ,alignItems:'center'}}>
  
<div style={{width:text==''?'76%':'98%'}}>
       { customAutosuggestfunction(fields)}
       </div>
      <div style={{display:'flex',justifyContent:'right',width:text===''?'24%':'100%'}}>
       <Button
            variant="outlined"
            className='mui-button-outlined'
            sx={{
              fontSize: variables.editfilterbutttonsfontsize,
              backgroundColor:variables.codeblockbgcolor,
              height:'50px' ,
              width:'90%',
            }}
            onClick={handleQuery}

          >
            Generate Query by AI
          </Button>
          </div>
    </Box>
        </div>
        <br/>
        
    {showAnsfield?   <textarea ref={props?.textfieldref} value={props?.querymade||textAfterWhere} id={'querytextarea'} onChange={(e)=>{
        props?.changeQueryMade(e);
        setTextAfterWhere(e.target.value)
       }} 
       onKeyUp={(e) => {
    if (e.key === 'Enter') {
      props?.handleUse();
    }
  }}
       style={{height:'20vh',fontSize:`${variables.textsize}px`,width:'99%'}}/>:  <div style={{display:'flex',justifyContent:'center'}}><CircularProgress /></div>}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end',m:2,mr:0 }}>
      {showAnsfield &&    <Button className="mui-button" onClick={props?.handleUse} variant="contained">
            Use
          </Button>}
        </Box>
      </div>
    </div>
  );
}

AiFilter.propTypes = {
    tableName: PropTypes.any,
    handleUse:PropTypes.any,
    querymade:PropTypes.any,
    setQuerymade:PropTypes.any,
    textfieldref:PropTypes.any,
    changeQueryMade:PropTypes.any,
    parent:PropTypes.any,
    dbId:PropTypes.any
  };
  
