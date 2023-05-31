/* eslint-disable */
import * as React from 'react';
import PropTypes from 'prop-types';
import useAutocomplete from '@mui/base/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { getTableInfo } from "../store/table/tableSelector";
import { useDispatch, useSelector } from "react-redux";
import './TableCellMultiSelect.css'
import { updateCells, updateMultiSelectOptions } from "../store/table/tableThunk";
const Root = styled('div')(
  ({ theme }) => `
  color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'
    };
  font-size: 14px;
  overflow-y:hidden;
 

`,
);


const InputWrapper = styled('div')(
  ({ theme }) => `
  
  overflow:hidden;
  padding: 1px;
  display: flex;
  flex-wrap: nowrap;

  &::-webkit-scrollbar {
    display: none !important;
  }
  &:hover {
    border-color: ${theme.palette.mode === 'dark' ? '#177DDC' : '#40A9FF'};
  }
  &.focused {
    border-color: ${theme.palette.mode === 'dark' ? '#177DDC' : '#40A9FF'};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    color: ${
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'
    };
    height: 28px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`,
);

function Tag(props) {
  const dispatch = useDispatch();
  const handleDeleteChip = (value) => {
    const rowtodel = (parseInt(props?.row?.id) || 0) + 1;
    dispatch(
      updateCells({
        columnId: props?.colid,
        rowIndex: rowtodel || props?.row.original?.["fld"+props?.tableId?.substring(3)+"autonumber"],
        value: { delete: value },
        dataTypes: "multipleselect"
      })
    )
  };
  const { label, onDelete, rowid, colid, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={() => { handleDeleteChip(label) }} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const StyledTag = styled(Tag)(
  ({ theme }) => `
 : display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: ${
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#FAFAFA'
  };
  border: 1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#E8E8E8'};
  border-radius 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  &::-webkit-scrollbar {
    display: none;
  }

  width:fit-content;







  &:focus {
    border-color: ${theme.palette.mode === 'dark' ? '#177DDC' : '#40A9FF'};
    background-color: ${theme.palette.mode === 'dark' ? '#003B57' : '#E6F7FF'};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`,
);

const Listbox = styled('ul')(
  ({ theme }) => `
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  &::-webkit-scrollbar {
    display: none;
  }



  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === 'dark' ? '#2B2B2B' : '#FAFAFA'};
    font-weight: 600;

    & svg {
      color: #1890FF;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === 'dark' ? '#003B57' : '#E6F7FF'};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`,
);

export default function TableCellMultiSelect(props) {
  
  const colors = ["#FFD4DF", "#CCE0FE", "#CEF5D2","whitesmoke","cadetblue"];
  
  function getRandomColor(colors) {
    let index=colors.indexOf(top100Films.slice(-1)[0]?.color)+1;
    index=index%colors.length;
    return colors[index];
  }
  const tableInfo = useSelector((state) => getTableInfo(state));
  const metaDataArray = tableInfo?.columns.filter(obj => { return obj.id === props?.colid });
  const top100Films = metaDataArray[0]?.metadata?.option || []
  const dispatch = useDispatch();
  
  const handleChipChange = (event, value) => {

    if(event.key==="Backspace")
    {
      let delval=props?.value.slice(-1)[0];
      dispatch(updateCells({
        columnId: props?.colid,
        rowIndex: props?.rowid || props?.row.original?.["fld"+props?.tableId.substring(3)+"autonumber"],
        value: {delete:delval},
        dataTypes: "multipleselect"
     } ))
      return;
    }
    let diffArr = value.filter((elem) => !props?.value.includes(elem))
    .concat(props?.value.filter((elem) => !value.includes(elem)));

   
   
      
    if (event.target.value && !props?.value.includes(event.target.value)) {
     
      const data={value:event?.target?.value,color:getRandomColor(colors)};
      const updatedMetadata = [...top100Films, data];
      dispatch(updateMultiSelectOptions({
        dbId: tableInfo?.dbId,
        tableName: tableInfo?.tableId,
        fieldName: props?.colid,
        columnId: props?.colid,
        dataTypes: "multipleselect",
        metaData: updatedMetadata,
      }));
    
      dispatch(
        updateCells({
          columnId: props?.colid,
          rowIndex: props?.rowid || props?.row.original?.["fld"+props?.tableId.substring(3)+"autonumber"],
          value: event.target.value || diffArr[0],
          dataTypes: "multipleselect"
        })
      )
    }
      
      else{
   value= value.pop();
   if(!props?.value?.includes(diffArr[0].value))
   {
       dispatch(
        updateCells({
          columnId: props?.colid,
          rowIndex: props?.rowid || props?.row.original?.["fld"+props?.tableId.substring(3)+"autonumber"],
          value:diffArr[0].value || "",
          dataTypes: "multipleselect"
        })
      )
   }
      }
  };
  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'customized-hook-demo',
    freeSolo: true,
    filterSelectedOptions :true,
    defaultValue: props?.value?.length > 0 ? props?.value : [],
    onChange: handleChipChange,
    multiple: true,
    options: top100Films.filter(x=>!props?.value?.includes(x.value)),
    getOptionLabel: (option) => `${option.value} (${option.color})`

  });
  return (
    <Root id="root">
      <div {...getRootProps()}>
        <InputWrapper style={{display:"flex",flexWrap:"nowrap",overflowX:"hidden",overflowY:'hidden',width:`${props?.width-10}px`}} ref={setAnchorEl} className={focused ? 'focused' : ''}>
          
        <div style={{display:"flex",overflowX:"scroll",overflowY:"hidden",paddingBottom:"10px"}}>
          {value.map((option, index) => (
            <StyledTag row ={props?.row} rowid={props?.rowid} colid={props?.colid} style={{backgroundColor:`${top100Films.find(x=>x.value===option)?.color}`}} key={index} label={option} {...getTagProps({ index })} />
          ))}
         
          </div>
          <input {...getInputProps()} style={{backgroundColor:"transparent"}} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <li key={index} style={{backgroundColor:option?.color||""}} {...getOptionProps({ option, index })}>
              <span>{option?.value}</span>
              <CheckIcon fontSize="small" />
            </li>
          ))}
        </Listbox>
      ) : null}
    </Root>
  );
}

TableCellMultiSelect.propTypes = {
  setIsOpen: PropTypes.any,
  colid: PropTypes.any,
  rowid: PropTypes.any,
  value: PropTypes.any
 ,width:PropTypes.any
}