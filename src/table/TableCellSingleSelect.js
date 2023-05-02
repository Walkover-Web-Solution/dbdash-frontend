import PropTypes from "prop-types";
import React, { useState, useRef } from 'react';
import { Popper, TextField,  Chip, ClickAwayListener } from '@material-ui/core';

function TableCellSingleSelect(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedChips, setSelectedChips] = useState([]);
  const anchorRef = useRef(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace') {
      setSelectedChips([]);
    }
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleChipClick = (chip) => {
    setSelectedChips( chip);
    setSearchText('');
  };

  const handleAddChip = () => {
    if (searchText !== '' && !selectedChips.includes(searchText)) {
      setSelectedChips(searchText);
    
      props.chips.push(searchText); // add new chip to list of chips
      setSearchText('');
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddChip();
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
