/*eslint-disable*/
import React from 'react';
import SimpleAutoSuggest from './SimpleAutoSuggest/SimpleAutoSuggest';
import GroupedSuggestion from './groupedSuggestion/GroupedSuggestion';
import './customAutoSuggest.css';

const CustomAutoSuggest = (props) => {
    if (props?.groupByGroupName) return <GroupedSuggestion {...props} />
    return <SimpleAutoSuggest {...props} />
};

export default CustomAutoSuggest;