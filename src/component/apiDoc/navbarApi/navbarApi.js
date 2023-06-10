import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Box, Button, Select, MenuItem, FormControl, InputLabel, ListSubheader, ButtonGroup } from "@mui/material";
import ApiCrudTablist from '../apiCrudTab/apiCrudTablist/apiCrudTablist';
import { getDbById } from '../../../api/dbApi';
import PropTypes from "prop-types";

import { selectOrgandDb } from '../../../store/database/databaseSelector.js';
import Webhookpage from '../../../pages/Webhookpage/Webhookpage';
import AuthKeyPage from '../../../pages/authKeyPage/authKeyPage';

export default function Navbar(props) {
  let dbchanged = 0;
  const [tables, setTables] = useState({});
  const [dbId, setDbId] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const [selectedOption, setSelectedOption] = useState();
  const [selectedDb, setSelectedDb] = useState(useParams().dbId);
  const [selectTable, setSelectTable] = useState(useLocation().state || props.tabletoredirect);
  const alldb = useSelector((state) => selectOrgandDb(state));
  const [loading, setLoading] = useState(false);
  const [showWebhookPage, setShowWebhookPage] = useState("apidoc");
 const [dataforwebhook,setdataforwebhook]=useState(null);


  if (selectedDb) {
    props?.setDbtoredirect(selectedDb);
  }
  if (selectTable) {
    props?.setTabletoredirect(selectTable);
  }

  const handleChange = async (event) => {
    dbchanged = 1;
    setSelectedDb(event.target.value);
    props?.setDbtoredirect(event.target.value);
    setSelectedOption(event.target.value);
    setDbId(event.target.value);
    setLoading(false);
    await getAllTableName(event.target.value);
    navigate(`/apiDoc/db/${selectedDb}`);
  };

  const handleChangeTable = async (event) => {
    setSelectTable(event.target.value);
    props.setTabletoredirect(event.target.value);
  };

  const filterDbsBasedOnOrg = async () => {
    Object.keys(alldb).forEach(async (orgId) => {
      const dbObj = alldb[orgId].find((db) => db?._id === params.dbId);
      if (dbObj) {
        setSelectedOption(dbObj._id);
        setSelectedDb(dbObj._id);
        props.setDbtoredirect(dbObj._id);
        setDbId(dbObj._id);
        await getAllTableName(dbObj._id);
      }
    });
  };

  useEffect(() => {
    filterDbsBasedOnOrg();
  }, [alldb]);

  const getAllTableName = async (dbId) => {
    const data = await getDbById(dbId);
    setTables(data.data.data.tables || {});

    setdataforwebhook(data.data.data.tables);
    if (data.data.data.tables) {
      if (dbchanged === 0) {
        setSelectTable(selectTable || Object.keys(data.data.data.tables)[0]);
      } else {
        setSelectTable(Object.keys(data.data.data.tables)[0] || selectTable);
        dbchanged = 0;
      }
      props.setTabletoredirect(Object.keys(data.data.data.tables)[0]);
      setLoading(true);
    }
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      <div style={{ position: "fixed", top: "8vh", zIndex: 100, width: "100%", backgroundColor: "white", paddingBottom: "2vh" }}>
        <Box align="center" ></Box>
        <Box sx={{ display: "flex",alignItems:"center", flexDirection: "row" }}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            {alldb && selectedDb && (
              <FormControl sx={{ m: 1,mt:0, minWidth: 120}}>
                <InputLabel htmlFor="grouped-select">Organization-db</InputLabel>
                <Select
                  id="grouped-select"
                  sx={{ borderRadius: 0, height: '36px' }}
                  label="Organization and dbs"
                  value={selectedDb}
                  onChange={handleChange}
                >
                  {Object.entries(alldb)
                    .sort(([, dbs1], [, dbs2]) =>
                      dbs1[0]?.org_id?.name && dbs2[0]?.org_id?.name
                        ? dbs1[0].org_id.name.localeCompare(dbs2[0].org_id.name)
                        : 0
                    )
                    .map(([orgId, dbs]) => {
                      const sortedDbs = [...dbs].sort((db1, db2) =>
                        db1.name.localeCompare(db2.name)
                      );

                      return [
                        <ListSubheader key={`${orgId}-header`} name={orgId}>
                          {dbs[0]?.org_id?.name}
                        </ListSubheader>,
                        sortedDbs.map((db, index) => (
                          <MenuItem key={index} value={db?._id}>
                            {db?.name}
                          </MenuItem>
                        )),
                      ];
                    })}
                </Select>
              </FormControl>
            )}
          </Box>
          {showWebhookPage=="apidoc" && selectTable && Object.keys(tables).length >= 1 && (
            <Box>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="grouped-select">Tables-Name</InputLabel>
                <Select
                  sx={{ borderRadius: 0, height: '36px' }}
                  value={selectTable}
                  label="Tables-Name"
                  onChange={handleChangeTable}
                >
                  {Object.entries(tables)?.map((table) => (
                    <MenuItem key={table[0]} value={table[0]}>
                      {table[1].tableName || table[0]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          {Object.keys(tables).length >= 1 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginRight: '10px',
                position: 'fixed',
                right: 0,
                top: '9vh'
              }}
            >
              <ButtonGroup color="primary" style={{ borderRadius: 0 }}>
                <Button
                  className={showWebhookPage=="apidoc"?"mui-button":"mui-button-outlined"}
                  variant="outlined"
                  onClick={()=>{
                    setShowWebhookPage("apidoc")
                  }}
                  sx={{
                     pointerEvents: showWebhookPage=="apidoc"?'none':'',
                  }}
                >
                  {'API Documentation'}
                </Button>
               
                  <Button 
                  className={showWebhookPage=="authkey"?"mui-button":"mui-button-outlined"}
                  sx={{
                    pointerEvents: showWebhookPage=="authkey"?'none':'',
                 }}
                 onClick={()=>{
                  setShowWebhookPage("authkey")
                }}
                  variant="outlined">
                    {'Auth Key'}
                  </Button>
                <Button
                  className={showWebhookPage=="webhook"?"mui-button":"mui-button-outlined"}
                  variant="outlined"
                  onClick={()=>{
                    setShowWebhookPage("webhook")
                  }}
                  sx={{
                    pointerEvents: showWebhookPage=="webhook"?'none':'',
                 }}
                >
                  {'Webhook'}
                </Button>
              </ButtonGroup>
            </Box>
          )}
        </Box>

        {showWebhookPage=="webhook"  &&  (
          <Webhookpage dataforwebhook={dataforwebhook} dbId={props?.dbtoredirect}  table={props?.tabletoredirect}/>
        ) }
        {showWebhookPage=="apidoc" &&(
          <Box>
            {loading && <ApiCrudTablist dbId={dbId} db={selectedOption} table={selectTable} />}
          </Box>
        )}
        { showWebhookPage=="authkey" && 
        <AuthKeyPage  id={dbId} selectedOption={selectedOption} dbtoredirect={props.dbtoredirect} tabletoredirect={props.tabletoredirect}/>
}
      </div>
    </div>
  );
}

Navbar.propTypes = {
  dbData: PropTypes.any,
  dbId: PropTypes.string,
  orgId: PropTypes.string,
  setDbtoredirect: PropTypes.any,
  setTabletoredirect: PropTypes.any,
  dbtoredirect: PropTypes.any,
  tabletoredirect: PropTypes.any
};
