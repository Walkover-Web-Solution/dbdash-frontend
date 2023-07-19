import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Link,
  Typography,
  Button,
} from "@mui/material";
import { PropTypes } from "prop-types";
import './optionalParameter.scss'

const data = [
    {
      filterCondition: "=",
      purpose: "Equal to",
      example: "=10",
      try: false,
    },
    {
      filterCondition: "!= or <>",
      purpose: "Not Equal to",
      example: "!='John'",
      try: false,
    },
    {
      filterCondition: "<",
      purpose: "Less than",
      example: "<50",
      try: false,
    },
    {
      filterCondition: "<=",
      purpose: "Less than or equal",
      example: "<=100",
      try: false,
    },
    {
      filterCondition: ">",
      purpose: "Greater than",
      example: ">5",
      try: false,
    },
    {
      filterCondition: ">=",
      purpose: "Greater than or equal to",
      example: ">=20",
      try: false,
    },
    {
      filterCondition: "BETWEEN",
      purpose: "BETWEEN a range",
      example: " between 10 and 20",
      try: false,
    },
    {
      filterCondition: "IN",
      purpose: "Matches any value in a list",
      example: " IN ('John', 'Jane', 'Jim')",
      try: false,
    },
    {
      filterCondition: "NOT IN",
      purpose: "Does not match any value in a list",
      example: " NOT IN ('John', 'Jane', 'Jim')",
      try: false,
    },
    {
      filterCondition: "IS NULL",
      purpose: "Matches null value",
      example: " fieldID1 IS NULL",
      try: false,
    },
    {
      filterCondition: "IS NOT NULL",
      purpose: "Matches non-null value",
      example: " fieldID1 IS NOT NULL",
      try: false,
    },
    {
      filterCondition: "LIKE",
      purpose: "Matches a pattern using wildcard characters",
      example: " fieldID3 LIKE 'App%'",
      try: false,
    },
    {
      filterCondition: "NOT LIKE",
      purpose: "Does not match a pattern",
      example: " fieldID3 NOT LIKE 'App%'",
      try: false,
    },
    // Add more data rows as needed
  
];
const FilterConditionTable = (props) => {
  const [rowfieldData, setRowFieldData] = useState(null);
  const[filter,setFilter]=useState({});
  const[showMore,setShowMore]=useState(false);

  useEffect(() => {
    tableData();
  }, []);
  const tableData = async () => {
    setRowFieldData(props?.alltabledata[props?.table]?.fields);
    let obj={};
   data.map(element=>{
    obj[element.filterCondition]=Object.entries(props?.alltabledata[props?.table]?.fields)?.[0][0];
   })
   setFilter(obj);
  };
  const handleRowCheckboxClick = ( string) => {
    
    props?.setSelectedRows(string);
  };
  
  const handleSelectChange = (condition,event,text) => {
    
    let obj=filter;
    obj[condition]=event.target.value;
setFilter(obj);
props?.setSelectedRows(event.target.value+text);
  };
  return (
    <Table className="filter-condition-main-table">
      <TableHead>
      <TableCell className="filter-condition-table-head-table-cell" >
Filter Conditions            
</TableCell>
<TableCell className="filter-condition-table-head-table-cell" >
Purpose            
</TableCell>
<TableCell className="filter-condition-table-head-table-cell" >
Example            
</TableCell>

      </TableHead>
      <TableBody>
        {data.map((row,index) => {
           if (!showMore && index >= 6) {
            return null; // Skip rendering the remaining rows
          }
          return(
          <TableRow className="filter-condition-table-body-table-row" key={row.filterCondition} >
            <TableCell className="filter-condition-table-body-table-row-cell" >
              {row.filterCondition}
            </TableCell>
            <TableCell className="filter-condition-table-body-table-row-cell">
              {row.purpose}
            </TableCell>
            <TableCell
  className="hoverable-cell filter-condition-table-body-table-row-cell"
>
              <div className="ilter-condition-div">
              {rowfieldData &&   <Select
                  defaultValue={Object.entries(rowfieldData)?.[0][0]} 
                  onChange={(e)=>{handleSelectChange(row.filterCondition,e,row.example)}}
                >

                    {Object.entries(rowfieldData)?.map((field, index) => (
                      <MenuItem key={index} value={field[0]} >
                        {field[1].fieldName}
                      </MenuItem>
                    ))}
                </Select>}
                <Typography className="row-example">
                  {row.example}
                </Typography>
                <Button className="mui-button-outlined  add-button"
                
                onClick={() =>{  
                  const string=filter[row.filterCondition]+row.example;
                  handleRowCheckboxClick(string)
                  props?.textfieldref.current?.scrollIntoView({behavior:'smooth'});
                  }}
             
                >Add</Button>
              </div>
              
            </TableCell>
          
          </TableRow>
        )})}
      </TableBody>
      {!showMore ?<Link href="#"className="table-body-show-more" onClick={()=>setShowMore(true)}>More....</Link>:<Link href="#" className="table-body-show-more"  onClick={()=>setShowMore(false)}>Less....</Link>}
    </Table>
  );
};
FilterConditionTable.propTypes = {
  alltabledata: PropTypes.any,
  table: PropTypes.string,
  selectedRows:PropTypes.any,
  textfieldref:PropTypes.any,
  setSelectedRows:PropTypes.any,
  db: PropTypes.string,
};
export default FilterConditionTable;