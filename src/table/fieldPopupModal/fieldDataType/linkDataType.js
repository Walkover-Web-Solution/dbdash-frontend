import React, { useState } from 'react'
import { MenuItem, Select, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getAllTableInfo } from '../../../store/allTable/allTableSelector';
import PropTypes from 'prop-types';
import { cloneDeep } from "lodash";
import { useEffect } from 'react';


export default function LinkDataType(props) {
  const allTables = useSelector((state) => getAllTableInfo(state));
  // const tableId = useSelector((state) => state.table.tableId);
  const AllTableInfo = cloneDeep(allTables)
  // delete AllTableInfo?.tables[tableId]
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
    <>
      {
        AllTableInfo?.tables   &&
        <Select
          labelId="select-label"
          id="select"
          value={props?.selectedTable}
          sx={{ margin: 1, minWidth: 120 }}
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

    </>
  )
}

LinkDataType.propTypes = {
  selectedTable: PropTypes.string,
  setSelectedTable: PropTypes.any,
  selectedFieldName: PropTypes.any,
  setSelectedFieldName: PropTypes.func,
}