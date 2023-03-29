import React, {  useEffect} from "react";
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

export default function AuthAccessDropDown({selected,setSelected,options,setOptions,dbId}) {

// const tableId = Object.entries(dbIds.authData.access).map(([tableId]) => tableId)
// console.log("AA gya Aa gya ",tableId)


  const getAllTableName = async (dbId) => {
    const data = await getDbById(dbId)
    
    setOptions(data.data.data.tables || {});
   
  }
  // console.log("options",options);

  // const optionIds = Object.keys(options).map((id) => {
  //   return id;
  // });
  // // console.log(optionIds);

  // const optionList = Object.entries(options).map(([id, {tableName}]) => {
  //   return {id, tableName};
  // });
  // console.log(optionList);

  

  // console.log(dbIds,124);
  // useEffect(() => {
  //  if(dbIds){
  //   //drs
  //  }
  // }, [dbIds])
  
  
console.log(selected);
// const tableId = Object.entries(dbIds?.authData?.access).map(([tableId]) => tableId);
// const optionList = Object.entries(options).map(([id, {tableName}]) => ({id, tableName}));

// const selectedTables = optionList
//   .filter(({id}) => tableId.includes(id))
//   .map(({tableName}) => tableName);

//   console.log("selectedTables", selectedTables);



  const isAllSelected =
    options.length > 0 && selected.length === options.length;

    // const tableIdArray = [];
    // if (options.length > 0) {
    //   for (const [key, value] of Object.entries(options)) {
    //     if (value.tableName === tableId) {
    //       tableIdArray.push(tableId);
    //       break;
    //     }
    //   }
    // }
    // console.log("tableid",tableIdArray)

  const handleChange = (event) => {
    const value = event.target.value;
  
    if (value[value.length - 1] !== "all")
    {setSelected(value);}
    // console.log("SetSelected",selected)
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
        
        >
          <ListItemIcon>
            <Checkbox onChange={(e)=>{ 
      // console.log("all this is")
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
        
           <Checkbox checked={selected?.includes(option[1].tableName)} value={option[1].tableName} onChange={(e)=>{
            if(!selected?.includes(e.target.value)){
              setSelected([...selected,e.target.value])
    // console.log("SetSelected1",selected)

            }
            else{

              setSelected(selected.filter((removeVal)=>removeVal!==e.target.value))
    // console.log("SetSelected2",selected)

            }
           }}
        
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
  setSelected: PropTypes.func,
  dbIds: PropTypes.object,
  options: PropTypes.object,
  setOptions: PropTypes.func,
};