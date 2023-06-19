import React, { useState, useEffect } from 'react';
// import Autosuggest from 'react-autosuggest';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
// import Paper from '@mui/material/Paper';

import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllTableInfo } from '../../../store/allTable/allTableSelector';
import CustomAutoSuggest from "../../../component/customAutoSuggest/customAutoSuggest"




export default function FormulaDataType(props) {
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  const params = useParams();
  // const [searchValue, setSearchValue] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions,setSuggestions] = useState();
  const [html,setHtml] = useState(false)
  const [text,setText] = useState(false)
 
  useEffect(() => {
    const data = AllTableInfo.tables[params?.tableName]?.fields;
    var arr =[]
    
    Object.entries(data).map((fields)=>{
      console.log("fields",fields)
      var json={}
      json.name =fields[1].fieldName
      json.content =  fields[0] 
      arr.push(json)
    })
    setSuggestions(arr)
  }, [])
  console.log("suigesrtion",suggestions);


  useEffect(() => {
    let query = props?.queryByAi;
    try {
      query = JSON.parse(query)?.add_column?.new_column_name?.generated?.expression;
      props.setQueryResult(query);
      setIsLoading(false);
    } catch (err) {
      query = 'enter valid query';
    }
  }, [props?.queryByAi, props?.setQueryResult]);

  // const getSuggestions = (value) => {
  //   const inputValues = value.trim().toLowerCase().split(' ');
  //   const inputLength = inputValues.length;
  //   const searchTerm = inputValues[inputLength - 1];

  //   let response = [];
  //   if (searchTerm.length !== 0) {
  //     response = Object.entries(searchValue.fields).filter((lang) =>
  //       lang[1]?.fieldName?.toLowerCase().startsWith(searchTerm)
  //     );
  //   }
  //   return response;
  // };

  // const getSuggestionValue = (suggestion) => {
  //   const newVal = value.split(' ');
  //   let newdata = '';
  //   for (let i = 0; i < newVal.length - 1; i++) {
  //     newdata += newVal[i] + ' ';
  //   }
  //   newdata = newdata ? newdata + suggestion[1].fieldName : suggestion[1]?.fieldName;
  //   return newdata;
  // };

  // const renderSuggestion = (suggestion) => <MenuItem>{suggestion[1].fieldName}</MenuItem>;

  // const onChange = (event, { newValue }) => {
  //   setValue(newValue);
  // };

  // const onSuggestionsFetchRequested = ({ value }) => {
  //   setSuggestions(getSuggestions(value));
  // };

  // const onSuggestionsClearRequested = () => {
  //   setSuggestions([]);
  // };

  // const inputProps = {
  //   placeholder: 'ask a query to ai',
  //   value,
  //   onChange,
  //   style: {
  //     width: '360px',
  //     height: '50px',
  //     border: '1px solid black',
  //     borderRadius: '5px',
  //     marginTop: 10,
  //   },
  // };
  // const renderSuggestionsContainer = (options) => {
  //   const { containerProps, children } = options;
  //   return (
  //     <Paper {...containerProps} square style={{ maxHeight: "100px", overflowY: "auto" }}>
  //       {children}
  //     </Paper>
  //   );
  // };

  const handleClick = () => {
    setIsLoading(true);
    console.log("html",html)
    console.log("text",text)
    // setTimeout(() => {
    //   props.submitData(value);
    // }, 2000);
  };

  return (
    <Box>
      <Box>
        Write a query in a human-friendly way to manipulate the column, and the resultant query will be given to you!
      </Box>
      {/* <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        renderSuggestionsContainer={renderSuggestionsContainer}
      /> */}
      <CustomAutoSuggest
        id={'editableDivid'}
        suggestion={suggestions}
        chipClass="chip"
        editableDivClass="editable-div"
        suggestionBoxClass="suggestionBox"
        setHtml={setHtml}
        setText={setText}
        onEnterBtnEvent={handleClick}
        disable={false}
        groupByGroupName={false}
      />
      <Button onClick={handleClick} color="primary">
        Ask AI
      </Button>
      {isLoading && <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <CircularProgress />
      </Box>}

      {props.queryByAi && (
        <TextField
          autoFocus
          margin="dense"
          id="text-field"
          label="Query by AI"
          type="text"
          readOnly="readonly"
          placeholder="Resultant query"
          value={props.queryResult}
          fullWidth
        />
      )}


    </Box>
  );
}

FormulaDataType.propTypes = {
  queryByAi: PropTypes.any,
  submitData: PropTypes.func,
  queryResult: PropTypes.any,
  setQueryResult: PropTypes.any,
};
