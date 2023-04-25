import { Box, Button, MenuItem, Paper, TextField } from '@mui/material';
import React,{ useState,useEffect } from 'react';
import Autosuggest from "react-autosuggest";
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllTableInfo } from '../../../store/allTable/allTableSelector';

export default function FormulaDataType(props) {
    
    const AllTableInfo = useSelector((state) => getAllTableInfo(state));
    const [userQuery,setUserQuery] = useState(false);
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const params = useParams();
    const [searchValue, setsearchValue] = useState([]);
    
  useEffect(() => {
      if (AllTableInfo?.tables[params?.tableName] && searchValue.length == 0) {
          
          let data = AllTableInfo?.tables[params?.tableName]     
          setsearchValue(data)
      }
  }, [AllTableInfo])
    
    useEffect(()=>{
    var query  = props?.queryByAi
    try {
      query = JSON.parse(query)?.add_column?.new_column_name?.generated?.expression
    } catch (err) {
      query = "enter valid query"
    }
    props.setQueryResult(query);
  },[props?.queryByAi])

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value) => {
    const inputValues = value?.trim()?.toLowerCase()?.split(" ");
    const inputLength = inputValues.length;
    const searchTerm = inputValues[inputLength - 1];
   
    let response = [];
    if( searchTerm.length !== 0){
     response = Object.entries(searchValue.fields).filter((lang) => lang[1]?.fieldName?.toLowerCase()?.startsWith(searchTerm))
    }
      return response
  };

  const getSuggestionValue = (suggestion) => {
    const newVal = value?.split(" ");
    let newdata = "";
    for (let i = 0; i < newVal.length - 1; i++) {
      newdata += newVal[i] + " ";
    }
    newdata = newdata ? newdata + suggestion[1].fieldName : suggestion[1]?.fieldName;
    return newdata;
  };

  // Use your imagination to render suggestions.
  const renderSuggestion = (suggestion) => <MenuItem>{suggestion[1].fieldName}</MenuItem>;

  const onChange = (event, { newValue }) => {
    let addVal = newValue;
    setValue(addVal);
    setUserQuery(newValue)
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: "ask a query to ai",
    value,
    onChange,
    style: { width: "360px", height: "50px", border: '1px solid black', borderRadius: "5px", marginTop: 10 }
  };

  const renderSuggestionsContainer = (options) => {
    const { containerProps, children } = options;
    return (
      <Paper {...containerProps} square style={{ maxHeight: "100px", overflowY: "auto" }}>
        {children}
      </Paper>
    );
  };

  return (
    <>
              <Box>
                <Box>write query in human friendly way to manupulate the column and resultant query will be give to you !!!  and vice versa</Box>
                <Autosuggest
                  autoFocus
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={inputProps}
                  renderSuggestionsContainer={renderSuggestionsContainer}
                />
                <Button onClick={() => { props?.submitData(userQuery) }} color="primary" >Ask AI</Button>

                 {props?.queryByAi && <TextField
                  autoFocus
                  margin="dense"
                  id="text-field"
                  label="Query by Ai"
                  type="text"
                  readOnly="readonly"
                  placeholder={"resultant query"}
                  value={props.queryResult}
                  fullWidth
                />} 
              </Box>
    </>
  )
}

FormulaDataType.propTypes ={
    queryByAi: PropTypes.any,
    submitData: PropTypes.func,
    queryResult: PropTypes.any,
  setQueryResult: PropTypes.any
}
