import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, TextField, Tab, Button, ClickAwayListener } from "@mui/material";
import Dropdown from "../../dropdown";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  removeTable1,
  updateTable1,
} from "../../../store/allTable/allTableThunk";
import { resetData } from "../../../store/table/tableSlice";
import { deleteTable, exportCSV } from "../../../api/tableApi";
import { selectActiveUser } from "../../../store/user/userSelector.js";
import { toast } from "react-toastify";
import variables from "../../../assets/styling.scss";
import "./singleTable.scss";
import { useParams } from "react-router-dom";
import { bulkAddColumns } from "../../../store/table/tableThunk";

export default function SingleTable({
  dbData,
  table,
  setTabIndex,
  tableLength,
  index,
  tabIndex,
  setPage,
  setTableIdForFilter
}) {
  const navigate = useNavigate();
  const [tableNa, setTableNa] = useState(null);
  const [name, setName] = useState();
  const AllTableInfo = useSelector((state) => state.tables.tables);
  const userDetails = useSelector((state) => selectActiveUser(state));
  const params = useParams();

  const dispatch = useDispatch();

  const TabWithDropdown = ({ label, dropdown }) => (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Tab
        textColor={`${variables.bgcolorvalue}`}
        label={
          label.length > 10 ? (
            <>
              {`${label.slice(0, 10)}...`}
              {dropdown}
            </>
          ) : (
            <>
              {label}
              {dropdown}
            </>
          )
        }
        sx={{
          minWidth: "auto",
          overflowX: "auto",
          flexDirection: "row",
          textTransform: "none",
          height: "10px",
          fontSize: `${variables.tablepagefontsize}`,
        }}
        title={label}
      />
    </Box>
  );

  const renameTableName = async (db_id, tableName) => {
    // if (!tableNa) {
    //   toast.error("Table name is same");
    //   return;
    // }
    if (!tableNa || tableNa.trim() === "") {
      toast.error("Table name cannot be empty");
      return;
    }

    if (tableNa.length < 3) {
      toast.error("Table name must be at least 3 characters long");
      return;
    }

    if (tableNa.length > 30) {
      toast.error("Table name cannot exceed 30 characters");
      return;
    }

    if (tableNa.includes(" ")) {
      toast.error("Table name cannot contain spaces");
      return;
    }

    const data1 = {
      newTableName: tableNa,
    };

    if (tableName === data1.newTableName) {
      return;
    }

    dispatch(
      updateTable1({
        dbId: dbData?.db?._id,
        tableName: tableName,
        data1: data1,
      })
    );
    setTableNa(null);
  };

  const deleteTableName = async (tableid) => {
    const keys = Object.keys(AllTableInfo);
    let i = 0;
    for (; i < keys.length; i++) {
      if (keys[i] === tableid) {
        break;
      }
    }
    i = i === keys.length - 1 ? 0 : i + 1;
    let last = keys[i];

    const deleteTableData = await deleteTable(dbData?.db?._id, tableid);
    dispatch(removeTable1({ tableData: deleteTableData?.data?.data?.tables }));
    navigate(`/db/${dbData.db._id}/table/${last}`);
  };

  const exportCSVTable = async (tableid) => {
    const data = {
      query: "",
      userName: userDetails?.fullName,
      email: userDetails?.email,
    };
    await exportCSV(dbData?.db?._id, tableid, data);
    toast.success("Your CSV file has been mailed successfully");
  };

  function onTableClicked() {
    if(params?.templateId){
      setTableIdForFilter(table[0])
      dispatch(
        bulkAddColumns({
          dbId: dbData?._id,
          tableName: table[0],
          pageNo: 1,
        })
      );
    }else
    {
      navigate(`/db/${dbData?.db?._id}/table/${table[0]}`);
      setPage(1);
      dispatch(resetData());
      if (table[0] == params?.tableName) {
        dispatch(
          bulkAddColumns({
            dbId: dbData?.db?._id,
            tableName: table[0],
            pageNo: 1,
          })
        );
      }
    }
  }

  const location = useLocation();

  return (
    <div style={{width:'fit-content'}}>
      <Box
        className={`single-table ${location.pathname.includes(`table/${table[0]}`) ? "active" : ""
          }`}
        onClick={() => {
          onTableClicked(table[0]);
        }}
      >
        {name && tabIndex === index ? (
          <div style={{width:'fit-content',overflow:'visible'}}>
            <ClickAwayListener
              onClickAway={() => {
                setName(false);
              }}
            >
              <Box >
                <TextField
                  defaultValue={table[1]?.tableName || table[0] || " "}
                  autoFocus
                  sx={{
                    width: 'fit-content',
                    fontWeight: "bold",
                    backgroundColor: "white",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      renameTableName(dbData?.db?._id, table[0]);
                      setName(false);
                    }
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    setTableNa(e.target.value);
                  }}
                  size="small"
                />

                <Button
                  sx={{
                    width: 2,
                    fontSize: `${variables.tablepagefontsize}`,
                  }}
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setName(false);
                    renameTableName(dbData?.db?._id, table[0]);
                  }}
                  variant="contained"
                  className="mui-button"
                // style={{color:'white'}}
                >
                  Rename
                </Button>
              </Box>
            </ClickAwayListener>
          </div>
        ) : (
          <>
            {tableLength >= 2 ? (
              <Box sx={{ mt: -1 }}>
                <TabWithDropdown
                  sx={{ width: 100 }}
                  label={table[1]?.tableName || table[0]}
                  dropdown={
                    <Dropdown
                      setTabIndex={setTabIndex}
                      tables={dbData?.db?.tables}
                      tableId={table[0]}
                      title={table[1]?.tableName || table[0]}
                      tabIndex={index}
                      first="Rename"
                      second="Delete"
                      exportCSV="Export CSV"
                      idToDelete={dbData?.db?._id}
                      deleteFunction={deleteTableName}
                      setName={setName}
                      exportCSVTable={exportCSVTable}
                    />
                  }
                />
              </Box>
            ) : (
              <Box sx={{ mt: -1 }}>
                <TabWithDropdown
                  sx={{ width: 100 }}
                  label={table[1]?.tableName || table[0]}
                  dropdown={
                    <Dropdown
                      setTabIndex={setTabIndex}
                      tables={dbData?.db?.tables}
                      tableId={table[0]}
                      title={table[1]?.tableName || table[0]}
                      tabIndex={index}
                      first="Rename"
                      second=""
                      exportCSV="Export CSV"
                      idToDelete={dbData?.db?._id}
                      deleteFunction={deleteTableName}
                      setName={setName}
                      exportCSVTable={exportCSVTable}
                    />
                  }
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </div>
  );
}

SingleTable.propTypes = {
  dbData: PropTypes.any,
  table: PropTypes.array,
  setTabIndex: PropTypes.func,
  tableLength: PropTypes.any,
  index: PropTypes.number,
  tabIndex: PropTypes.number,
  setPage: PropTypes.any,
  label: PropTypes.string,
  dropdown: PropTypes.node,
  setTableIdForFilter:PropTypes.any
};
