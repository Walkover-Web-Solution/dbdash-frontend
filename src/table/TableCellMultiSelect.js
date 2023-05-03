import PropTypes from "prop-types";
import React, { useState, useRef } from 'react';
import { Popper, TextField, List, Chip } from '@mui/material';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { useDispatch, useSelector } from "react-redux";
import { getTableInfo } from "../store/table/tableSelector";
import { updateColumnHeaders } from "../store/table/tableThunk";
import { updateCells } from "../store/table/tableThunk";
function TableCellMultiSelect(props) {

  const tableInfo = useSelector((state) => getTableInfo(state));
  const metaDataArray = tableInfo?.columns?.filter(obj => { return obj?.id === props?.colid });
  const [arr, setArr] = useState(metaDataArray[0]?.metadata?.option || []);
  let values=props?.value && props?.value?.length>0 ? props?.value:[];
  const [searchText, setSearchText] = useState('');
  const [selectedChips, setSelectedChips] = useState(values.map(x=>x.trim()));
  const anchorRef = useRef(null);
  const dispatch = useDispatch();

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace') {

      setSelectedChips((prevSelectedChips) => {
        const newSelectedChips = [...prevSelectedChips];
        newSelectedChips.pop();
        dispatch(
          updateCells({
            columnId: props?.colid,
            rowIndex: props?.rowid,
            value: newSelectedChips,
            dataTypes: "multipleselect"
          })
        )
        return newSelectedChips;

      });
    }
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleChipClick = (chip) => {
    setSelectedChips([...selectedChips, chip]);
    setSearchText('');
    dispatch(
      updateCells({
        columnId: props?.colid,
        rowIndex: props?.rowid,
        value: chip,
        dataTypes: "multipleselect"
      })
    )
  };

  const handleAddChip = () => {
    if (searchText !== '' && !selectedChips.includes(searchText)) {
      setSelectedChips([...selectedChips, searchText]);
      dispatch(
        updateCells({
          columnId: props?.colid,
          rowIndex: props?.rowid,
          value: searchText,
          dataTypes: "multipleselect"
        })
      )
      setArr(prevArr => [...prevArr, searchText]);
      dispatch(updateColumnHeaders({
        dbId: tableInfo?.dbId,
        tableName: tableInfo?.tableId,
        fieldName: props?.colid,
        columnId: props?.colid,
        dataTypes: "multipleselect",
        metaData: [...arr, searchText] // pass the updated value of `arr`
      }))
      setSearchText('');
    }
  };
  const handleDeleteChip = (chip) => {
    setArr(prevArr => {
      const updatedArr = prevArr?.filter(x => x !== chip);
      dispatch(updateColumnHeaders({
        dbId: tableInfo?.dbId,
        tableName: tableInfo?.tableId,
        fieldName: props?.colid,
        columnId: props?.colid,
        dataTypes: "multipleselect",
        metaData: updatedArr
      }));
      return updatedArr;
    });
  };
  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddChip();
    }
  };

  const selChips = () => {
    
    return selectedChips?.map((chip, index) => (
      <Chip ref={anchorRef} onKeyDown={handleKeyDown} key={index} label={chip} />
    ));
  };

  const renderChips = () => {
    return arr
      .filter((chip) => {
        return !selectedChips.includes(chip) && chip.toLowerCase().includes(searchText.toLowerCase());
      })
      .map((chip) => {
        const isSelected = selectedChips.includes(chip);

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
      <div ref={anchorRef} onKeyDown={handleKeyDown} tabIndex={0}>
        {selectedChips?.length > 0 && selChips()}
        {selectedChips?.length === 0 && 'Select...'}
      </div>
      <Popper open={props.isOpen} style={{ backgroundColor: "white", border: "1px solid blue", zIndex: "10", overflowY: "auto" }} anchorEl={anchorRef.current} placement="bottom-start">
        <ClickAwayListener onClickAway={() => props?.setIsOpen(false)}>
          <div style={{ padding: '2px' }}>
            <TextField
              label="Search or add chips"
              value={searchText}
              onChange={handleSearchTextChange}
              onKeyDown={handleSearchKeyDown}
            />
            <List>{renderChips()}</List>
          </div>
        </ClickAwayListener>
      </Popper>

    </>
  );
}

export default TableCellMultiSelect;
TableCellMultiSelect.propTypes = {
  rowid: PropTypes.any,
  colid: PropTypes.any,
  value: PropTypes.any,
  isOpen: PropTypes.any,
  setIsOpen: PropTypes.any,
}
