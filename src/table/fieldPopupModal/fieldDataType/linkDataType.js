import React, {  useState } from 'react'
import { MenuItem, Select, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getAllTableInfo } from '../../../store/allTable/allTableSelector';
import PropTypes from 'prop-types';

export default function LinkDataType(props) {

  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  const tableId=useSelector((state)=>state.table.tableId);
  const [showUniqueFieldsDropdown, setShowUniqueFieldsDropdown] = useState(true);
 
  const uniqueFields = AllTableInfo?.tables[props?.selectedTable]?.fields && Object.entries(AllTableInfo?.tables[props?.selectedTable]?.fields)?.filter((fields) => {
    if (fields[1]?.metaData?.unique) {
      return fields;
    }
  })
  if(!(props?.selectedFieldName) && uniqueFields?.length > 0)
  {
    const index= Object.entries(AllTableInfo?.tables)
   const currentTableIndex = index.findIndex(([tableId]) => tableId === props.selectedTable);
   console.log("ansh",currentTableIndex)
    props.setSelectedTable( Object.entries(AllTableInfo?.tables)[currentTableIndex][0]);
    props?.setSelectedFieldName(uniqueFields[0][1])
  }

  return (
    <>
      {
        AllTableInfo?.tables && Object.entries(AllTableInfo?.tables)?.length - 1 > 0 && uniqueFields.length > 0 &&
          
            <Select
            labelId="select-label"
            id="select"
            value={props?.selectedTable}
            sx={{ margin: 1, minWidth: 120 }}
            onChange={(event) => {
              props.setSelectedTable(event.target.value);
              const newTableInfo = AllTableInfo?.tables[event.target.value];
              const newUniqueFields = newTableInfo?.fields && Object.entries(newTableInfo.fields)?.filter((fields) => {
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
              tableId !== table[0] && <MenuItem key={index} value={table[0]}>{table[1]?.tableName}</MenuItem>
            ))}
          </Select>
          }

     
      {
        showUniqueFieldsDropdown && uniqueFields.length > 0 && props.selectedTable !== tableId ?
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
            showUniqueFieldsDropdown && props.selectedTable !== tableId &&  <Typography sx={{ color: "red" }}>No unique key</Typography>
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