import * as React from 'react';
import PropTypes from 'prop-types';
import useAutocomplete from '@mui/base/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { getTableInfo } from "../../store/table/tableSelector";
import { useDispatch, useSelector } from "react-redux";
import './TableCellMultiSelect.css';
import { updateCells, updateMultiSelectOptions } from "../../store/table/tableThunk";

export default function TableCellMultiSelect(props) {
  const colors = ["#FFD4DF", "#CCE0FE", "#CEF5D2","whitesmoke","cadetblue"];

  function getRandomColor(colors) {
    let index = colors.indexOf(top100Films.slice(-1)[0]?.color) + 1;
    index = index % colors.length;
    return colors[index];
  }

  const tableInfo = useSelector((state) => getTableInfo(state));
  const metaDataArray = tableInfo?.columns.filter(obj => obj.id === props?.colid);
  const top100Films = metaDataArray[0]?.metadata?.option || [];
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
    );
  };

  const handleChipChange = (event, value) => {
    if (event.key === "Backspace") {
      let delval = props?.value.slice(-1)[0];
      dispatch(
        updateCells({
          columnId: props?.colid,
          rowIndex: props?.rowid || props?.row.original?.["fld"+props?.tableId.substring(3)+"autonumber"],
          value: { delete: delval },
          dataTypes: "multipleselect"
        })
      );
      return;
    }
    let diffArr = value.filter((elem) => !props?.value.includes(elem))
      .concat(props?.value.filter((elem) => !value.includes(elem)));

    if (event.target.value && !props?.value.includes(event.target.value)) {
      const data = { value: event?.target?.value, color: getRandomColor(colors) };
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
      );
    } else {
      value = value.pop();
      if (!props?.value?.includes(diffArr[0]?.value)) {
        dispatch(
          updateCells({
            columnId: props?.colid,
            rowIndex: props?.rowid || props?.row.original?.["fld"+props?.tableId.substring(3)+"autonumber"],
            value: diffArr[0]?.value || "",
            dataTypes: "multipleselect"
          })
        );
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
    filterSelectedOptions: true,
    defaultValue: props?.value?.length > 0 ? props?.value : [],
    onChange: handleChipChange,
    multiple: true,
    options: top100Films.filter(x => !props?.value?.includes(x.value)),
    getOptionLabel: (option) => `${option.value} (${option.color})`
  });

  return (
    <div className="root" id="root" {...getRootProps()}>
      <div className={`input-wrapper${focused ? ' focused' : ''}`} ref={setAnchorEl}>
        <div className="tag-wrapper">
          {value.map((option, index) => (
            <div
              key={index}
              className="tag"
              style={{ backgroundColor: `${top100Films.find(x => x.value === option)?.color}` }}
              {...getTagProps({ index })}
            >
              <span>{option}</span>
              <CloseIcon onClick={() => handleDeleteChip(option)} />
            </div>
          ))}
        </div>
        <input className="input" {...getInputProps()} />
      </div>
      {groupedOptions.length > 0 && (
        <ul className="listbox" {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <li
              key={index}
              className={`option${option?.color ? ' option-colored' : ''}`}
              style={{ backgroundColor: option?.color || "" }}
              {...getOptionProps({ option, index })}
            >
              <span>{option?.value}</span>
              <CheckIcon fontSize="small" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

TableCellMultiSelect.propTypes = {
  setIsOpen: PropTypes.any,
  colid: PropTypes.any,
  rowid: PropTypes.any,
  value: PropTypes.any,
  width: PropTypes.any
};
