import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CloseIcon from "@mui/icons-material/Close";
import "./ShareLinkPopUp.scss";
import { customUseSelector } from "../../../store/customUseSelector";
import { useParams } from "react-router";
import { createViewTable } from "../../../api/viewTableApi";
import { useDispatch } from "react-redux";
import { setAllTablesData } from "../../../store/allTable/allTableSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
};

export default function ShareLinkPopUp(props) {
  const { setOpen, textvalue, open } = props;
  const handleClose = () => setOpen(false);
  const [link, setLink] = useState("Link");
  const params = useParams();
  const shareViewUrl = process.env.REACT_APP_API_BASE_URL;
  const dispatch = useDispatch();
  const handleCopy = () => {
    const textFieldValue = link;

    navigator.clipboard
      .writeText(textFieldValue)
      .then(() => {})
      .catch((error) => {
        console.error("Failed to copy text to clipboard:", error);
      });
    handleClose();
  };

  const AllTable = customUseSelector((state) => {
    const { tables } = state.tables;
    const { dbId, userAcess, userDetail } = state.tables;
    return { tables, dbId, userAcess, userDetail };
  });

  useEffect(async () => {
    const isViewExits =
      AllTable?.tables?.[params?.tableName]?.filters?.[params?.filterName]
        ?.viewId;
    if (isViewExits) {
      setLink(shareViewUrl + `/${isViewExits}`);
      return;
    }

    const data = {
      tableId: params?.tableName,
      filterId: params?.filterName,
    };
    const dataa1 = await createViewTable(AllTable.dbId, data);
    dispatch(
      setAllTablesData({
        dbId: dataa1.data.data.dbData._id,
        tables: dataa1.data.data.dbData.tables,
        orgId: dataa1.data.data.dbData.org_id,
      })
    );
    setLink(shareViewUrl + `/${dataa1.data.data.viewId}`);
  }, []);

  return (
    <Box>
      <Modal
        disableRestoreFocus
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="popupheader">
            {" "}
            <Typography
              className="sharedViewTitle"
              id="title"
              variant="h6"
              component="h2"
            >
              Share Link
            </Typography>
            <CloseIcon className="shareView-close-icon" onClick={handleClose} />
          </div>

          <Box className="Linkfield">
            <TextField
              autoFocus
              id={props?.id}
              name={props?.id}
              label="Link"
              variant="standard"
              value={link}
              // onChange={handleChange}
            />
          </Box>
          <Box className="shareView-actions">
            <Box>
              <CopyToClipboard text={textvalue}>
                <Button
                  variant="contained"
                  className="mui-button"
                  onClick={handleCopy}
                >
                  Copy
                </Button>
              </CopyToClipboard>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

ShareLinkPopUp.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  label: PropTypes.string,
  id: PropTypes.string,
  textvalue: PropTypes.string,
};
