import React from 'react'
import './Codeblock';
import { PropTypes } from 'prop-types';

function ResponseBox(props) {

    return (
        <div className='response-box'>

            {props?.response}
        </div>
    )
}
ResponseBox.propTypes = {
    response: PropTypes.any
}
export default ResponseBox