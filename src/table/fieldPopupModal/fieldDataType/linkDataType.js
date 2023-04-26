import React, { useState } from 'react'
import { MenuItem, Select, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getAllTableInfo } from '../../../store/allTable/allTableSelector';
import PropTypes from 'prop-types';

export default function LinkDataType(props) {

  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  const [showUniqueFieldsDropdown, setShowUniqueFieldsDropdown] = useState(true);
 
  const uniqueFields = AllTableInfo?.tables[props.selectedTable]?.fields && Object.entries(AllTableInfo?.tables[props.selectedTable]?.fields)?.filter((fields) => {
    if (fields[1]?.metaData?.unique) {
      return fields;
    }
  })
  if(!(props?.selectedFieldName) ) props?.setSelectedFieldName(uniqueFields[0][0])
  
  return (
    <>
      {
        AllTableInfo?.tables && Object.entries(AllTableInfo?.tables).length > 0 ?
          (
            <Select
            labelId="select-label"
            id="select"
            value={props?.selectedTable}
            sx={{ margin: 1, minWidth: 120 }}
            onChange={(event) => {
              const newSelectedTable = event.target.value;
              props.setSelectedTable(newSelectedTable);
              const newTableInfo = AllTableInfo?.tables[newSelectedTable];
              const newUniqueFields = newTableInfo?.fields && Object.entries(newTableInfo?.fields)?.filter((fields) => {
                if (fields[1]?.metaData?.unique) {
                  return fields;
                }
              });
              const newSelectedUniqueKey = newTableInfo?.uniqueKey || (newUniqueFields?.length > 0 ? newUniqueFields[0][0] : '');
              props.setSelectedFieldName(newSelectedUniqueKey);
              setShowUniqueFieldsDropdown(true);
            }}
          >
            {Object.entries(AllTableInfo?.tables).map((table, index) => (
              <MenuItem key={index} value={table[0]}>{table[1]?.tableName}</MenuItem>
            ))}
          </Select>
          ) :
          (<span style={{ color: 'red' }}>No unique Keys here</span>)}
     
      {
        showUniqueFieldsDropdown && uniqueFields.length > 0 ?
          (<Select
            labelId="select-label"
            id="select"
            value={props?.selectedFieldName || uniqueFields[0][0]}
            sx={{
              margin: 1,
              minWidth: 120,
            }}
            onChange={(e) => props?.setSelectedFieldName(e.target.value)}
          >
            {
              uniqueFields  
                .map((fields) =>
                (
                  <MenuItem key={fields[0]} value={fields[0]}>
                    {fields[1]?.fieldName}
                  </MenuItem>
                ))
            }
          </Select>
          ) : (
            showUniqueFieldsDropdown && <Typography sx={{ color: "red" }}>No unique key</Typography>
          )
      }
    </>
  )
}

LinkDataType.propTypes = {
  selectedTable: PropTypes.string,
  setSelectedTable: PropTypes.any,
  selectedFieldName:PropTypes.any,
  setSelectedFieldName:PropTypes.func,
}