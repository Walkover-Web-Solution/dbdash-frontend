import PropTypes from "prop-types";
import React, { useState, useRef } from 'react';
import { Popper, TextField, Chip, ClickAwayListener } from '@mui/material';
import { getTableInfo } from "../store/table/tableSelector";
import { updateCells } from "../store/table/tableThunk";
import { useDispatch, useSelector } from "react-redux";
import { updateColumnHeaders } from "../store/table/tableThunk";
function TableCellSingleSelect(props) {

  const tableInfo = useSelector((state) => getTableInfo(state));
  const metaDataArray = tableInfo?.columns.filter(obj => { return obj.id === props?.colid });
  const [arr, setArr] = useState(metaDataArray[0]?.metadata?.option || []);
  const [searchText, setSearchText] = useState('');
  const [selectedChips, setSelectedChips] = useState(props?.value || "");
  const anchorRef = useRef(null);
  const dispatch = useDispatch();
  
  const handleKeyDown = (event) => {
    if (event.key === 'Backspace') {
      setSelectedChips("");
      dispatch(
        updateCells({
          columnId: props?.colid,
          rowIndex: props?.rowid,
          value: "",
          dataTypes: "singleselect"
        })
      )
    }
  };
  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };
  const handleDeleteChip = (chip) => {
    setArr(prevArr => {
      const updatedArr = prevArr.filter(x => x !== chip);
      dispatch(updateColumnHeaders({
        dbId: tableInfo?.dbId,
        tableName: tableInfo?.tableId,
        fieldName: props?.colid,
        columnId: props?.colid,
        dataTypes: "singleselect",
        metaData: updatedArr
      }));
      return updatedArr;
    });
  };
  const handleChipClick = (chip) => {
    setSelectedChips(chip);
    dispatch(
      updateCells({
        columnId: props?.colid,
        rowIndex: props?.rowid,
        value: chip,
        dataTypes: "singleselect"
      })
    )
    setSearchText('');
  };
  
  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      dispatch(
        updateCells({
          columnId: props?.colid,
          rowIndex: props?.rowid,
          value: searchText,
          dataTypes: "singleselect"
        })
      )
      setArr(prevArr => [...prevArr, searchText]); // update the state using a callback function
      setSelectedChips(searchText);
      dispatch(updateColumnHeaders({
        dbId: tableInfo?.dbId,
        tableName: tableInfo?.tableId,
        fieldName: props?.colid,
        columnId: props?.colid,
        dataTypes: "singleselect",
        metaData: [...arr, searchText] // pass the updated value of `arr`
      }))
    }
  };
  const renderChips = () => {
    return arr
      .filter((chip) => {
        return selectedChips !== chip && chip.toLowerCase().includes(searchText.toLowerCase());
      })
      .map((chip) => {
        const isSelected = selectedChips === chip;
        return (
          <Chip
            key={chip}
            label={chip}
            clickable={!isSelected}
            color={isSelected ? 'error' : 'success'}
            onClick={() => {
              handleChipClick(chip);
            }}
            onDelete={() => {
              handleDeleteChip(chip);
            }}
            style={{ margin: '4px' }}
          />
        );
      });
  };
  return (
    <>
      <div ref={anchorRef}  onKeyDown={handleKeyDown} tabIndex={0}>
        {props?.value?.length > 0 ? <Chip key={selectedChips} label={selectedChips} /> : 'Select'}
        </div>
      <Popper open={props.isOpen} style={{ backgroundColor: "white", zIndex: "10", overflowY: "auto" }} anchorEl={anchorRef.current} placement="bottom-start">
        <ClickAwayListener onClickAway={() => props.setIsOpen(false)}>
          <div style={{ padding: '8px' }}>
          <TextField
              label="Search or add chips"
              value={searchText}
              onChange={handleSearchTextChange}
              onKeyDown={handleSearchKeyDown}
            />
            <div style={{ marginTop: '2px' }}>{renderChips()}</div>
          </div>
        </ClickAwayListener>
      </Popper>  
    </>
  );
}
export default TableCellSingleSelect;
TableCellSingleSelect.propTypes = {
  chips: PropTypes.any,
  isOpen: PropTypes.any,
  setIsOpen: PropTypes.any,
  colid: PropTypes.any,
  rowid: PropTypes.any,
  value: PropTypes.any
}
