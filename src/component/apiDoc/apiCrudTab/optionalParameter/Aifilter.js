import React,{useState,useEffect} from 'react';
import { Box, Button} from '@mui/material';
import variables from '../../../../assets/styling.scss';
import CustomAutoSuggest from '../../../customAutoSuggest/customAutoSuggest';
import PropTypes from "prop-types";
import {  useSelector } from "react-redux";
import { getAllTableInfo } from "../../../../store/allTable/allTableSelector";


export default function AiFilter(props)  {
    const [html, setHtml] = useState("");
    const [text, setText] = useState("");
  const [fields, setFields] = useState([]);
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  console.log(html,text)

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

  const handleTextChange = (text, html) => {
    setText(text.trim());
    setHtml(html);
    // adjustTextFieldHeight();
  };

  const tableData = async () => {
    const myObj = AllTableInfo?.tables[props?.tableName]?.fields;
    const arr = Object.keys(myObj).map((key) => ({
      name: myObj[key].fieldName,
      content: key,
    }));
    setFields(arr);
  };

  useEffect(() => {
    tableData();
  }, [props.tableName]);

  return (
    <div style={aiFilterStyle}>
      <div style={headerStyle}>Filter</div>
      <div style={contentStyle}>
        <div style={buttonContainerStyle}>
        <Box style={{ display: 'flex', flexDirection: text === '' ? 'row' : 'column', width: '100%' }}>

    <CustomAutoSuggest
        getInputValueWithContext={handleTextChange}
        width="99%"
        suggestion={fields}
        setHtml={setHtml}
        setText={setText}
        defaultValue=''
      />
      <div style={{display:'flex',justifyContent:'right'}}>
       <Button
            variant="outlined"
            className='mui-button-outlined'
            sx={{
              fontSize: variables.editfilterbutttonsfontsize,
              backgroundColor:variables.codeblockbgcolor,
              marginLeft: text === ''?'5px':'0px',
              height:'5vh' // Adjust the margin left as needed
            }}
            style={{ width: '200px', padding: '14.2px' }}
          >
            Generate Query by AI
          </Button>
          </div>
    </Box>
         
        </div>
        <br/>
       <textarea value={props?.querymade} id={'querytextarea'} onChange={props?.changeQueryMade} style={{height:'20vh',fontSize:`${variables.textsize}px`,width:'99%'}}/>
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
    changeQueryMade:PropTypes.any,
   
  };
  
