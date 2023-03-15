
import React from 'react'
import PropTypes from "prop-types";
import MainTable from '../../table/mainTable';
export default function SingleTable() {
  
  return (
    <> 
      <MainTable/>
    </>
  )
}
SingleTable.propTypes = {
  table: PropTypes.string,
  dbId: PropTypes.string
};