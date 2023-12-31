import React, { memo, useMemo, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListSubheader,
  ButtonGroup,
} from "@mui/material";
import ApiCrudTablist from "../apiCrudTab/apiCrudTablist/apiCrudTablist";
import { getDbById } from "../../../api/dbApi";
import PropTypes from "prop-types";

import { selectOrgandDb } from "../../../store/database/databaseSelector.js";
import Webhookpage from "../../../pages/Webhookpage/Webhookpage";
import variables from "../../../assets/styling.scss";
import AuthKeyPage from "../../../pages/authKeyPage/authKeyPage";
import "./navbarApi.scss";
import { customUseSelector } from "../../../store/customUseSelector";
import { SelectBoxStyles, navbarApiselectbox } from "../../../muiStyles/muiStyles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  variant: "menu",
};

function Navbar(props) {
  let dbchanged = 0;
  const [tables, setTables] = useState({});
  const [dbId, setDbId] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const [selectedOption, setSelectedOption] = useState();
  const [selectedDb, setSelectedDb] = useState(useParams().dbId);
  const [authkeys, setAuthKeys] = useState({});
  const [webhooks, setWebhooks] = useState({});

  const [selectTable, setSelectTable] = useState(
    useLocation().state || props.tabletoredirect
  );
  const alldb = customUseSelector((state) => selectOrgandDb(state));
  const [loading, setLoading] = useState(false);
  const [showWebhookPage, setShowWebhookPage] = useState("apidoc");
  const [dataforwebhook, setdataforwebhook] = useState(null);

 
  const classes1 = SelectBoxStyles(),classes2=navbarApiselectbox();

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
    setAuthKeys(data.data.data.auth_keys);
    setWebhooks(data.data.data.webhook);
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
  const memoizedApiCrudTablist = useMemo(
    () => (
      <ApiCrudTablist
        setShowComponent={setShowWebhookPage}
        alltabledata={dataforwebhook}
        dbId={dbId}
        db={selectedOption}
        table={selectTable}
      />
    ),
    [dataforwebhook, dbId, selectedOption, selectTable]
  );

  const memoizedAuthKeyPage = useMemo(
    () => (
      <AuthKeyPage
        id={dbId}
        selectedOption={selectedOption}
        alltabledata={dataforwebhook}
        authKeys={authkeys}
        setAuthKeys={setAuthKeys}
        dbtoredirect={props.dbtoredirect}
        tabletoredirect={props.tabletoredirect}
      />
    ),
    [
      dbId,
      selectedOption,
      dataforwebhook,
      authkeys,
      props.dbtoredirect,
      props.tabletoredirect,
    ]
  );

  return (
    <div className="navbar-api-main-container">
      <div className="navbar-api-container">
        <Box className="navbar-api-box-1" align="center"></Box>
        <Box className="navbar-api-box-2">
          <Box className="navbar-api-box-3">
            {alldb && selectedDb && (
              <FormControl
                className={`singletypemuiselect ${classes1.formControl} ${classes2.formControl}`}
              >
                <InputLabel htmlFor="grouped-select">
                  Organization-db
                </InputLabel>
                <Select
                  inputProps={{
                    style: {
                      border: "none",
                    },
                  }}
                  id="grouped-select"
                  sx={{
                    borderRadius: 0,
                    height: "36px",
                    color: `${variables.basictextcolor}`,
                  }}
                  label="Organization and dbs"
                  value={selectedDb}
                  MenuProps={MenuProps}
                  onChange={handleChange}
                >
                  {Object.entries(alldb)
                    .sort(([, dbs1], [, dbs2]) =>
                      dbs1[0]?.org_id?.name && dbs2[0]?.org_id?.name
                        ? dbs1[0].org_id.name.localeCompare(dbs2[0].org_id.name)
                        : 0
                    )
                    .map(([orgId, dbs]) => {
                      const sortedDbs = [...dbs]?.sort((db1, db2) =>
                        db1?.name?.localeCompare(db2.name)
                      );

                      return [
                        <ListSubheader
                          sx={{ display: "flex", flexDirection: "row" }}
                          key={`${orgId}-header`}
                          name={orgId}
                        >
                          {dbs[0]?.org_id?.name}
                        </ListSubheader>,
                        sortedDbs.map((db, index) => (
                          <MenuItem
                            sx={{ color: `${variables.basictextcolor}` }}
                            key={index}
                            value={db?._id}
                          >
                            {db?.name}
                          </MenuItem>
                        )),
                      ];
                    })}
                </Select>
              </FormControl>
            )}
          </Box>
          {showWebhookPage == "apidoc" &&
            selectTable &&
            Object.keys(tables).length >= 1 && (
              <Box>
                <FormControl className={`  ${classes1.formControl} ${classes2.formControl}`}>
                  <InputLabel htmlFor="grouped-select">Tables-Name</InputLabel>
                  <Select
                    sx={{
                      borderRadius: 0,
                      height: "36px",
                      color: `${variables.basictextcolor}`,
                    }}
                    value={selectTable}
                    label="Tables-Nameee"
                    onChange={handleChangeTable}
                    MenuProps={MenuProps}
                  >
                    {Object.entries(tables)?.map((table) => (
                      <MenuItem
                        sx={{ color: `${variables.basictextcolor}` }}
                        key={table[0]}
                        value={table[0]}
                      >
                        {table[1].tableName || table[0]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          {Object.keys(tables).length >= 1 && (
            <Box className="navbar-api-box-4">
              <ButtonGroup className="button-group" color="primary">
                <Button
                  className={
                    showWebhookPage == "apidoc"
                      ? "mui-button notpointed"
                      : "mui-button-outlined"
                  }
                  variant="outlined"
                  onClick={() => {
                    setShowWebhookPage("apidoc");
                  }}
                >
                  {"API Documentation"}
                </Button>

                <Button
                  className={
                    showWebhookPage == "authkey"
                      ? "mui-button notpointed"
                      : "mui-button-outlined"
                  }
                  onClick={() => {
                    setShowWebhookPage("authkey");
                  }}
                  variant="outlined"
                >
                  {"Auth Key"}
                </Button>
                <Button
                  className={
                    showWebhookPage == "webhook"
                      ? "mui-button notpointed"
                      : "mui-button-outlined"
                  }
                  variant="outlined"
                  onClick={() => {
                    setShowWebhookPage("webhook");
                  }}
                >
                  {"Webhook"}
                </Button>
              </ButtonGroup>
            </Box>
          )}
        </Box>

        {showWebhookPage == "webhook" && (
          <Webhookpage
            tables={tables}
            dataforwebhook={dataforwebhook}
            dbId={props?.dbtoredirect}
            table={props?.tabletoredirect}
            webhooks={webhooks}
            setWebhooks={setWebhooks}
          />
        )}
        {showWebhookPage === "apidoc" && (
          <Box>{loading && memoizedApiCrudTablist}</Box>
        )}
        {showWebhookPage == "authkey" && memoizedAuthKeyPage}
      </div>
    </div>
  );
}
export default memo(Navbar);
Navbar.propTypes = {
  dbData: PropTypes.any,
  dbId: PropTypes.string,
  orgId: PropTypes.string,
  setDbtoredirect: PropTypes.any,
  setTabletoredirect: PropTypes.any,
  dbtoredirect: PropTypes.any,
  tabletoredirect: PropTypes.any,
};
