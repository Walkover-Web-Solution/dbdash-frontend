import React, {useState} from 'react'
import { Box, Tabs, Button } from '@mui/material'
import { customUseSelector } from '../../../store/customUseSelector';
import SingleTable from '../singleTable/singleTable';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from "prop-types";
import PopupModal from "../../popupModal/popupModal";
import { createTable } from '../../../api/tableApi';
import { createTable1 } from "../../../store/allTable/allTableThunk";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';


function TableList(props) {
    const AllTableInfo = customUseSelector((state) => state.tables.tables);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const saveTable = async (table_name) => {
        const data = {
          tableName: table_name,
        };
        setOpen(false);
        const apiCreate = await createTable(props?.dbData?.db?._id, data);
    
        await dispatch(createTable1({ tables: apiCreate?.data?.data?.tables }));
        const matchedKey = Object.keys(apiCreate?.data?.data?.tables).find(
          (key) => {
            return apiCreate?.data?.data?.tables[key].tableName === table_name;
          }
        );
        if (matchedKey) {
          navigate(`/db/${props?.dbData?.db?._id}/table/${matchedKey}`);
        }
    
      
      };
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
                    dbData={props.dbData}
                    setPage={props.setPage}
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
  )
}
TableList.propTypes = {
    dbData: PropTypes.any,
    setPage: PropTypes.any,

}
export default TableList;

