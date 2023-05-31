import React, { useState } from 'react';
import { Box } from '@mui/material';
import PopupModal from '../popupModal';
import Button from '@mui/material/Button';
import { OrgList } from './orgList';
import { PropTypes } from 'prop-types';
import { selectOrgandDb } from "../../store/database/databaseSelector.js";
import { useSelector, useDispatch } from 'react-redux';
import { createOrgThunk } from '../../store/database/databaseThunk';
import { toast } from 'react-toastify';

export default function WorkspaceCombined() {
  const [tabIndex, setTabIndex] = useState(0);
  const alldbs = useSelector((state) => selectOrgandDb(state)) || [];
  const [addedelement, setAddedelement] = useState(null);
  const dispatch = useDispatch();
  const [org, setOrg] = useState();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const sortAndRenderOrgList = () => {
    return Object.entries(alldbs)
      .sort(([orgIdA, dbsA], [orgIdB, dbsB]) => {
        if (addedelement) {
          if (orgIdA === addedelement) {
            return 1;
          } else if (orgIdB === addedelement) {
            return -1;
          }
        }
        
        const orgA = dbsA[0]?.org_id?.name?.toUpperCase();
        const orgB = dbsB[0]?.org_id?.name?.toUpperCase();
        return orgA?.localeCompare(orgB);
      })

      .map(([orgId, dbs], index) => {
        console.log(orgId);
        const sortedDbs = [...dbs].sort((dbA, dbB) => {
          const dbsA = dbA.name?.toUpperCase();
          const dbsB = dbB.name?.toUpperCase();
          return dbsA?.localeCompare(dbsB);
        });
  
        return (
          <>
          <Box key={orgId}>
            <OrgList orgId={orgId} tabIndex={tabIndex} setTabIndex={setTabIndex} index={index} dbs={sortedDbs} />
          </Box>
          </>
        );
      });
  };
  

  const saveOrgToDB = async () => {
    const userid = localStorage.getItem("userid");
    dispatch(createOrgThunk({ name: org, user_id: userid })).then((e) => {
      toast.success('Organisation created successfully!');
      setAddedelement(e.payload.data.org_id._id);
    });
    setOpen(false);
  };

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', m: 3 }}>
          <Button onClick={handleOpen} variant="contained">Create Organisation</Button>
          <PopupModal
            title="create organisation"
            label="Organization Name"
            open={open}
            setOpen={setOpen}
            submitData={saveOrgToDB}
            setVariable={setOrg}
            joiMessage={"Organization name"}
          />
        </Box>
        <Box>
          {sortAndRenderOrgList()}
        </Box>
      </Box>
    </>
  );
}

WorkspaceCombined.propTypes = {
  dbs: PropTypes.string
};
