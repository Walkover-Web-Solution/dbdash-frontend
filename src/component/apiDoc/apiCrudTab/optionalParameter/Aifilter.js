import React,{useState,useEffect, useRef} from 'react';
import { Box, Button} from '@mui/material';
import variables from '../../../../assets/styling.scss';
import CustomAutoSuggest from '../../../customAutoSuggest/customAutoSuggest';
import PropTypes from "prop-types";
import {  useSelector } from "react-redux";
import { getAllTableInfo } from "../../../../store/allTable/allTableSelector";
import { filterQueryByAi } from '../../../../api/filterApi';



export default function AiFilter(props)  {
    // const [html, setHtml] = useState("");
    const [text, setText] = useState("");
  const editableDivRef  = useRef()
  const textFieldRef = useRef(null);

    const [textAfterWhere, setTextAfterWhere] = useState();
  const [fields, setFields] = useState([]);
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
console.log("sudufuf",AllTableInfo);


//   const [defaultValue, setDefaultValue] = useState(
//     AllTableInfo?.tables[props?.tableName]?.filters[props?.filterId]?.htmlToShow || ""
//   );

  const aiFilterStyle = {
    border: '1px solid #ccc',
    width: '80%' ,// Adjust the width as desired
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

//   const inputStyle = {   
//     width: '99.3%',
//     padding: '5px',
//     marginBottom: '10px'
//   };


  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'flex-start', // Adjust alignment as needed
    justifyContent: 'flex-start' // Adjust alignment as needed
  };

  const handleTextChange = (text) => {
    setText(text.trim());
    
  };

  const tableData = async () => {
    console.log(";fnglngklg",props);
    const myObj = AllTableInfo?.tables[props?.tableName].fields;
    console.log("jgf",myObj)
    let arr=[];
    Object.entries(myObj).map(([key, value]) => {
      let obj={
        name: value.fieldName,
        content: key
      }
      arr.push(obj);
    });
    
console.log(":fklg",arr);
    setFields(arr);
  };

  useEffect(() => {
    tableData();
  }, [props.tableName]);

  const customAutosuggestfunction=(fields)=>{
    return <CustomAutoSuggest
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
    let textquery = text.trim();

    const data ={
      query: textquery
    }

    const applyFilter=await filterQueryByAi(props.dbId,data);

//     const query = applyFilter?.data?.data;
// const searchString = "WHERE";
// const index = query.indexOf(searchString);

// let textAfterWhere1 ;
// if (index !== -1) {
//   textAfterWhere1 = query.substring(index + searchString.length).trim();
// }
if(props?.parent!='updaterecord')
{setTextAfterWhere("filter="+applyFilter?.data?.data)
props?.setQuerymade("filter="+applyFilter?.data?.data);}
else {

  setTextAfterWhere(applyFilter?.data?.data)
props?.setQuerymade(applyFilter?.data?.data);
}

    
  }
  return (
    <div style={aiFilterStyle}>
      <div style={headerStyle}>Filter</div>
      <div style={contentStyle}>
        <div style={buttonContainerStyle}>
        <Box style={{ display: 'flex', flexDirection: text === '' ? 'row' : 'column', width: '98%' }}>
  

       { customAutosuggestfunction(fields)}
{/* <CustomAutoSuggest
                    getInputValueWithContext={handleTextChange}
                    symbolForSearching={' '}
                    suggestion={fields}
                    editableDivRef={editableDivRef2}
                    // setHtml={setHtml}
                    setText={setText}
                    // defaultValue={}
                    groupByGroupName={false}
                    ref={textFieldRef} // Add this line
                  /> */}
      <div style={{display:'flex',justifyContent:'right'}}>
       <Button
            variant="outlined"
            className='mui-button-outlined'
            sx={{
              fontSize: variables.editfilterbutttonsfontsize,
              backgroundColor:variables.codeblockbgcolor,
              marginLeft: '20px',
              height:'5vh' // Adjust the margin left as needed
            }}
            style={{ width: '200px', padding: '14.2px' }}
            onClick={handleQuery}

          >
            Generate Query by AI
          </Button>
          </div>
    </Box>
        </div>
        <br/>
        
       <textarea ref={props?.textfieldref} value={props?.querymade||textAfterWhere} id={'querytextarea'} onChange={(e)=>{
        props?.changeQueryMade(e);
        setTextAfterWhere(e.target.value)
       }} 
       onKeyUp={(e) => {
    if (e.key === 'Enter') {
      props?.handleUse();
    }
  }}
       style={{height:'20vh',fontSize:`${variables.textsize}px`,width:'99%'}}/>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button className="mui-button" onClick={props?.handleUse} variant="contained">
            Use
          </Button>
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
  
