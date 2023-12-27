import React, { useState, useEffect,  memo, } from "react";
import { Box, Button, Tabs } from "@mui/material";
import PopupModal from "../../popupModal/popupModal";
import PropTypes from "prop-types";
import SingleTable from "../singleTable/singleTable";
import { useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { bulkAddColumns } from "../../../store/table/tableThunk";
import { useDispatch } from "react-redux";
import { createTable1 } from "../../../store/allTable/allTableThunk";
import { setTableLoading } from "../../../store/table/tableSlice";
import { createTable } from "../../../api/tableApi";
import   {  customUseSelector }  from "../../../store/customUseSelector";


 function TableList({ dbData, setPage }) {
  const AllTableInfo = customUseSelector((state) => state.tables.tables);
  const dispatch = useDispatch();
  const params = useParams();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  
  const saveTable = async (table_name) => {
    const data = {
      tableName: table_name,
    };
    setOpen(false);
    const apiCreate = await createTable(dbData?.db?._id, data);

    await dispatch(createTable1({ tables: apiCreate?.data?.data?.tables }));
    const matchedKey = Object.keys(apiCreate?.data?.data?.tables).find(
      (key) => {
        return apiCreate?.data?.data?.tables[key].tableName === table_name;
      }
    );
    if (matchedKey) {
      navigate(`/db/${dbData?.db?._id}/table/${matchedKey}`);
    }

  
  };
  useEffect(() => {
    const tableNames = Object.keys(dbData?.db?.tables)||[];
    dispatch(setTableLoading(true));
    if (params?.tableName && !params?.filterName) {

      dispatch(
        bulkAddColumns({
          dbId: dbData?.db?._id,
          tableName: params?.tableName || tableNames[0],
          pageNo: 1,
        })
      );
    }
    
    if (!params?.tableName) {
      navigate(`/db/${dbData?.db?._id}/table/${tableNames[0]}`,{replace:true});  // author: rohitmirchandani, replace the current page to fix navigation
    }
  }, [params?.tableName]);

  return (
    <>
        <Box className="tables-list-container">
          <Box className="tabs-container">
            <Tabs
              value={0}
              TabIndicatorProps={{
                style: { display: "none" },
              }}
              className={`tabs`}
              variant="scrollable"
              scrollButtons={false}
              aria-label="scrollable auto tabs example"
            >
              {AllTableInfo &&
                Object.entries(AllTableInfo).map((table, index) => (
                  <SingleTable
                    table={table}
                    index={index}
                    dbData={dbData}
                    setPage={setPage}
                    key={index}
                  />
                ))}
            </Tabs>
            <Button
              variant="outlined"
              className="mui-button-outlined add-button"
              onClick={() => handleOpen()}
            >
              <AddIcon />
            </Button>
          </Box>
        </Box>
        {open && (
          <PopupModal
            title="Create Table"
            label="Table Name"
            open={open}
            setOpen={setOpen}
            submitData={saveTable}
            joiMessage={"Table name"}
          />
        )}
    </>
  );
}
export default memo(TableList);
TableList.propTypes = {
  dbData: PropTypes.any,
  setPage : PropTypes.func,
};