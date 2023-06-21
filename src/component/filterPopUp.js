import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Box, Typography, TextField, Button } from "@material-ui/core";
// import AddIcon from "@material-ui/icons/Add";
import { useNavigate } from "react-router-dom";
import { createFilter } from "../api/filterApi";
import { useDispatch} from "react-redux";
import { setAllTablesData } from "../store/allTable/allTableSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300, // Reduced the width to make the popup smaller
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2, // Reduced the padding to make the content area smaller
};

const FilterModal = (props) => {
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState("");
  const dispatch = useDispatch();

  const handleClose = () => {
    props.setOpen(false);
  };

  const updateFilter = async () => {
    var queryToSend = " ";
    if (
      props?.dbData?.db?.tables[props?.tableName]?.view &&
      Object.values(props?.dbData?.db?.tables[props?.tableName]?.view?.fields)
        .length >= 1
    ) {
      const viewId = props?.dbData?.db?.tables[props?.tableName]?.view?.id;
      queryToSend = "select * from " + viewId;
    } else {
      queryToSend = "select * from " + props?.tableName;
    }
    return queryToSend;
  };

  const handleCreateFilter = async () => {
    const data = await updateFilter();
    const dataa = {
      filterName: filterName,
      query: data,
    };
    const filter = await createFilter(props?.dbId, props?.tableName, dataa);
    const filters =
      filter?.data?.data?.data?.tables[props?.tableName]?.filters;
    const filterKey = Object.keys(filters).find(
      (key) => filters[key].filterName === filterName
    );
    dispatch(
      setAllTablesData({
        dbId: props?.dbId,
        tables: filter.data.data.data.tables,
      })
    );

    props?.setUnderLine(filterKey);
    navigate(`/db/${props?.dbId}/table/${props?.tableName}/filter/${filterKey}`);
    return dataa;
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create Filter
        </Typography>
        <Box>
          <TextField
            fullWidth
            label="Filter Name"
            variant="outlined"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            onClick={() => {
              handleCreateFilter();
              handleClose();
            }}
            disabled={!filterName}
          >
            Create Filter
          </Button>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

FilterModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dbId: PropTypes.any,
  tableName: PropTypes.any,
  edit: PropTypes.any,
  filterId: PropTypes.any,
  dbData: PropTypes.any,
  setEdit: PropTypes.func,
  setUnderLine: PropTypes.any,
};

export default FilterModal;
