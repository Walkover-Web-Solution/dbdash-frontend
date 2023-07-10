import React, { useState } from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Select, MenuItem} from "@mui/material";

const data = [
  {
    filterCondition: "=",
    purpose: "Equal to",
    example: "Field 1",
    try: false,
  },
  {
    filterCondition: "!= or <>",
    purpose: "Not Equal to",
    example: "Field 2",
    try: false,
  },
  {
    filterCondition: "<",
    purpose: "Less than",
    example: "Field 3",
    try: false,
  },
  {
    filterCondition: "<=",
    purpose: "Less than or equal",
    example: "Field 4",
    try: false,
  },
  {
    filterCondition: ">",
    purpose: "Greater than",
    example: "Field 5",
    try: false,
  },
  {
    filterCondition: ">=",
    purpose: "Greater than or equal to",
    example: "Field 6",
    try: false,
  },
  {
    filterCondition: "BETWEEN",
    purpose: "Between a range",
    example: "Field 7",
    try: false,
  },
  // Add more data rows as needed
];

const FilterConditionTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowCheckboxClick = (row) => {
    const rowIndex = selectedRows.indexOf(row);
    if (rowIndex === -1) {
      setSelectedRows([...selectedRows, row]);
    } else {
      setSelectedRows(selectedRows.filter((r) => r !== row));
    }
  };

  const handleSelectChange = (event, row) => {
    // Handle the dropdown value change for the specific row
    const updatedData = data.map((item) => {
      if (item === row) {
        return {
          ...item,
          example: event.target.value,
        };
      }
      return item;
    });
    // Update the data with the new value
    // You can store the updated data in state or make an API call to update it
    console.log(updatedData);
  };

  return (
    <Table style={{ width: "80%", borderCollapse: "collapse" }}>
      <TableHead>
        <TableRow>
          <TableCell
            style={{
              backgroundColor: "#E6E6E6",
              fontWeight: "bold",
              border: "1px solid #000",
              padding: "8px",
            }}
          >
            Filter Condition
          </TableCell>
          <TableCell
            style={{
              backgroundColor: "#E6E6E6",
              fontWeight: "bold",
              border: "1px solid #000",
              padding: "8px",
            }}
          >
            Purpose
          </TableCell>
          <TableCell
            style={{
              backgroundColor: "#E6E6E6",
              fontWeight: "bold",
              border: "1px solid #000",
              padding: "8px",
            }}
          >
            Example
          </TableCell>
          <TableCell
            style={{
              backgroundColor: "#E6E6E6",
              fontWeight: "bold",
              border: "1px solid #000",
              padding: "8px",
            }}
          >
            Try
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.filterCondition} style={{ border: "1px solid #000" }}>
            <TableCell style={{ padding: "8px", border: "1px solid #000" }}>{row.filterCondition}</TableCell>
            <TableCell style={{ padding: "8px", border: "1px solid #000" }}>{row.purpose}</TableCell>
            <TableCell style={{ padding: "8px", border: "1px solid #000" }}>
              <Select value={row.example} onChange={(e) => handleSelectChange(e, row)}>
                <MenuItem value="Field 1">Field 1</MenuItem>
                <MenuItem value="Field 2">Field 2</MenuItem>
                <MenuItem value="Field 3">Field 3</MenuItem>
                <MenuItem value="Field 4">Field 4</MenuItem>
                <MenuItem value="Field 5">Field 5</MenuItem>
                <MenuItem value="Field 6">Field 1</MenuItem>
                <MenuItem value="Field 7">Field 2</MenuItem>
                {/* Add more menu items for dropdown options */}
              </Select>
              
            </TableCell>
            <TableCell style={{ padding: "8px", border: "1px solid #000" }}>
              <Checkbox checked={selectedRows.includes(row)} onClick={() => handleRowCheckboxClick(row)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FilterConditionTable;
