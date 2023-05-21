import React from 'react';
// import { Checkbox } from '@mui/material';
import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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
  console.log(props,"props")
  // const [selectedColumns, setSelectedColumns] = useState([]);

  const handleMenuClose = () => {
    props?.setMenuAnchorEl(null);
  };

  // const handleCheckboxChange = (column) => (event) => {
  //   if (event.target.checked) {
  //     setSelectedColumns((prevSelectedColumns) => [...prevSelectedColumns, column]);
  //   } else {
  //     setSelectedColumns((prevSelectedColumns) => prevSelectedColumns.filter((col) => col !== column));
  //   }
  // };

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
        {props?.columns?.slice(1, -1).map((column, index) => (
          <MenuItem
            key={index}
            onClick={handleMenuClose}
            sx={{
              fontSize: '12px',
              minHeight: 'auto',
              padding: '2px 8px',
            }}
          >
            {/* <Checkbox
              checked={selectedColumns?.includes(column)}
              onChange={handleCheckboxChange(column)}
              size="small"
            /> */}
            {console.log("getToggleHiddenProps",column.props?.getToggleHiddenProps())}
             <input type="checkbox" {...column.props?.getToggleHiddenProps()} />{' '}
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
  getToggleHideAllColumnsProps: PropTypes.any
};
