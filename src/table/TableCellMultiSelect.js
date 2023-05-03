import PropTypes from "prop-types";
import React, { useState, useRef } from 'react';
import { Popper, TextField, List, Chip } from '@mui/material';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { useDispatch, useSelector } from "react-redux";
import { getTableInfo } from "../store/table/tableSelector";
import { updateColumnHeaders } from "../store/table/tableThunk";
import { updateCells } from "../store/table/tableThunk";
import './TableCellMultiSelect.css'
function TableCellMultiSelect(props) {
    const colors = ["#FFD4DF", "#CCE0FE","maroon","#CEF5D2","#E0E2E6"];
   
  const tableInfo = useSelector((state) => getTableInfo(state));
  const metaDataArray = tableInfo?.columns?.filter(obj => { return obj?.id === props?.colid });
  const [arr, setArr] = useState(metaDataArray[0]?.metadata?.option || []);
  let values=props?.value && props?.value?.length>0 ? props?.value:[];
  console.log(values);
  const [searchText, setSearchText] = useState('');
  const [selectedChips, setSelectedChips] = useState(values?.map(x=> x.trim()));
  console.log(selectedChips);
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
  function getRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  }
  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleChipClick = (chip) => {
    console.log(chip);
    setSelectedChips([...selectedChips, chip]);
    setSearchText('');
    dispatch(
      updateCells({
        columnId: props?.colid,
        rowIndex: props?.rowid,
        value: chip.value,
        dataTypes: "multipleselect"
      })
    )
  };
  
  const handleAddChip = () => {
    if (searchText !== '') {
        const findo=arr.filter(x=>{x.value===searchText});
       
        if(findo?.length>0)
        {
      setSelectedChips([...selectedChips, findo]);
      dispatch(
        updateCells({
          columnId: props?.colid,
          rowIndex: props?.rowid,
          value: findo[0].value,
          dataTypes: "multipleselect"
        })
      )
    }
     
      else{
        const data={
            value:searchText,
            color:getRandomColor(colors)
        
        }
      
        setArr(prevArr => [...prevArr, data]);
        dispatch(updateColumnHeaders({
        dbId: tableInfo?.dbId,
        tableName: tableInfo?.tableId,
        fieldName: props?.colid,
        columnId: props?.colid,
        dataTypes: "multipleselect",
        metaData: [...arr, data] // pass the updated value of `arr`
      }))
    }
      setSearchText('');
    }
  };
  
  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddChip();
    }
  };

  const selChips = () => {
    
    return <div style={{display:"flex",flexWrap:"nowrap",overflowX:"auto"}}>
        {selectedChips && selectedChips?.map((chip, index) => (

<Chip ref={anchorRef} onKeyDown={handleKeyDown} onDelete={() => {}} key={index}   label={chip} />
))}
    </div>
  };

  const renderChips = () => {
    
    return arr
      .filter((chip) => {
        return !selectedChips?.includes(chip) ;
      })
      .map((chip) => {
        const isSelected = selectedChips?.includes(chip);

        return (
          <Chip
            key={chip?.value}
            label={chip?.value}
            clickable={!isSelected}
       
            onClick={() => {
              handleChipClick(chip);
            }}
            
            style={{ margin: '4px' ,backgroundColor:`${chip?.color}`}}
          />
        );
      });
  };

  return (
    <div style={{marginRight:"6px"}}>
      <div ref={anchorRef} onKeyDown={handleKeyDown} tabIndex={0}>
        {selectedChips?.length > 0 && selChips()}
        {selectedChips?.length === 0 && <div style={{width:"20px",height:"30px"}}></div>}
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

    </div>
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
