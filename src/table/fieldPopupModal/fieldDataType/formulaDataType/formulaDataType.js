import React, { useState, useEffect, useRef } from 'react';
// import Autosuggest from 'react-autosuggest';
import { Box, Button, CircularProgress } from '@mui/material';
// import Paper from '@mui/material/Paper';

import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { getAllTableInfo } from '../../../../store/allTable/allTableSelector';
import CustomAutoSuggest from "../../../../component/customAutoSuggest/customAutoSuggest"
import { getQueryByAi } from '../../../../api/fieldApi';
import './formulaDataType.scss'
import { customUseSelector } from '../../../../store/customUseSelector';
import CustomTextField from '../../../../muiStyles/customTextfield';

export default function FormulaDataType(props) {
  const AllTableInfo = customUseSelector((state) => getAllTableInfo(state));
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions,setSuggestions] = useState();
  const [html,setHtml] = useState(false)
  const [text,setText] = useState(false)
  const [queryResult,setQueryResult] = useState();
  const editableDivRef  = useRef()
  const data = AllTableInfo.tables[params?.tableName]?.fields;
  useEffect(() => {
    var arr =[]
    Object.entries(data).map((fields)=>{
      var json={}
      json.name =fields[1].fieldName
      json.content =  fields[0] 
      arr.push(json)
    })
    setSuggestions(arr)
  }, [])


  useEffect(() => {
    let query = props?.queryByAi;
    try {
      query = JSON.parse(query?.pgQuery)?.add_column?.new_column_name?.generated?.expression;
      const regex = /data-attribute="([^"]*)"/g;
      const matches = [];
      let match;
      while ((match = regex.exec(html))) {
        matches.push(match[1]);
      
        query =  query.replaceAll(match[1], data[match[1]].fieldName)
      }
      setQueryResult(query);
      setIsLoading(false);
    } catch (err) {
      query = 'enter valid query';
    }
  }, [props?.queryByAi ]);


  const handleClick = async () => {
    setIsLoading(true);
  
    props?.setQueryByAi(false);
    const response = await getQueryByAi(params?.dbId, params?.tableName, { userQuery: text })
    props?.setQueryByAi({
    pgQuery:  response?.data?.data , 
    userQuery : html
    });

  };

  return (
    <Box>
      <Box>
        Write a query in a human-friendly way to manipulate the column, and the resultant query will be given to you!
      </Box>
      <CustomAutoSuggest
       editableDivRef={editableDivRef}
       symbolForSearching={' '}
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
    { !isLoading && <Button onClick={handleClick} color="primary">
        Ask AI
      </Button>
}
      {isLoading &&  <Box className="formulaDataType-loading" >
        <CircularProgress />
      </Box>}

      {props?.queryByAi && (
        <CustomTextField
          autoFocus
          margin="dense"
          id="text-field"
          label="Query by AI"
          type="text"
          readOnly="readonly"
          placeholder="Resultant query"
          value={queryResult}
          fullWidth
        />
      )}


    </Box>
  );
}

FormulaDataType.propTypes = {
  queryByAi: PropTypes.any,
  setQueryByAi: PropTypes.any,
  submitData: PropTypes.func,
  queryResult: PropTypes.any,
  setQueryResult: PropTypes.any,
};
