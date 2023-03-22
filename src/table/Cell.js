import React, {useEffect, useRef, useState} from "react";
import ContentEditable from "react-contenteditable";
import Relationship from "./Relationship";
import {usePopper} from "react-popper";
import {grey} from "./colors";
import PlusIcon from "./img/Plus";
import {randomColor} from "./utils";
import { addColumns, updateCells } from "../store/table/tableThunk";
import { useDispatch } from "react-redux";

export default function Cell({value: initialValue, row, column: {id, dataType, options}, dataDispatch}) {


  const dispatch=useDispatch();

  const [value, setValue] = useState({value: initialValue, update: false});
  const [selectRef, setSelectRef] = useState(null);
  const [selectPop, setSelectPop] = useState(null);
  const [showSelect, setShowSelect] = useState(false);
  // const [open,setOpen] = useState(false)
  const onChange = (e) => {
    setValue({value: e.target.value, update: false});
  };
  const [showAdd, setShowAdd] = useState(false);
  const [addSelectRef, setAddSelectRef] = useState(null);
  const interviewDateRef = useRef();
  const [inputBoxShow,setInputBoxShow] = useState(false)
  useEffect(() => {

    setValue({value: initialValue, update: false});
  }, [initialValue]);

  useEffect(() => {
    if (value?.update) {
      // dataDispatch({type: "update_cell", columnId: id, rowIndex: index, value: value.value});
      dispatch(updateCells({
        columnId: id, rowIndex: row.original.id, value: value.value
      }))
    }
  }, [value, dispatch, id, row.index]);

  function handleOptionKeyDown(e) {
    if (e.key === "Enter") {
      if (e.target.value !== "") {

        // dispatch({
        //   type: "add_option_to_column",
        //   option: e.target.value,
        //   backgroundColor: randomColor(),
        //   columnId: id
        // });
        dispatch(addColumns({
          option: e.target.value,
          backgroundColor: randomColor(),
          columnId: id
        }))
      }
      setShowAdd(false);
    }
  }

  function handleAddOption() {
    setShowAdd(true);
  }

  function handleOptionBlur(e) {
    if (e.target.value !== "") {


      dispatch(addColumns({
        option: e.target.value,
        backgroundColor: randomColor(),
        columnId: id
      }))

      dataDispatch({
        type: "add_option_to_column",
        option: e.target.value,
        backgroundColor: randomColor(),
        columnId: id
      });
    }
    setShowAdd(false);
  }

  const {styles, attributes} = usePopper(selectRef, selectPop, {
    placement: "bottom-start",
    strategy: "fixed"
  });

  function getColor() {
    let match = options.find((option) => option.label === value.value);
    return (match && match.backgroundColor) || grey(300);
  }

  useEffect(() => {
    if (addSelectRef && showAdd) {
      addSelectRef.focus();
    }
  }, [addSelectRef, showAdd]);

  let element;
  switch (dataType) {
    case "createdby" :
      element = (
        <input type ="text"
        readOnly="readonly"
        defaultValue ={(value?.value && value?.value?.toString()) || ""}
        className='data-input'
      />
      );
      break;
      case "createdat" :
        element = (
          <input type ="text"
          readOnly="readonly"
          defaultValue ={(value?.value && value?.value?.toString()) || ""}
          className='data-input'
        />
        );
        break;
    case "checkbox":
      element = (
        <input type="checkbox" 
        checked={value.value}
        onChange={()=>{
          setValue(() => ({value: !(value.value), update: true}))
        }}
        />
      );
      break;
    case "datetime":
        // {console.log(value)}
      element = 
      // (open===false?
      //  <input onClick={()=>setOpen(true)} />:
        
      ( 
        <>
      
      <input type="datetime-local" id="meeting-time" name="meeting-time"
        min="2023-03-20T00:00" max="2023-12-31T23:59" ref ={interviewDateRef} 
        value ={new Date(value.value || null)?.toISOString()?.slice(0,16)}
        onClick={(e)=>{ if(e.detail == 2){
          console.log("hello")
        }}}
        onChange={onChange}
        style={{"display":inputBoxShow?"block":"none"}}
        // onClick={()=>setOpen(true)}

        onBlur={() => setValue((old) => ({value: old.value, update: true}))}
        />
        <input type ="text" 
         style={{"display":inputBoxShow?"none":"block"}}
        onClick={(e)=>{ if(e.detail == 2){
          console.log("hello")
          setInputBoxShow(true);
          console.log(interviewDateRef.current);
          interviewDateRef.current.focus();
          interviewDateRef.current.showPicker();
        }}}/>
        </>
     
        );
      break;
    case "text":
      element = (
        <ContentEditable
          html={(value?.value && value?.value?.toString()) || ""}
          onChange={onChange}
          onBlur={() => setValue((old) => ({value: old.value, update: true}))}
        // onMouseDown={()=>{

        // }}
          className='data-input'
        />
      );
      break;
    case "varchar":
      element = (
        <ContentEditable
          html={(value?.value && value?.value?.toString()) || ""}
          onChange={onChange}
          onBlur={() => setValue((old) => ({value: old.value, update: true}))}
          className='data-input'
        />
      );
      break;
    case "integer":
      element = (
        <ContentEditable
          html={(value?.value && value.value.toString()) || ""}
          onChange={onChange}
          onBlur={() => setValue((old) => ({value: old.value, update: true}))}
          className='data-input text-align-right'
        />
      );
      break;
    case "select":
      element = (
        <>
          <div
            ref={setSelectRef}
            className='cell-padding d-flex cursor-default align-items-center flex-1'
            onClick={() => setShowSelect(true)}>
            {value.value && <Relationship value={value.value} backgroundColor={getColor()} />}
          </div>
          {showSelect && <div className='overlay' onClick={() => setShowSelect(false)} />}
          {showSelect && (
            <div
              className='shadow-5 bg-white border-radius-md'
              ref={setSelectPop}
              {...attributes.popper}
              style={{
                ...styles.popper,
                zIndex: 4,
                minWidth: 200,
                maxWidth: 320,
                padding: "0.75rem"
              }}>
              <div className='d-flex flex-wrap-wrap' style={{marginTop: "-0.5rem"}}>
                {options.map((option,index) => (
                  <div key={index}
                    className='cursor-pointer'
                    style={{marginRight: "0.5rem", marginTop: "0.5rem"}}
                    onClick={() => {
                      setValue({value: option.label, update: true});
                      setShowSelect(false);
                    }}>
                    <Relationship value={option.label} backgroundColor={option.backgroundColor} />
                  </div>
                ))}
                {showAdd && (
                  <div
                    style={{
                      marginRight: "0.5rem",
                      marginTop: "0.5rem",
                      width: 120,
                      padding: "2px 4px",
                      backgroundColor: grey(200),
                      borderRadius: 4
                    }}>
                    <input
                      type='text'
                      className='option-input'
                      onBlur={handleOptionBlur}
                      ref={setAddSelectRef}
                      onKeyDown={handleOptionKeyDown}
                    />
                  </div>
                )}
                <div
                  className='cursor-pointer'
                  style={{marginRight: "0.5rem", marginTop: "0.5rem"}}
                  onClick={handleAddOption}>
                  <Relationship
                    value={
                      <span className='svg-icon-sm svg-text'>
                        <PlusIcon />
                      </span>
                    }
                    backgroundColor={grey(200)}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      );
      break;
      case "check":
      element =(<><div   {...row.getRowProps()} className= "tr">
          <input type="checkbox" {...row.getToggleRowSelectedProps()} />
          </div>
      </>)
          
        break;

    default:
      element = null;
      break;
  }

  return element;
}
