// import React from 'react'
import { PropTypes } from "prop-types";
import { Box } from "@mui/system";
// import CodeSnippet from '../codeSnippet';
import { Typography } from "@mui/material";
import CodeBlock from "./Codeblock";
import React from "react";
import Records from "./records";
// import Grid from "@mui/material/Grid";
// import { getAllfields } from "../../../api/fieldApi";
// import ControlPointIcon from '@mui/icons-material/ControlPoint';


function DeleteRecord(props) {
  // const [fieldData, setFieldData] = useState(null);
  // const tableData = async () => {
  //   const data = await getAllfields(props.db, props.table);
  //   setFieldData(data?.data?.data?.fields);
  // };
  // useEffect(() => {
  //   tableData();
  // }, [props.db, props.table]);
  

  return (
    <>
    
      <CodeBlock
        code={`https://dbdash-backend-h7duexlbuq-el.a.run.app/${props.db}/${props.table}/{:rowId}`}
        header={`-H auth-key: YOUR_SECRET_API_TOKEN `}

      />

      <Box>
        <Typography style={{ fontWeight: "bold", fontSize: "24px" }}>
          Delete Table Records
        </Typography>
        <Typography>
          <Box>
            <br></br>
        
            <Records db={props.db} table={props.table}/>
          </Box>
        </Typography>

  
      </Box>
    </>
  );
}
DeleteRecord.propTypes = {
  db: PropTypes.string,
  table: PropTypes.string,
};
export default DeleteRecord;
