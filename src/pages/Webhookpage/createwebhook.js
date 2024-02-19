import React, {  useEffect, useMemo, useRef, useState } from "react";
import "./Webhookpage.scss";
import {
  Box,
  Typography,
  Button,
  FormControl,
  MenuItem,
  Modal,
} from "@mui/material";
import { PropTypes } from "prop-types";
import { createWebhook, updateWebhook } from "../../api/webhookApi";
import CloseIcon from '@mui/icons-material/Close';
import CustomTextField from "../../muiStyles/customTextfield";

function Createwebhook(props) {
  let nameRef = useRef("");
  let [action, setAction] = useState("");
  let urlRef = useRef("");
  let selectedTableRef = useRef(props?.tableId || "");
  const [disabled,setDisabled]=useState(true);

  const createWebHook = async () => {
    
    const data = {
      webhookName: nameRef.current,
      webhookUrl: urlRef.current,
      isActive: true,
      webhookEvent: action,
    };

    if (props?.webhookid) {
      data.currentWebhookEvent = props?.condition;
      const isConditionUpdated = props?.condition !== action;
      if (!isConditionUpdated) {
        delete data.webhookEvent;
      }
      const {updatedWebhook} = await updateWebhook(props?.dbId, props?.webhookid, data).then(res => res.data.data);
      props.setWebhooks((currentWebhooks) => {
        if(isConditionUpdated){
          delete currentWebhooks[props.condition]?.[props.webhookid];
          currentWebhooks[action] ??= {};
          currentWebhooks[action][props.webhookid] = updatedWebhook
        }else{
          currentWebhooks[props.condition][props.webhookid] = updatedWebhook;
        }
        return currentWebhooks;
      })
    } else {
       let {webhookId, webhookData} = await createWebhook(props.dbId, selectedTableRef.current, data).then(res => res.data.data);
       props.setWebhooks((currentWebhook) => {
          currentWebhook ??= {};
          currentWebhook[action] ??= {};
          currentWebhook[action][webhookId] = webhookData
          return currentWebhook;
       })
    }
    handleClose();
    nameRef.current = "";
    setAction("");
    urlRef.current = "";
    
    props.setNewcreated(props.newcreated + 1);
  };
  const handleClose = () => {
    if (props.webhookid) {
      props?.closeDropdown();
    }
    props.handleClose();
    nameRef.current = "";
    setAction("");  // FIXME : To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    urlRef.current = "";
  };

  useEffect(() => {
    if (props.webhookid) {
      nameRef.current = props.webhookname;
      setAction(props.condition);
      selectedTableRef.current = props?.tableId;
      urlRef.current = props.weburl;
    }
  }, [props.webhookid]);

  const memoizedButton = useMemo(() => {
    return (
      <Button
        variant="contained"
        disabled={disabled}
        className={`create-webhook-key-button ${disabled ? 'mui-button-disabled' : 'mui-button'}`}
        onClick={() => {
          createWebHook();
          handleClose();
        }}
      >
        {props.webhookid ? 'Update' : 'Create'}
      </Button>
    );
  }, [disabled]);
  const whInfo = useMemo(()=>{
    return (
      action ? <Typography variant="caption" className="mb-2" color="#555">when a row is {action.replace("Row","")}d, data will be send to the given webhook through a POST request</Typography>
             : null
    )
  }, [action]);
  return (
    <>
      <Modal open={props.open} onClose={handleClose}>
        <Box
          className="create-webhook-key-main-container"
         
        >
          <Box className="create-webhook-key-content-container" >
          <div className="create-webhook-popupheader popupheader" >    <Typography className="create-webhook-popupheader-heading"  id="title" variant="h6" component="h2">
            {props?.heading}
          </Typography><CloseIcon className="create_webhook-close-icon"  onClick={props?.handleClose}/></div>

            <Box className="create-webhook-key-row" >
              <Typography className="create-webhook-key-label">Name</Typography>
              <CustomTextField
                id="standard-basic"
                label="Name"
                variant="standard"
                defaultValue={nameRef?.current}

                onChange={(e) => {
                  nameRef.current = e.target.value;
                  setDisabled(!nameRef.current || !action || !selectedTableRef.current ||  !urlRef.current)

                }}
              />
            </Box>
            <Box className="create-webhook-key-row" >
              <Typography className="create-webhook-label">Action</Typography>
              <FormControl
                variant="standard"
                className="create-webhook-key-dropdown"
              >
                <CustomTextField
                  id="action"
                  select
                defaultValue={action}

                  label="Action"
                  
                  className="create-webhook-action-text-field"
                  onChange={(e) => {

                    setAction(e.target.value);
                    setDisabled(!nameRef.current || !action || !selectedTableRef.current ||  !urlRef.current)

                  }}
                >
                  <MenuItem value="createRow">Create Row</MenuItem>
                  <MenuItem value="deleteRow">Delete Row</MenuItem>
                  <MenuItem value="updateRow">Update Row</MenuItem>
                </CustomTextField>
                {whInfo}
              </FormControl>
            </Box>
            { props?.tables && <Box className="create-webhook-key-row" >
              <Typography className="create-webhook-label">Tables</Typography>
              <FormControl
                variant="standard"
                className="create-webhook-key-dropdown"
              >
                <CustomTextField
                  id="tables"
                  select
                  label="Tables"
                  className="create-webhook-table-text-field"
                defaultValue={selectedTableRef?.current}

                  onChange={(e) => {

                    selectedTableRef.current = e.target.value;
                  setDisabled(!nameRef.current || !action || !selectedTableRef.current ||  !urlRef.current)

                  }}
                >
                  {props?.tables && 
                    Object.entries(props?.tables).map(([key, value]) => {
                      return (
                        <MenuItem key={key} value={key}>
                          {value?.tableName}
                        </MenuItem>
                      );
                    })}
                </CustomTextField>
              </FormControl>
            </Box>}

            <Box className="create-webhook-key-row" >
              <Typography className="create-webhook-key-label">URL</Typography>
              <CustomTextField
                id="standard-basic"
                defaultValue={urlRef?.current}
                label="Url"
                variant="standard"
                onChange={(e) => {
                  urlRef.current = e.target.value;
                  setDisabled(!nameRef.current || !action || !selectedTableRef.current ||  !urlRef.current)

                }}
              />
            </Box>
          </Box>
          <Box className="create-webhook-button-box">
           {memoizedButton}
          
          </Box>
        </Box>
      </Modal>
    </>
  );
}

Createwebhook.propTypes = {
  senddataa1: PropTypes.any,
  open: PropTypes.any,
  condition: PropTypes.any,
  dataforwebhook: PropTypes.any,
  tables: PropTypes.any,
  setOpen: PropTypes.any,
  handleClose: PropTypes.any,
  dbId: PropTypes.any,
  tableId: PropTypes.any,
  setNewcreated: PropTypes.any,
  newcreated: PropTypes.any,
  heading:PropTypes.any,
  setWebhooks:PropTypes.any,
  webhookid: PropTypes.any,
  webhookname: PropTypes.any,
  weburl: PropTypes.any,
  filterId: PropTypes.any,
  closeDropdown: PropTypes.any,
};

export default Createwebhook;
