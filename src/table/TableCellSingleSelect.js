import PropTypes from "prop-types";
import React, { useState, useRef } from 'react';
import { Popper, TextField,  Chip, ClickAwayListener } from '@material-ui/core';

import { useDispatch} from "react-redux";
import { updateColumnHeaders } from "../store/table/tableThunk";
// import { getTableInfo } from "../store/table/tableSelector";

function TableCellSingleSelect(props) {
    // console.log('props',props)
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedChips, setSelectedChips] = useState([]);
  const anchorRef = useRef(null);
const  dispatch = useDispatch();
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Backspace') {
      setSelectedChips([]);
    }
    console.log(event.key)
  };
  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };
  const handleChipClick = (chip) => {
    setSelectedChips( chip);
    setSearchText('');
  };
//   const handleAddChip = () => {
//     if (searchText !== '' && !selectedChips.includes(searchText)) {
//       setSelectedChips(searchText);
//       props.chips.push(searchText); // add new chip to list of chips
//       setSearchText('');
//     }
//   };
  const handleSearchKeyDown = (event) => {
    console.log('random',event.key)
    if (event.key === 'Enter') {
        dispatch(
            updateColumnHeaders({
        dbId:"6448ccf237ab83c769ceca99",
        tableName:"tbltbtmfy",
        fieldName:"fldq7ud1n",
        columnId: "fldq7ud1n",
              dataTypes: "text",
              metaData:["test1","mmmm","djkjdsds"]
            }))
    //   handleAddChip();

    }
  };
  const renderChips = () => {
    return props.chips
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
            color={isSelected ? 'red' : 'green'}
            onClick={()=>{
              handleChipClick(chip);
            }}
            style={{ margin: '4px' }}
          />
        );
      });
  };
  return (
    <>
      <div ref={anchorRef} onClick={handleClick} onKeyDown={handleKeyDown} tabIndex={0}>
        {selectedChips.length > 0 ?  <Chip key={selectedChips} label={selectedChips}  />: 'Select...'}
      </div>
      <Popper open={isOpen} style={{backgroundColor:"white",zIndex:"10",overflowY:"auto"}} anchorEl={anchorRef.current} placement="bottom-start">
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
          <div style={{ padding: '8px' }}>
            <TextField
              label="Search or add chips"
              value={searchText}
              onChange={handleSearchTextChange}
              onKeyDown={handleSearchKeyDown}
            />
            <div style={{ marginTop: '8px' }}>{renderChips()}</div>
          </div>
        </ClickAwayListener>
      </Popper>
    </>
  );
}
export default TableCellSingleSelect;
TableCellSingleSelect.propTypes={
    chips:PropTypes.any
}