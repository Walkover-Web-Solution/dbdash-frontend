import React, { useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BasicStuff from '../basicStuff/basicStuff';
import ListRecord from '../listRecord/listRecord';
import AddRecord from '../addRecord/addRecord';
import UpdateRecord from '../updateRecord/updateRecord';
import DeleteRecord from '../deletRecord/deleteRecord';
import './apiCrudTablist.scss'; // Import the CSS file

const StyledTab = styled(Tab)(() => ({
  // ...styles
}));

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
      {value === index && (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function ApiCrudTablist(props) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="api-crud-tablist-container">
      <Box className="tab-container">
        <Tabs
          TabIndicatorProps={{
            style: {
              display: 'none',
            },
            className: 'custom-tab-indicator',
          }}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <StyledTab className="custom-tab-label" label="Basic stuff" {...a11yProps(0)} />
          <StyledTab className="custom-tab-label" label="List/Search" {...a11yProps(1)} />
          <StyledTab className="custom-tab-label" label="Add" {...a11yProps(2)} />
          <StyledTab className="custom-tab-label" label="Update" {...a11yProps(3)} />
          <StyledTab className="custom-tab-label" label="Delete" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <div style={{marginTop:"23vh"}}>
      <TabPanel value={value} index={0}>
        <BasicStuff db={props.db} table={props.table} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ListRecord db={props.db} table={props.table} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AddRecord db={props.db} table={props.table} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <UpdateRecord db={props.db} table={props.table} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <DeleteRecord db={props.db} table={props.table} />
      </TabPanel>
      </div>
    </Box>
  );
}

ApiCrudTablist.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string,
};

export default ApiCrudTablist;
