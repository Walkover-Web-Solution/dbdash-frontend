import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import { Box, Button, CircularProgress, MenuItem, TextField } from '@mui/material';
import Paper from '@mui/material/Paper'; 

import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllTableInfo } from '../../../store/allTable/allTableSelector';





export default function FormulaDataType(props) {
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  const params = useParams();
  const [searchValue, setSearchValue] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (AllTableInfo?.tables[params?.tableName] && searchValue.length === 0) {
      const data = AllTableInfo.tables[params?.tableName];
      setSearchValue(data);
    }
  }, [AllTableInfo])

  
useEffect(() => {
  let query = props?.queryByAi;
  try {
    query = JSON.parse(query)?.add_column?.new_column_name?.generated?.expression;
    props.setQueryResult(query);
    setIsLoading(false); 
  } catch (err) {
    query = 'enter valid query';
  }
}, [props?.queryByAi, props.setQueryResult]);

  const getSuggestions = (value) => {
    const inputValues = value.trim().toLowerCase().split(' ');
    const inputLength = inputValues.length;
    const searchTerm = inputValues[inputLength - 1];

    let response = [];
    if (searchTerm.length !== 0) {
      response = Object.entries(searchValue.fields).filter((lang) =>
        lang[1]?.fieldName?.toLowerCase().startsWith(searchTerm)
      );
    }
    return response;
  };

  const getSuggestionValue = (suggestion) => {
    const newVal = value.split(' ');
    let newdata = '';
    for (let i = 0; i < newVal.length - 1; i++) {
      newdata += newVal[i] + ' ';
    }
    newdata = newdata ? newdata + suggestion[1].fieldName : suggestion[1]?.fieldName;
    return newdata;
  };

  const renderSuggestion = (suggestion) => <MenuItem>{suggestion[1].fieldName}</MenuItem>;

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: 'ask a query to ai',
    value,
    onChange,
    style: {
      width: '360px',
      height: '50px',
      border: '1px solid black',
      
      marginTop: 10,
    },
  };

  const handleClick = () => {
    setIsLoading(true);
  
    setTimeout(() => {
      props.submitData(value);
    }, 2000);
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
    <Box>
      <Box>
        Write a query in a human-friendly way to manipulate the column, and the resultant query will be given to you!
      </Box>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        renderSuggestionsContainer={renderSuggestionsContainer}
      />
      <Button style={{borderRadius:0}} onClick={handleClick} color="primary">
        Ask AI
      </Button>
      {isLoading && <Box sx={{ display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', }}>
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
