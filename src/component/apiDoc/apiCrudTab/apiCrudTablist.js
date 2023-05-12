import React,{useState} from 'react'
//import Typography from '@mui/material/Typography';
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BasicStuff from './basicStuff';
// import RetrieveRecord from './retrieveRecord';
import ListRecord from './listRecord';
import AddRecord from './addRecord';
import UpdateRecord from './updateRecord';
import DeleteRecord from './deleteRecord';
const StyledTab = styled(Tab)(() => ({
  minWidth: 0,
  backgroundColor: '#9e9e9e',
  color: '#fff',
  position: 'relative',
  padding: '10px 20px',
  margin: '0 1px',
  '&.Mui-selected': {
    backgroundColor: '#fff',
    color: '#000',
  },
  
  
  // '&::after': {
  //   content: "''",
  //   position: 'absolute',
  //   top: 0,
  //   right: 0,
  //   width: 0,
  //   height: 0,
  //   borderStyle: 'solid',
  //   borderWidth: '0 0 40px 20px',
  //   borderColor: 'transparent transparent #9e9e9e transparent',
  //   transform: 'skewX(70deg)',
  // },
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
        <Box sx={{ p: 3 }}>
        {children}
        </Box>
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
    <>
     <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
        <Tabs TabIndicatorProps={{
          style: {
            display: 'none',
          },
          className: 'custom-tab-indicator',
        }} value={value} onChange={handleChange} aria-label="basic tabs example">
          <StyledTab label="Basic stuff" {...a11yProps(0)} />
          {/* <Tab label="Retrieve a record" {...a11yProps(1)} /> */}
          <StyledTab label="List/Search records" {...a11yProps(1)} />
          <StyledTab label="Add records" {...a11yProps(2)} />
          <StyledTab label="Update records" {...a11yProps(3)} />
          <StyledTab label="Delete records" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Box>
        <BasicStuff db={props.db} table={props.table}/>
        </Box>
      </TabPanel>
      {/* <TabPanel value={value} index={1}>
        <RetrieveRecord db={props.db} table={props.table} />
      </TabPanel> */}
      <TabPanel value={value} index={1}>
        <ListRecord db={props.db} table={props.table}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
       <AddRecord db={props.db} table={props.table}/>
      </TabPanel>
      <TabPanel value={value} index={3}>
       <UpdateRecord db={props.db} table={props.table}/>
      </TabPanel>
      <TabPanel value={value} index={4}>
       <DeleteRecord db={props.db} table={props.table}/>
      </TabPanel>
    </Box>
    </>
  )
}

ApiCrudTablist.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}

export default ApiCrudTablist