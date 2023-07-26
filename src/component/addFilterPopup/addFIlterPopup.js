import React, { useEffect, useState, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import { updateQuery } from "../../api/filterApi";
import { getAllTableInfo } from "../../store/allTable/allTableSelector";
import { useDispatch } from "react-redux";
import { setAllTablesData } from "../../store/allTable/allTableSlice";
import variables from '../../assets/styling.scss';
import CircularProgress from '@mui/material/CircularProgress';
import CustomAutoSuggest from "../customAutoSuggest/customAutoSuggest";
import CloseIcon from "@mui/icons-material/Close";
import { filterQueryByAi } from "../../api/filterApi";
import "./addFilterPopup.scss"
import { customUseSelector } from "../../store/customUseSelector";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  maxHeight: "calc(100vh - 100px)", // Set the maximum height of the popup
  overflowY: "auto", // Add scroll when content overflows
  bgcolor: "background.paper",
};


export default function AddFilterPopup(props) {
  // const navigate = useNavigate();
  const editableDivRef  = useRef()
  const editableDivRef2  = useRef()
  console.log("ljdfhglh");
  const AllTableInfo =customUseSelector((state) => getAllTableInfo(state));
  const [filterName, setFilterName] = useState("");
  // const [html, setHtml] = useState("");
  const [html2, setHtml2] = useState("");
  const [text, setText] = useState("");
  const [text2, setText2] = useState("");
const [showsecondfield,setShowsecondfield]=useState(true);
const [showsavebutton,setShowsavebutton]=useState(true);

  const [fields, setFields] = useState([]);
  // const [aiQuery, setAiQuery] = useState("");
  const [defaultValue, setDefaultValue] = useState(
    AllTableInfo?.tables[props?.tableName]?.filters[props?.filterId]?.htmlToShow || ""
  );
  const textFieldRef = useRef(null);
  const buttonContainerRef = useRef(null);
  const dispatch = useDispatch();
  const [textFieldHeight, setTextFieldHeight] = useState(null);

  const handleClose = () => {
    props?.setEdit(false);
    props.setOpen(false);
  };



  const tableData = async () => {
    const myObj = AllTableInfo?.tables[props?.tableName]?.fields;
    const arr = Object.keys(myObj).map((key) => ({
      name: myObj[key].fieldName,
      content: key,
    }));
    setFields(arr);
  };

  useEffect(() => {
    tableData();
  }, [props.tableName]);

  useEffect(() => {
    if (props?.edit === true) {
      const editDataValues = AllTableInfo?.tables[props?.tableName]?.filters[props?.filterId]?.query;
      const htmlToShow = AllTableInfo?.tables[props?.tableName]?.filters[props?.filterId]?.htmlToShow;
      setDefaultValue(htmlToShow);
      const searchString = "where";
      if (editDataValues.includes(searchString)) {
        const index = editDataValues.indexOf(searchString);
        if (index !== -1) {
          editDataValues.substring(index + searchString.length).trim();
        }
      }
      setFilterName(AllTableInfo.tables[props?.tableName].filters[props?.filterId].filterName);
    }
  }, [props]);

  const updateFilter = async () => {
    let queryToSend = " ";
    // if (
    //   props?.dbData?.db?.tables[props?.tableName]?.view && Object.values(props?.dbData?.db?.tables[props?.tableName]?.view?.fields).length >= 1 ) {
    //   // const viewId = props?.dbData?.db?.tables[props?.tableName]?.view?.id;
    //   queryToSend = text2.trim();
    // } else {
      queryToSend =  text2.trim();
    // }
    return queryToSend;
  };
  const handleQuery=async () => { 
    let textquery=text.trim();

    const data ={
      query: textquery
    }

    const applyFilter=await filterQueryByAi(props.dbId,data);
    setDefaultValue(applyFilter?.data?.data);
setShowsecondfield(true);
    setText2(applyFilter?.data?.data);
    setHtml2(applyFilter?.data?.data);

  
    
   

  }
  

      
  //   }
  //   const filter = await createFilter(props?.dbId, props?.tableName, dataa)
  //   const filters = filter?.data?.data?.data?.tables[props?.tableName]?.filters;
  //   const filterKey = Object.keys(filters).find(key => filters[key].filterName === filterName);
  //     dispatch(setAllTablesData(
  //     {
  //       "dbId": props?.dbId,
  //       "tables": filter.data.data.data.tables
  //     }
  //   ))
  //   navigate(`/db/${props?.dbId}/table/${props?.tableName}/filter/${filterKey}`);
  //   return dataa;
  // }

  const editQueryData = async () => {
    const data = await updateFilter();
    const dataa = {
      filterId: props?.filterId,
      filterName: filterName,
      query: data,
      htmlToShow: html2,
    };

    const updatedFilter = await updateQuery(props?.dbId, props?.tableName, dataa);
    dispatch(
      setAllTablesData({
        dbId: props?.dbId,
        tables: updatedFilter.data.data.tables,
      })
    );
    setShowsavebutton(true);
    handleClose();
  };

  const handleTextChange = (text) => {
    setText(text.trim());
    adjustTextFieldHeight();
  };

  const handleTextChange2 = (text2, html2) => {
    setText2(text2.trim());
    setHtml2(html2);
    adjustTextFieldHeight();
  };

  const adjustTextFieldHeight = () => {
    const textField = textFieldRef.current;
    if (textField) {
      textField.style.height = "auto";
      textField.style.height = textField.scrollHeight + "px";
      setTextFieldHeight(textField.scrollHeight);
    }
  };


  useEffect(() => {
    updateButtonContainerPosition();
  }, [textFieldHeight]);
  const updateButtonContainerPosition = () => {
    const textField = textFieldRef.current;
    const buttonContainer = buttonContainerRef.current;
    if (textField && buttonContainer) {
      const textFieldRect = textField.getBoundingClientRect();
      const buttonContainerRect = buttonContainer.getBoundingClientRect();
      if (textFieldRect.bottom > buttonContainerRect.top) {
        buttonContainer.style.position = "relative";
        buttonContainer.style.marginTop = "10px";
      } else {
        buttonContainer.style.position = "absolute";
        buttonContainer.style.top = `${textFieldRect.bottom}px`;
        buttonContainer.style.marginTop = "0";
      }
    }
  };
  
  return (
    <Box>
      <Modal
        disableRestorecFocus
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
        <div className="popupheader">     <Typography className="addfilter-header" id="title" variant="h6" component="h2">
              filter
            </Typography>
            <CloseIcon className="close-icon" onClick={handleClose} />
          </div>

          <Box className="popup-content">
            <Box className="edit-div">
              <div className="edit-div-inner">
                <CustomAutoSuggest
                  getInputValueWithContext={handleTextChange}
                  symbolForSearching={' '}
                  suggestion={fields}
                  editableDivRef={editableDivRef2}
                  setText={setText}
                  groupByGroupName={false}
                  ref={textFieldRef}
                />
              </div>
            </Box>
            <Box className="button-container">
              <Button
                className="mui-button-outlined"
                variant="outlined"
                onClick={() => {
                  handleQuery();
                  setShowsecondfield(false);
                }}
                style={{fontSize:variables.editfilterbutttonsfontsize}}
              >
                Generate Query by AI
              </Button>
            </Box>
            <br />
            <Box className="edit-div">
              <div className="edit-div-inner">
                {showsecondfield ? (
                  <CustomAutoSuggest
                    editableDivRef={editableDivRef}
                    groupByGroupName={false}
                    symbolForSearching={' '}
                    getInputValueWithContext={handleTextChange2}
                    width="100%"
                    suggestion={fields}
                    setText={setText}
                    defaultValue={defaultValue}
                  />
                ) : (
                  <div className="loader-container">
                    <CircularProgress />
                  </div>
                )}
              </div>
            </Box>
          </Box>

          <Box className="button-container">
            {showsecondfield && showsavebutton ? (
              <Button
                className="mui-button"
                onClick={() => {
                  setShowsavebutton(false);
                  editQueryData();
                }}
                variant="contained"
              >
                Save
              </Button>
            ) : (
              showsecondfield && <CircularProgress />
            )}
          </Box>

        </Box>
      </Modal>
    </Box>
    
  );
}

AddFilterPopup.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dbId: PropTypes.any,
  tableName: PropTypes.any,
  edit: PropTypes.any,
  filterId: PropTypes.any,
  dbData: PropTypes.any,
  setEdit: PropTypes.func,
};

