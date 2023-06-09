import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { updateColumnHeaders } from '../../store/table/tableThunk';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTableInfo } from "../../store/allTable/allTableSelector";

export default function HideFieldDropdown(props) {
  const params = useParams();
  const dispatch = useDispatch();
  const fields1 = useSelector((state) => state.table.columns);
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  
  const [checkedColumns, setCheckedColumns] = useState([]);
  const tableFieldArray = AllTableInfo?.tables[params?.tableName]?.fields
  
  for (const key in tableFieldArray) {
      tableFieldArray[key].metaData;
  }
  let defaultArr= fields1.map((column) => {
    return column?.metadata && column?.metadata?.hide ? (column?.metadata?.hide=="true"?true:false)  : false;
  });

  const handleMenuClose = () => {
    props?.setMenuAnchorEl(null);
  };

  const toggleColumn = (columnId) => {
    setCheckedColumns((prevCheckedColumns) => {
      if (prevCheckedColumns.includes(columnId)) {
        return prevCheckedColumns.filter((id) => id !== columnId);
      } else {
        return [...prevCheckedColumns, columnId];
      }
    });
    hideColumn(columnId, !checkedColumns.includes(columnId));
  };

  const hideColumn = async (columnId, isChecked) => {
    const metaData = { hide: isChecked ? "false" : "true" };
    dispatch(
      updateColumnHeaders({
        dbId: params?.dbId,
        tableName: params?.tableName,
        columnId: columnId,
        metaData: metaData,
      })
    );
  };

  return (<>
    {fields1 && <div>
      <Menu
        anchorEl={props?.menuAnchorEl}
        open={Boolean(props?.menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          style: {
            maxHeight: '200px',
            width: '200px',
            padding: '0',
          },
        }}
      >
        {fields1?.map((column, index) => (
          <MenuItem
            key={index}
            sx={{
              fontSize: '12px',
              minHeight: 'auto',
              padding: '2px 8px',
            }}
          >
            <input style={{width: "15px", height: "15px"}}
              type="checkbox"
              checked={defaultArr[index]}
              onChange={() => toggleColumn(column?.id)}
            />
            {column?.title}
          </MenuItem>
        ))}
      </Menu>
    </div>}
    </>
  );
}

HideFieldDropdown.propTypes = {
  setMenuAnchorEl: PropTypes.any,
  menuAnchorEl: PropTypes.any,
};
