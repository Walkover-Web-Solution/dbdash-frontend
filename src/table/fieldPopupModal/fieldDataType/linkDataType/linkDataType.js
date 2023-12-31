import React, { useState } from 'react'
import { MenuItem, Select, Typography } from '@mui/material';
import { getAllTableInfo } from '../../../../store/allTable/allTableSelector';
import PropTypes from 'prop-types';
import { cloneDeep } from "lodash";
import { useEffect } from 'react';
import './linkDataType.scss'
import { customUseSelector } from '../../../../store/customUseSelector';


export default function LinkDataType(props) {
  const allTables = customUseSelector((state) => getAllTableInfo(state));
  const AllTableInfo = cloneDeep(allTables)
  const [showUniqueFieldsDropdown, setShowUniqueFieldsDropdown] = useState(true);
  let uniqueFields = AllTableInfo?.tables[props?.selectedTable]?.fields && Object.entries(AllTableInfo?.tables[props?.selectedTable]?.fields)?.filter((fields) => {
    if (fields[1]?.metaData?.unique) {
      return fields;
    }
  })
  useEffect(()=>{
    if(uniqueFields?.length > 0){
      props?.setSelectedFieldName(uniqueFields[0][0]);
    }
  },[props?.selectedTable])

  if(!(props?.selectedTable) ){
    props.setSelectedTable(Object.entries(AllTableInfo?.tables)?.[0]?.[0]);
  }


  return (
    <div>
      {
        AllTableInfo?.tables   &&
        <Select
          labelId="select-label"
          id="select"
          value={props?.selectedTable}
          className="linkDataType-div"
          onChange={(event) => {
            props.setSelectedTable(event.target.value);
            setShowUniqueFieldsDropdown(true);
          }}
        >
          {Object.entries(AllTableInfo?.tables).map((table, index) => (
            <MenuItem key={index} value={table[0]}>{table[1]?.tableName}</MenuItem>
          ))}
        </Select>
      }
{
  showUniqueFieldsDropdown && uniqueFields?.length > 0 && props?.selectedFieldName ? (
    <Select
      labelId="select-label"
      id="select"
      value={props?.selectedFieldName}
      sx={{
        margin: 1,
        minWidth: 120,
        marginLeft:0
      }}
      onChange={(e) => 
       {
        props?.setSelectedFieldName(e.target.value)}}
    >
      {uniqueFields.map((fields) => (
        <MenuItem key={fields[0]} value={fields[0]}>
          {fields[1]?.fieldName}
        </MenuItem>
      ))}
    </Select>
  ) : (
    showUniqueFieldsDropdown && (
      <Typography sx={{ color: "red" }}>No unique key</Typography>
    )
  )
}

    </div>
  )
}

LinkDataType.propTypes = {
  selectedTable: PropTypes.string,
  setSelectedTable: PropTypes.any,
  selectedFieldName: PropTypes.any,
  setSelectedFieldName: PropTypes.func,
}