import { Box } from "@mui/material";
import React from "react";
// import PropTypes from "prop-types";
import Navbar from "../component/apiDoc/navbarApi";
import MainNavbar from "../component/mainNavbar";



function ApiDocPage() {
    // const location = useLocation();
    // const [dbData, setDbData] = useState(null);

    // useEffect(() => {   
    //     if (location?.state) {
    //         setDbData(location?.state);
    //     } else {
    //         // handle case where no data was passed
    //     }
    // }, [props?.location?.state]);

    return (
        <>
        <Box>
      <MainNavbar/>
    </Box>
        <Navbar/>
       
   </>
    );
}

export default ApiDocPage;
// apidocPage.propTypes = {
//     location: PropTypes.shape({
//         state: PropTypes.object
//     })
// };
