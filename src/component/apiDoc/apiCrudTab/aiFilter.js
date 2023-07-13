import React,{useState,useEffect} from 'react';
import { Box, Button} from '@mui/material';
import variables from '../../../assets/styling.scss';
import CustomAutoSuggest from '../../customAutoSuggest/customAutoSuggest';
import PropTypes from "prop-types";
import {  useSelector } from "react-redux";
import { getAllTableInfo } from "../../../store/allTable/allTableSelector";



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
    padding: '10px',
    width: '600px' // Adjust the width as desired
  };

  const headerStyle = {
    backgroundColor: '#e6e6e6',
    padding: '10px',
    fontWeight: 'bold',
  };

  const contentStyle = {
    marginTop: '10px'
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
        <Box style={{ flex: 1 }}>
    <CustomAutoSuggest
        getInputValueWithContext={handleTextChange}
        // width="593px"
        suggestion={fields}
        setHtml={setHtml}
        setText={setText}
        defaultValue=''
      />
    </Box>
          <Button
            variant="outlined"
            className='mui-button-outlined'
            sx={{
              fontSize: `${variables.editfilterbutttonsfontsize}`,
              marginTop: '.8px', // Adjust the margin top as needed
              marginLeft: '5px' // Adjust the margin left as needed
            }}
            style={{ width: '200px', padding: '14.2px' }}
          >
            Generate Query by AI
          </Button>
        </div>
        <br/>
        <CustomAutoSuggest
        getInputValueWithContext={handleTextChange}
        width="593px"
        suggestion={fields}
        setHtml={setHtml}
        setText={setText}
        defaultValue=''
      />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button className="mui-button" variant="contained">
            Use
          </Button>
        </Box>
      </div>
    </div>
  );
}

AiFilter.propTypes = {
    // open: PropTypes.bool,
    // setOpen: PropTypes.func,
    // dbId: PropTypes.any,
    tableName: PropTypes.any,
    // edit: PropTypes.any,
    // filterId: PropTypes.any,
    // dbData: PropTypes.any,
    // setEdit: PropTypes.func,
    // setUnderLine: PropTypes.any
  };
  
