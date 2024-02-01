import React, { useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Button,
  ClickAwayListener,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

import { createFilter } from "../../api/filterApi";
import { useDispatch } from "react-redux";
import { setAllTablesData } from "../../store/allTable/allTableSlice";
import variables from "../../assets/styling.scss";
import "./filterPopup.scss";
import CustomTextField from "../../muiStyles/customTextfield";

const FilterModal = (props) => {
  const navigate = useNavigate();
  const filterNameRef = useRef("");
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);
  const calculatePosition = () => {
    const buttonRect = props?.buttonRef.current.getBoundingClientRect();
    const { scrollX, scrollY } = window;
    const { innerWidth, innerHeight } = window;
    let top = buttonRect.top + buttonRect.height + scrollY;
    let left = buttonRect.left + scrollX;
    const popupHeight = 300;
    const popupWidth = 300;
    if (top + popupHeight > innerHeight) {
      top = buttonRect.top - popupHeight + scrollY;
    }
    if (left + popupWidth > innerWidth) {
      left = buttonRect.right - popupWidth + scrollX;
    }

    return { top, left };
  };

  const style = {
    position: "absolute",
    ...calculatePosition(),
    top:'12vh',
    backgroundColor: variables.bgcolorvalue,
    zIndex: "10000",
    borderRadius: "0px",
    border: `1px solid ${variables.basictextcolor}`,
    width: "300px",
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleClickAway = () => {
    handleClose();
  };

  const handleCreateFilter = async () => {
    const firstChar = filterNameRef?.current[0];
    let filterName1 = firstChar.toUpperCase() + filterNameRef?.current.slice(1);
    filterNameRef.current = filterName1;
    const dataa = {
      filterName: filterNameRef?.current,
      query: "SELECT * FROM " + props?.tableName,
      htmlToShow: "",
    };
    const filter = await createFilter(props?.dbId, props?.tableName, dataa);
    const filters = filter?.data?.data?.data?.tables[props?.tableName]?.filters;
    const filterKey = Object.keys(filters).find(
      (key) => filters[key].filterName === filterName1
    );
    await dispatch(
      setAllTablesData({
        dbId: props?.dbId,
        tables: filter.data.data.data.tables,
        orgId: filter.data.data.data.org_id,
      })
    );

    navigate(
      `/db/${props?.dbId}/table/${props?.tableName}/filter/${filterKey}`
    );
    return dataa;
  };
  const buttonComponent = useMemo(
    () => (
      <Button
        variant="contained"
        className={disabled ? "mui-button-disabled" : "mui-button"}
        onClick={() => {
          handleCreateFilter();
          handleClose();
        }}
        disabled={disabled}
        sx={{ fontSize: variables.editfilterbutttonsfontsize }}
      >
        Create Filter
      </Button>
    ),
    [disabled]
  );

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={style}>
        <div className="popupheader popup-header">
          <Typography className="title" variant="h6" component="h2">
            create filter
          </Typography>
          <CloseIcon className="close-icon" onClick={handleClose} />
        </div>

        <Box className="filter-content">
          <CustomTextField
            label="Filter Name"
            variant="outlined"
            // value={filterName}
            autoFocus={true}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              if (!filterNameRef?.current) return;
              handleCreateFilter();
              handleClose();
            }}
            onChange={(e) => {
              filterNameRef.current = e.target.value;
              setDisabled(!filterNameRef.current);
            }}
          />
        </Box>
        <Box
          className="filter-actions"
          display="flex"
          justifyContent="space-between"
        >
          {buttonComponent}
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

FilterModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dbId: PropTypes.any,
  tableName: PropTypes.any,
  filterId: PropTypes.any,
  dbData: PropTypes.any,
  buttonRef: PropTypes.any,
  edit:PropTypes.any
};

export default FilterModal;
