import * as React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { getTableInfo } from "../../store/table/tableSelector";
import { useDispatch, useSelector } from "react-redux";
import { updateCells, updateColumnHeaders } from "../../store/table/tableThunk";
import { cloneDeep } from 'lodash';
import './TableCellSingleSelect.css';

export default function TableCellSingleSelect(props) {
  const tableInfo = useSelector((state) => getTableInfo(state));
  const metaDataArray = tableInfo?.columns.filter(obj => obj.id === props?.colid);
  const top100Films = cloneDeep(metaDataArray[0]?.metadata?.option || []);
  const [value, setValue] = useState(props?.value);
  const dispatch = useDispatch();

  const handleChipChange = (event, newValue) => {
    if (newValue == null) {
      dispatch(
        updateCells({
          columnId: props?.colid,
          rowIndex: props?.rowid || props?.row.original?.["fld" + props?.tableId.substring(3) + "autonumber"],
          value: newValue || "",
          dataTypes: "singleselect"
        })
      );
      return;
    }
    setValue(newValue);
    if (top100Films.includes(newValue)) {
      dispatch(
        updateCells({
          columnId: props?.colid,
          rowIndex: props?.rowid || props?.row.original?.["fld" + props?.tableId.substring(3) + "autonumber"],
          value: newValue || "",
          dataTypes: "singleselect"
        })
      );
    } else {
      const updatedMetadata = [...top100Films, newValue];
      dispatch(
        updateColumnHeaders({
          dbId: tableInfo?.dbId,
          tableName: tableInfo?.tableId,
          columnId: props?.colid,
          dataTypes: "singleselect",
          metaData: { option: updatedMetadata },
        })
      );
      dispatch(
        updateCells({
          columnId: props?.colid,
          rowIndex: props?.rowid || props?.row.original?.["fld" + props?.tableId.substring(3) + "autonumber"],
          value: newValue || "",
          dataTypes: "singleselect"
        })
      );
    }
  };

  return (
    <Autocomplete
      id="country-select-demo"
      value={value}
      onChange={handleChipChange}
      options={top100Films}
      freeSolo={true}
      getOptionLabel={(option) => option}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            style: { height: 1 },
          }}
        />
      )}
    />
  );
}

TableCellSingleSelect.propTypes = {
  setIsOpen: PropTypes.any,
  colid: PropTypes.any,
  rowid: PropTypes.any,
  value: PropTypes.any,
  metaData: PropTypes.any
};
