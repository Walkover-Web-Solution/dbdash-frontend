import React, { useState } from 'react'
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
  const var1 = AllTableInfo.tables[props?.selectedTable]?.fields
  console.log("first",var1)

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
              props?.setLinkedValueName({
                [e.target.value]:AllTableInfo?.tables[props?.tableId]?.fields[e.target.value]
              })
              props?.setSelectedTable(AllTableInfo?.tables[props?.tableId]?.fields[e.target.value]?.metaData?.foreignKey?.tableId) ; 
              setOpenViewDropdown(true)}}
           
          >
              
            {
              Object.entries(AllTableInfo?.tables[props?.tableId].fields)?.filter((fields) => {
                if (fields[1]?.metaData?.foreignKey?.fieldId) {
                  props?.setSelectedFieldName(fields[1]?.metaData?.foreignKey?.fieldId)
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
            value={
              AllTableInfo.tables[props?.selectedTable]?.fields
                ? Object.entries(AllTableInfo.tables[props?.selectedTable]?.fields)[0][0]
                : AllTableInfo.tables[props?.selectedTable]?.fields && Object.keys(AllTableInfo.tables[props?.selectedTable]?.fields)[0]
            }            
            // value={props?.selectedFieldName }        
            sx={{
              margin: 1,
              minWidth: 120,
            }}
            onChange={(e) => props?.setSelectedFieldName(e.target.value)}
          >
            {
             AllTableInfo.tables[props?.selectedTable]?.fields &&  Object.entries(AllTableInfo.tables[props?.selectedTable]?.fields)?.map((fields) =>
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