import PropTypes from "prop-types";
import React, { useState, useRef } from 'react';
import { Popper, TextField, List, Chip} from '@material-ui/core';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { useDispatch, useSelector } from "react-redux";
import { getTableInfo } from "../store/table/tableSelector";
import { updateColumnHeaders } from "../store/table/tableThunk";
import { updateCells } from "../store/table/tableThunk";
function TableCellMultiSelect(props) {

  const tableInfo=useSelector((state)=>getTableInfo(state));
  const metaDataArray = tableInfo?.columns?.filter(obj=>{ return obj?.id===props?.colid});
  const[arr,setArr]=useState(metaDataArray[0]?.metadata?.option || []);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [selectedChips, setSelectedChips] = useState(props?.value && props?.value?.length>0 ? props?.value:[]);
  const anchorRef = useRef(null);
  const  dispatch = useDispatch();
  
  const handleClick = (event) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace') {
                 
      setSelectedChips((prevSelectedChips) => {
        const newSelectedChips = [...prevSelectedChips];
        newSelectedChips.pop();
        dispatch(
          updateCells({
            columnId:props?.colid,
            rowIndex:props?.rowid,
            value:newSelectedChips,
            dataTypes:"singleselect"
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
        columnId:props?.colid,
        rowIndex:props?.rowid,
        value:chip,
        dataTypes:"multiselect"
      })
    )
  };

  const handleAddChip = () => {
    if (searchText !== '' && !selectedChips.includes(searchText)) {
      setSelectedChips([...selectedChips, searchText]);
      setArr(prevArr => [...prevArr, searchText]);
      dispatch(updateColumnHeaders({
        dbId: tableInfo?.dbId,
        tableName: tableInfo?.tableId,
        fieldName: props?.colid,
        columnId: props?.colid,
        dataTypes: "multiselect",
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
        dataTypes: "multiselect",
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
    return selectedChips.map((chip, index) => (
      <Chip ref={anchorRef}  onKeyDown={handleKeyDown}  key={index} label={chip}  />
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
        {selectedChips?.length>0 && selChips()}
        {selectedChips?.length === 0 && 'Select...'}
      </div>
      <Popper open={isOpen} style={{backgroundColor:"white", border:"1px solid blue",zIndex:"10",overflowY:"auto"}}  anchorEl={anchorRef.current} placement="bottom-start">
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
   
    rowid:PropTypes.any,
    colid:PropTypes.any,
    value:PropTypes.any,
  
}
