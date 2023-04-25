import React, {useState } from 'react'
import { useSelector } from 'react-redux';
import { getAllTableInfo } from '../../../store/allTable/allTableSelector';
import { MenuItem, Select } from '@mui/material';
import PropTypes from 'prop-types';

export default function LoookupDataType(props) {

  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  const [openViewDropdown,setOpenViewDropdown] = useState(true);
  let foreignKey = AllTableInfo?.tables?.[props?.tableId]?.fields;
  if (foreignKey) {
    foreignKey = Object.entries(foreignKey).filter((fields) => fields[1]?.metaData?.foreignKey?.fieldId);
  }
  if(foreignKey?.length > 0 && !(props?.selectedFieldName)) {
    props?.setSelectedTable(foreignKey[0][1]?.metaData?.foreignKey?.tableId);
    props?.setSelectedFieldName(Object.entries(AllTableInfo?.tables[foreignKey[0][1]?.metaData?.foreignKey?.tableId]?.fields)[0][0]);
  }
  console.log("table", foreignKey[0][1]?.metaData?.foreignKey?.tableId)
  
console.log("aaj karke jaenge",props?.selectedFieldName)

  return (
    <>
    {foreignKey?.length==0 && <span style={{color:'red'}}>Create Foreign key first.</span> }

    {
    foreignKey?.length > 0 && (<Select
            labelId="select-label"
            id="select"
            value={ props?.linkedValueName ? Object.keys(props?.linkedValueName)[0] : foreignKey [0][0] }
            sx={{
              margin: 1,
              minWidth: 120,
            }}
            
            onChange={(e) =>{ 
              const selectedField = AllTableInfo.tables[props.tableId].fields[e.target.value];
              const selectedTable = selectedField.metaData.foreignKey.tableId;
              props.setSelectedTable(selectedTable);
              props.setLinkedValueName({
                [e.target.value]: selectedField
              });
              setOpenViewDropdown(true);
            }}
           
          >
              
            {
              Object.entries(AllTableInfo?.tables[props?.tableId].fields)?.filter((fields) => {
                if (fields[1]?.metaData?.foreignKey?.fieldId) {
                  return fields;
                }
              })
                .map((fields) =>
                (
                  <MenuItem key={fields[0]} value={fields[0]}>
                    {fields[1]?.fieldName}
                  </MenuItem>
                ))
            }
          </Select>
          )}

{openViewDropdown && (<Select
  labelId="select-label"
  id="select"
  value={props?.selectedFieldName}
  sx={{
    margin: 1,
    minWidth: 120,
  }}
  onChange={(e) => props?.setSelectedFieldName(e.target.value)}
>
  {AllTableInfo.tables[props?.linkedValueName[Object.keys(props?.linkedValueName)[0]]?.metaData?.foreignKey?.tableId ?? props?.selectedTable]?.fields && Object.entries(AllTableInfo.tables[props?.linkedValueName[Object.keys(props?.linkedValueName)[0]]?.metaData?.foreignKey?.tableId ?? props?.selectedTable]?.fields)?.map((fields) =>
    (
      <MenuItem key={fields[0]} value={fields[0]}>
        {fields[1]?.fieldName}
      </MenuItem>
    ))
  }
</Select>

          )}
    </>
  )
}

LoookupDataType.propTypes = {
    selectedTable: PropTypes.string,
    setSelectedTable: PropTypes.any,
    selectedFieldName:PropTypes.any,
    setSelectedFieldName:PropTypes.func,
    tableId:PropTypes.any,
    linkedValueName:PropTypes.any,
    setLinkedValueName:PropTypes.func
}