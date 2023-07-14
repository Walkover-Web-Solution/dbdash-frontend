import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllTableInfo } from '../store/allTable/allTableSelector';
import { getQueryByAi } from '../api/fieldApi';
import CustomAutoSuggest from '../component/customAutoSuggest/customAutoSuggest';
import { ClickAwayListener } from '@mui/material';

export default function UpdateQueryPopup(props) {
  
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState();
  const [html, setHtml] = useState();
  const [text, setText] = useState();
  const [queryResult, setQueryResult] = useState();
  const editableDivRef  = useRef()
  // const userQuery = AllTableInfo.tables[params?.tableName]?.fields;
  useEffect(() => {
    const data = AllTableInfo.tables[params?.tableName]?.fields;
    var arr = [];
    Object.entries(data).map((fields) => {
      var json = {};
      json.name = fields[1].fieldName;
      json.content = fields[0];
      arr.push(json);
    });
    setSuggestions(arr);
  }, []);

  useEffect(() => {
    let query = props?.queryByAi;
    try {
      query = JSON.parse(query?.pgQuery)?.add_column?.new_column_name?.generated?.expression;

      setQueryResult(query);
      setIsLoading(false);
    } catch (err) {
      query = 'enter valid query';
    }
  }, [props?.queryByAi]);

  const handleClick = async () => {
    setIsLoading(true);

    props?.setQueryByAi(false);
    const response = await getQueryByAi(params?.dbId, params?.tableName, { userQuery: text });
    props?.setQueryByAi({
      pgQuery: response?.data?.data,
      userQuery: html
    });
  };

  const handleUpdateColumn = () => {
    // Call the necessary function or perform the required action to update the column
    // Example: props.submitData(columnData);
    props?.submitData(); 
    props.onClose();
  };

  return (
    <ClickAwayListener onClickAway={props?.onClose}>
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        padding: "20px",
        background: "#fff",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div>
        Write a query in a human-friendly way to manipulate the column, and the resultant query will be given to you!
      </div>
      <CustomAutoSuggest
        editableDivRef={editableDivRef}

        id={'editableDivid'}
        suggestion={suggestions}
        chipClass="chip"
        editableDivClass="editable-div"
        suggestionBoxClass="suggestionBox"
        setHtml={setHtml}
        setText={setText}
        defaultValue={props?.fields[props?.menu?.col]?.metadata?.userQuery}
        text={text}
        html={html}
        onEnterBtnEvent={handleClick}
        disable={false}
        groupByGroupName={false}
      />
      {!isLoading && (
        <button onClick={handleClick} style={{ color: 'blue', marginTop: '10px' }}>
          Ask AI
        </button>
      )}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
          <div>Loading...</div>
        </div>
      )}

      {props?.queryByAi && (
        <input
          autoFocus
          id="text-field"
          label="Query by AI"
          type="text"
          readOnly
          placeholder="Resultant query"
          value={queryResult}
          style={{ marginTop: '10px', width: '100%' }}
        />
      )}
     {props?.queryByAi &&(<button
        onClick={handleUpdateColumn}
        disabled={
          // Add your condition to disable the button if necessary
          // Example: errors.fieldName || props?.textValue?.length < 1 || props?.textValue?.length > 30
          false
        }
        style={{ marginTop: '10px' }}
      >
        Update Column
      </button>)}
    </div>
    </ClickAwayListener>
  );
}

UpdateQueryPopup.propTypes = {
  isOpen: PropTypes.any,
  onClose: PropTypes.any,
  queryByAi: PropTypes.any,
  handleClosePopup:PropTypes.any,
  setQueryByAi: PropTypes.any,
  submitData: PropTypes.func,
  queryResult: PropTypes.any,
  setQueryResult: PropTypes.any,
  menu:PropTypes.any,
  fields:PropTypes.any
};









