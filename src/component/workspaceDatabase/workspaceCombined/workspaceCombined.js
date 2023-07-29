import React, { memo, useState } from 'react';
import { Box } from '@mui/material';
import PopupModal from '../../popupModal/popupModal';
import Button from '@mui/material/Button';
import { OrgList } from '../orgList/orgList';
import { PropTypes } from 'prop-types';
import { selectOrgandDb } from "../../../store/database/databaseSelector.js";
import {  useDispatch } from 'react-redux';
import { createOrgThunk } from '../../../store/database/databaseThunk';
import { toast } from 'react-toastify';
import './workspaceCombined.scss';
import  { customUseSelector } from '../../../store/customUseSelector';
 function WorkspaceCombined() {

  const [tabIndex, setTabIndex] = useState(0);
  const alldbs = customUseSelector((state) => selectOrgandDb(state) || []) ;
  const [addedelement, setAddedelement] = useState(null);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
const [openTemplate,setOpenTemplate]=useState(false);

  const handleOpen = () => setOpen(true);
  const sortAndRenderOrgList = () => {
    return Object.entries(alldbs)
      .sort(([orgIdA, dbsA], [orgIdB, dbsB]) => {
        if (addedelement) {
          if (orgIdA === addedelement) {
            return -1;
          } else if (orgIdB === addedelement) {
            return 1;
          }
        }

        const orgA = dbsA[0]?.org_id?.name?.toUpperCase();
        const orgB = dbsB[0]?.org_id?.name?.toUpperCase();
        return orgA?.localeCompare(orgB);
      })

      .map(([orgId, dbs], index) => {
        const sortedDbs = [...dbs].sort((dbA, dbB) => {
          const dbsA = dbA.name?.toUpperCase();
          const dbsB = dbB.name?.toUpperCase();
          return dbsA?.localeCompare(dbsB);
        });

        return (

          <Box key={index}>
            <OrgList orgId={orgId} tabIndex={tabIndex} setTabIndex={setTabIndex} index={index} dbs={sortedDbs} />
          </Box>

        );
      });
  };


  const saveOrgToDB = async (org_name) => {
    const userid = localStorage.getItem("userid");
    dispatch(createOrgThunk({ name: org_name, user_id: userid })).then((e) => {
      if(e.type.includes('fulfilled'))
      {
        toast.success('Organisation created successfully!');
        setAddedelement(e.payload.data.org_id._id);
      }
    });
    setOpen(false);
  };
  const handleTemplate = () => {
    window.open("https://dbdash-backend-h7duexlbuq-el.a.run.app/64a3fb1f135d26837027e15e");

  };


  return (
    <>
      <Box >
      <Box  className="workspacecombinedbox1" >
  <Button  onClick={handleOpen} className="mui-button createorgbutton" variant="contained" >
            Create Organisation
          </Button>
  <Button   onClick={handleTemplate} className="mui-button exploretemplatebutton" variant="contained" >
            Explore Templates
          </Button>
        </Box>
        {(open || openTemplate) && (open ? (
          <PopupModal
            title="create organisation"
            label="Organization Name"
            open={open}
            setOpen={setOpen}
            submitData={saveOrgToDB}
        
            joiMessage={"Organization name"}
          />
        ) : (
          <PopupModal
            title="create Template"
            label="Template Name"
            open={openTemplate}
            setOpen={setOpenTemplate}
            submitData={saveOrgToDB}
        
            joiMessage={"Organization name"}
          />
        ))}


      </Box>
      <Box>
        {sortAndRenderOrgList()}
      </Box>
    </>
  );
}

WorkspaceCombined.propTypes = {
  dbs: PropTypes.string
};

export default memo(WorkspaceCombined)
