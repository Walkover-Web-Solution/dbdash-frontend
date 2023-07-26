import React, { useState,memo } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BasicStuff from "../basicStuff/basicStuff";
import ListRecord from "../listRecord/listRecord";
import AddRecord from "../addRecord/addRecord";
import UpdateRecord from "../updateRecord/updateRecord";
import DeleteRecord from "../deletRecord/deleteRecord";
import "./apiCrudTablist.scss"; 

const StyledTab = styled(Tab)(() => ({
  // ...styles
}));

const styledTabLabelList = [
  "BASIC STUFF",
  "LIST/SEARCH",
  "ADD",
  "UPDATE",
  "DELETE",
];

const style = {
  height: `${(window?.screen?.height * 61) / 100}px`,
  width: `${(window?.screen?.width * 98.5) / 100}px`,
};
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ApiCrudTablist(props) {

  const [value, setValue] = useState(0);

  const tablePannelListData = {
    db: props.db,
    table: props.table,
    alltabledata: props.alltabledata,
  };

  const tablePannelList = [
    <BasicStuff
      setShowComponent={props?.setShowComponent}
      key={0}
      tablePannelListData={tablePannelListData}
    />,
    <ListRecord key={1} tablePannelListData={tablePannelListData} />,
    <AddRecord key={2} tablePannelListData={tablePannelListData} />,
    <UpdateRecord key={3} tablePannelListData={tablePannelListData} />,
    <DeleteRecord key={4} tablePannelListData={tablePannelListData} />,
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="api-crud-tablist-container">
      <Box className="tab-container">
        <Tabs
          TabIndicatorProps={{
            style: {
              display: "none",
            },
            className: "custom-tab-indicator",
          }}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {styledTabLabelList.map((listLabel, labelIndex) => {
            return (
              <StyledTab
                key={labelIndex}
                className="custom-tab-label"
                label={listLabel}
                {...a11yProps(labelIndex)}
              />
            );
          })}
        </Tabs>
      </Box>
      <div className="marginTop">
        {tablePannelList.map((pannel, pannelIndex) => {
          return (
            <TabPanel value={value} index={pannelIndex} key={pannelIndex}>
              <div
                key={pannelIndex}
                className="componentscontainer"
                style={style}
              >
                {pannel}
              </div>
            </TabPanel>
          );
        })}
      </div>
    </Box>
  );
}

ApiCrudTablist.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string,
  setShowComponent: PropTypes.any,
  alltabledata: PropTypes.any,
};

export default memo(ApiCrudTablist);
