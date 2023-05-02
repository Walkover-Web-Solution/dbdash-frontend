import PropTypes from "prop-types";
import React, { useState, useRef } from 'react';
import { Popper, TextField,  Chip, ClickAwayListener } from '@material-ui/core';
import { getTableInfo } from "../store/table/tableSelector";

import { useDispatch, useSelector} from "react-redux";
import { updateColumnHeaders } from "../store/table/tableThunk";
// import { getTableInfo } from "../store/table/tableSelector";

function TableCellSingleSelect(props) {
  const tableInfo=useSelector((state)=>getTableInfo(state));
  // console.log(props?.colid)
  const metaDataArray = tableInfo?.columns.filter(obj=>{ return obj.id===props?.colid});
  const[arr,setArr]=useState(metaDataArray[0]?.metadata?.option || []);
 
  const[isOpen,setIsOpen]=useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedChips, setSelectedChips] = useState([]);
  const anchorRef = useRef(null);
const  dispatch = useDispatch();
  const handleClick = () => {
   setIsOpen(!isOpen);
   

 
    console.log(arr);
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Backspace') {
      setSelectedChips([]);
    }
  };
  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);

  };const handleDeleteChip = (chip) => {
    setArr(prevArr => prevArr.filter(x => x !== chip), () => {
      console.log(arr); // logs the updated state of `arr` after the `chip` has been filtered out
      
      dispatch(updateColumnHeaders({
        dbId: tableInfo?.dbId,
        tableName: tableInfo?.tableId,
        fieldName: props?.colid,
        columnId: props?.colid,
        dataTypes: "singleselect",
        metaData: arr 
      }));
    });
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
  if (event.key === 'Enter') {
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
            onDelete={()=>{
              handleDeleteChip(chip);
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
    chips:PropTypes.any,
    
    isOpen:PropTypes.any,
    setIsOpen:PropTypes.any,
  
    colid:PropTypes.any
}