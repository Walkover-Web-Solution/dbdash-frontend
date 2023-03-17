import React from 'react'
import { PropTypes } from 'prop-types';


function RetrieveRecord(props) {
  return (
    <div>Retrieve Record</div>
  )
}

RetrieveRecord.propTypes = {
  db: PropTypes.string,
  table:PropTypes.string
}
export default RetrieveRecord