import Modal from "@mui/material/Modal";
import { Importer, ImporterField } from 'react-csv-importer';
import { addMultipleRow } from "../../table/addRow";
import { toast } from "react-toastify";
import React from "react";
import "./importCSV.scss"
import "react-csv-importer/dist/index.css";
import { useDispatch } from "react-redux";
import { PropTypes } from "prop-types";

function ImportCSV ({table, showImportCSV, setShowImportCSV}) {
    const excludedFields = ['rowid','autonumber','createdat','createdby','updatedby','updatedat']
    const dispatch = useDispatch();
    return ( 
    <Modal
        disableRestoreFocus
        open={showImportCSV}
        onClose={()=>setShowImportCSV(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="import-csv-div">
          <Importer
              dataHandler = {async(rows) => {
                addMultipleRow(dispatch, rows, true);
              }}
              onStart={({ file }) => {
                const extension = file.path.split('.').pop();
                if(extension !== 'csv'){
                  toast.error("Please select a CSV file")
                  setShowImportCSV(false);
                }
              }}
              onComplete={() => {
                setShowImportCSV(false);
              }}
              >
              {
                Object.entries(table?.[1]?.fields).map(field=>{
                  if(!excludedFields.includes(field[0])){
                    return <ImporterField key={field[0]} name={field[0]} label={field[1].fieldName} optional/>
                  }
                })
              }
          </Importer>
        </div>
      </Modal>
      )
}
ImportCSV.propTypes = {
    showImportCSV:PropTypes.bool,
    setShowImportCSV:PropTypes.func,
    table: PropTypes.array
};
export default ImportCSV;