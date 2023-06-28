import React, {  useState } from "react";
import PropTypes from "prop-types";
import Joi from "joi"
import { useValidator } from "react-joi"
import { Select, MenuItem, TextField } from '@mui/material';
import { createFilter, updateQuery } from "../api/filterApi"
import { getTableInfo } from "../store/table/tableSelector";
import { getAllTableInfo } from "../store/allTable/allTableSelector";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep } from "lodash";
import AddIcon from '@mui/icons-material/Add';
import { setAllTablesData } from "../store/allTable/allTableSlice";
import variables from '../assets/styling.scss';


const FilterModal = (props) => {
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState("");
  const dispatch = useDispatch();
  const calculatePosition = () => {
    const buttonRect = props?.buttonRef.current.getBoundingClientRect();
    const { scrollX, scrollY } = window;
    const { innerWidth, innerHeight } = window;
  
    // Calculate the initial position below the button
    let top = buttonRect.top + buttonRect.height + scrollY;
    let left = buttonRect.left + scrollX;
  
    // Check if there is enough space below the button
    const popupHeight = 300; // Assuming the popup height is 300px
    const popupWidth = 300; // Assuming the popup width is 300px
  
    if (top + popupHeight > innerHeight) {
      // Not enough space below, position above the button instead
      top = buttonRect.top - popupHeight + scrollY;
    }
  
    // Check if there is enough space on the right
    if (left + popupWidth > innerWidth) {
      // Not enough space on the right, align with the right edge of the button
      left = buttonRect.right - popupWidth + scrollX;
    }
  
    return { top, left };
  };
  
const style = {
  position: "absolute",
  ...calculatePosition(),
  transform: "translate(-0%, -20%)",
  backgroundColor: "#fff",
  zIndex:'10000',
  borderRadius: "0px",
  // boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
  border:`1px solid ${variables.basictextcolor}`,
  padding: "20px",
  width: "250px",
};


  const handleClose = () => {
    props.setOpen(false);
  };

  // const updateFilter = async () => {
  //   let queryToSend = " ";
  //   if (
  //     props?.dbData?.db?.tables[props?.tableName]?.view &&
  //     Object.values(props?.dbData?.db?.tables[props?.tableName]?.view?.fields).length >= 1
  //   ) {
  //     const viewId = props?.dbData?.db?.tables[props?.tableName]?.view?.id;
  //     queryToSend = "select * from " + viewId;
  //   } else {
  //     queryToSend = "select * from " + props?.tableName;
  //   }
  //   return queryToSend;
  // };
  const handleClickAway = () => {
    handleClose();
  };

  const handleCreateFilter = async () => {
    // const data = await updateFilter();
    const dataa = {
      filterName: filterName,
      query: "SELECT * FROM " + props?.tableName,
      htmlToShow : ""
    };
    const filter = await createFilter(props?.dbId, props?.tableName, dataa);
    console.log(filter,"filterdata")
    const filters = filter?.data?.data?.data?.tables[props?.tableName]?.filters;
    const filterKey = Object.keys(filters).find(key => filters[key].filterName === filterName);
    await dispatch(setAllTablesData(
      {
        "dbId": props?.dbId,
        "tables": filter.data.data.data.tables,
        "orgId" : filter.data.data.data.org_id
      }
    ))
    // dispatch(bulkAddColumns(
    //   {
    //     "dbId": props?.dbId,
    //     "filter":data,
    //     "pageNo":1,
    //     "tableName": props?.tableName,
    //     "tables": props?.dbData?.db?.tables
        
    //   }
    // ))
    props?.setUnderLine(filterKey)
    navigate(`/db/${props?.dbId}/table/${props?.tableName}/filter/${filterKey}`);
    return dataa;
  };

  // const editQueryData = async () => {
  //  const data = await updateFilter();
  //   const dataa = {
  //     filterId: props?.filterId,
  //     filterName: filterName,
  //     query: data
  //   }
  //   const updatedFilter = await updateQuery(props?.dbId, props?.tableName, dataa)
  //   dispatch(setAllTablesData(
  //     {
  //       "dbId": props?.dbId,
  //       "tables": updatedFilter.data.data.tables , 
  //       "orgId" :  updatedFilter.data.data.org_id
  //     }
  //   ))
  // }

  
  return (
    <Box >

      <Modal
        disableRestoreFocus
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Typography id="title" variant="h6" component="h2" fontWeight="bold" fontSize={26}>
              Create Filter
            </Typography>
          </Box>

          <Box style={{ display: "flex", flexDirection: "column" }}>

            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <TextField error={
                state?.$errors?.filterName.length === 0
                  ? false
                  : state.$errors?.filterName
                    ? true
                    : false
              } autoFocus sx={{ width: 150, height: 60, fontWeight: 'bold' }} value={filterName} type="text" placeholder="enter filter name" onChange={(e) => { setFilterName(e.target.value); createFilterJoi(e); }} onBlur={() => setExplicitField("filterName", true)} />
            </Box>
            <div style={{ color: "red", fontSize: "12px", paddingLeft: "172px" }}>
              {state.$errors?.filterName?.map((data) => data.$message).join(",")}
            </div>

            <Box>
              {query.map((q, index) => (<Box key={index} sx={{ display: "flex", flexDirection: "row" }}>
                {index == 0 && <Box><Typography sx={{ mt: 2, mr: 1, color: 'blue' }}>WHERE</Typography></Box>}

                {index != 0 && <Box>
                  <Select value={q?.andor || "and"}
                    onChange={(e) => handleChangeAndOr(e, index)}>
                    <MenuItem value="and">and</MenuItem>
                    <MenuItem value="or">or</MenuItem>
                  </Select>
                </Box>}

                <Box sx={{ mr: 1 }}>
                  <Select value={q?.fields || fieldData[0]?.id} onChange={(e) => handleChangeField(e, index)} sx={{ width: 150 }}>
                    {fieldData && Object.entries(fieldData)?.map((fields, index) => (
                      <MenuItem key={index} value={fields[1]?.id} >
                        {fields[1].title}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                <Box sx={{ mr: 1 }}>
                  <Select sx={{ width: 150 }}
                    value={q?.selectedOption || "LIKE"}
                    // defaultValue="LIKE"
                    key={q?.value}
                    onChange={(e) => handleChangeSelectedOption(e, index)} >
                    <MenuItem value="LIKE">contains</MenuItem>
                    <MenuItem value="NOT LIKE">does not contain</MenuItem>
                    <MenuItem value="=">is</MenuItem>
                    <MenuItem value="!=">is not</MenuItem>
                  </Select>
                </Box>

                <Box>

                  <TextField required value={q?.value} sx={{ width: 150, height: 60, fontWeight: 'bold', }} placeholder="Enter the value" type="text" onChange={(e) => handleChangeValue(e, index)} />

                  {query[query.length - 1].value.length === 0 && (
                    <div style={{ color: 'red', fontSize: '12px' }}>Value cannot be empty</div>
                  )}
                </Box>
                {index >= 1 && <Button onClick={() => {
                  handleRemove(index)
                }}>Remove</Button>}
              </Box>))}
            </Box>

            <Box sx={{ mb: 2, ml: 1 }}>
              <Button onClick={handleAddInput}> <AddIcon sx={addBtnStyle} /> </Button>
            </Box>

          </Box>


          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {props?.edit == false && <Box>
              <Button className="mui-button" variant="contained" disabled={filterName.length < 1 || filterName.length > 15 || lastValue.length === 0} onClick={() => {
                validate();
                getQueryData();
                handleClose();
              }}>
                Create
              </Button>
            </Box>}

            <Box>
              {props?.edit == true && <Button className="mui-button" onClick={() => {
                editQueryData()
                handleClose()
              }} variant="contained">Edit</Button>}
            </Box>

            <Box>
              <Button variant="outlined" className="mui-button-outlined" onClick={handleClose}>
                Cancel
              </Button>
            </Box>

          </Box>
        </Box>

      </Modal>
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
  setUnderLine: PropTypes.any,
  buttonRef:PropTypes.any
};

export default FilterModal;

