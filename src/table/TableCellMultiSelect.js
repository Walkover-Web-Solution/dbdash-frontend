import PropTypes from "prop-types";
import React, { useState, useRef } from 'react';
import { Popper, TextField, List, Chip} from '@material-ui/core';
import ClickAwayListener from '@mui/base/ClickAwayListener';
function TableCellMultiSelect(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedChips, setSelectedChips] = useState([]);
  const anchorRef = useRef(null);
  const handleClick = (event) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Backspace') {
      setSelectedChips((prevSelectedChips) => {
        const newSelectedChips = [...prevSelectedChips];
        newSelectedChips.pop();
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
  };
  const handleAddChip = () => {
    if (searchText !== '' && !selectedChips.includes(searchText)) {
      setSelectedChips([...selectedChips, searchText]);
      props?.chips.push(searchText);
      setSearchText('');
      console.log(props?.chips)
    }
  };
  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddChip();
    }
  };
   const selChips = () => {
    return selectedChips.map((chip, index) => (
      <Chip ref={anchorRef}  onKeyDown={handleKeyDown}  key={index} label={chip}  />
    ));
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
        {selectedChips.length>0 && selChips()}
        {selectedChips.length === 0 && 'Select...'}
      </div>
      <Popper open={isOpen} style={{backgroundColor:"white",zIndex:"10",overflowY:"auto"}}  anchorEl={anchorRef.current} placement="bottom-start">
          <ClickAwayListener onClickAway={() => setIsOpen(false)}>
          <div style={{ padding: '8px' }}>
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
TableCellMultiSelect.propTypes={
    chips:PropTypes.any
}