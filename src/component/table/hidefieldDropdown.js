import React from 'react';
import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { updateColumnHeaders } from '../../store/table/tableThunk';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input style={{ marginTop: "8px" }} type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

export default function HideFieldDropdown(props) {
  const params = useParams();
  const dispatch = useDispatch();

  const handleMenuClose = () => {
    props?.setMenuAnchorEl(null);
  };

  const hideColumn = async (columnId, isChecked) => {
  const metaData = { hide: isChecked ? "true" : "false" };

    dispatch(updateColumnHeaders({
      dbId: params?.dbId,
      tableName: params?.tableName,
      fieldName: columnId,
      columnId: columnId,
      metaData: metaData
    }));

  }

  return (

    <div>
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
        <div>
          <IndeterminateCheckbox {...props?.getToggleHideAllColumnsProps()} /> Hide All
        </div>

        {props?.columns?.slice(1, -1).map((column, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleMenuClose();
            }}
            sx={{
              fontSize: '12px',
              minHeight: 'auto',
              padding: '2px 8px',
            }}
          >
            <input type="checkbox" onClick={(event) => {
              hideColumn(column?.id, event.target.checked);
            }} {...column?.getToggleHiddenProps()} />{' '}
            {column.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.any
}
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';

HideFieldDropdown.propTypes = {
  setMenuAnchorEl: PropTypes.any,
  menuAnchorEl: PropTypes.any,
  columns: PropTypes.any,
  getToggleHideAllColumnsProps: PropTypes.any,
};
