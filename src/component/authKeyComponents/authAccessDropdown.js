import React, { useState ,useEffect} from "react";
import {Checkbox,InputLabel,ListItemIcon,ListItemText,MenuItem,FormControl,Select} from "@mui/material"
import { getDbById } from '../../api/dbApi';
import PropTypes from "prop-types";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center"
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center"
  },
  variant: "menu"
};

export default function AuthAccessDropDown({selected,setSelected,dbId}) {
  const [options, setOptions] = useState([]);
  const getAllTableName = async (dbId) => {
    const data = await getDbById(dbId)
    
    setOptions(data.data.data.tables || {});
   
  }
   
  const isAllSelected =
    options.length > 0 && selected.length === options.length;

  const handleChange = (event) => {
    const value = event.target.value;
    console.log("target",event.target.value)

    // if (value[value.length - 1] === "all") {
    //   console.log("all this is")
    //   if(selected.length === Object.entries(options)?.length){
    //     setSelected([])
    //     return
    //   }
    //   let all = []
    //   Object.entries(options).map((option)=>{
    //     all = [...all, option[1].tableName] 
    //   })
    //   setSelected(all);
    //   return;
    // }
    if (value[value.length - 1] !== "all")
    {setSelected(value);}
  };
  useEffect(()=>{
    callFunc();
  },[])
  const callFunc = async()=>{
      await getAllTableName(dbId);

  }
  return (
    <FormControl sx={{margin: 1,
      width: 300}}>
      <InputLabel id="mutiple-select-label">Multiple Select</InputLabel>
      <Select
        labelId="mutiple-select-label"
        label="Multiple Select"
        multiple
        value={selected}
        onChange={handleChange}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
      >
        <MenuItem
          value="all"
          sx={{
            ...(isAllSelected && {backgroundColor: "rgba(0, 0, 0, 0.08)",
            ["&:hover"]: {
              backgroundColor: "rgba(0, 0, 0, 0.08)"
            }})
          }}
          // classes={{
          //   root: isAllSelected ? classes.selectedAll : ""
          // }}
        >
          <ListItemIcon>
            <Checkbox onChange={(e)=>{ 
      console.log("all this is")
      if(!e.target.checked ){
        setSelected([])
        return
      }
      let all = []
      Object.entries(options).map((option)=>{
        all = [...all, option[1].tableName] 
      })
      setSelected(all);
      return;
    }}
              //  checked={isAllSelected}
               indeterminate={
                 selected?.length > 0 && selected?.length < options.length
              }
              defaultChecked={selected?.length === Object.entries(options)?.length}
              />
          </ListItemIcon>
          <ListItemText
      
            sx={{fontWeight: 500}}
            primary="Select All"
          />
        </MenuItem>
        { Object.entries(options).map((option,index) => {

         return  <MenuItem key={index} value={option[1].tableName}>         
         <ListItemIcon>
           {/* {option[0]} */}
           {/* <Checkbox checked={option[0]} /> */}
           {/* <input type="checkbox" value={option[0]}/> */}
           <Checkbox checked={selected?.includes(option[1].tableName)} value={option[1].tableName} onChange={(e)=>{
            if(!selected?.includes(e.target.value)){
              setSelected([...selected,e.target.value])
            }
            else{

              setSelected(selected.filter((removeVal)=>removeVal!==e.target.value))
            }
           }}
           //defaultChecked={selected?.includes(option[0])}
           />
         </ListItemIcon>
         <ListItemText primary={option[1].tableName} />
       </MenuItem>
})}
      </Select>
    </FormControl>
  );
}
AuthAccessDropDown.propTypes = {
  dbId: PropTypes.string,
  selected: PropTypes.any,
  setSelected: PropTypes.func
};