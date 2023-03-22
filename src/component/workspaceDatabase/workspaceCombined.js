import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import PopupModal from '../popupModal';
import Button from '@mui/material/Button';
import { UserAuth } from "../../context/authContext.js"
import { OrgList } from './orgList';
import { PropTypes } from 'prop-types';
import { selectOrgandDb } from "../../store/database/databaseSelector.js"
import { useSelector } from 'react-redux';
import { createOrgThunk } from '../../store/database/databaseThunk';
import { useDispatch } from "react-redux";

export default function WorkspaceCombined() {

  const { user } = UserAuth();
  const alldbs = useSelector((state) => selectOrgandDb(state)) || [];
  const dispatch = useDispatch();

  //state to display modal
  const [org, setOrg] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  useEffect(() => {
    // dispatchs(bulkAddColumns(makeData(10)));
    // if(user?.email)
    // getOrgAndDb();
  }, [user])

  const saveOrgToDB = async () => {
    const userid = localStorage.getItem("userid");
    dispatch(createOrgThunk({ name: org, user_id: userid }));
    setOpen(false);
  };
  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', m: 3 }}>
          <Button onClick={handleOpen} variant="contained">Create Organisation</Button>
          <PopupModal title="create organisation" label="Organization Name" open={open} setOpen={setOpen}
            submitData={saveOrgToDB} setVariable={setOrg} />
        </Box>

        <Box>
          {Object.entries(alldbs).map(([orgId, dbs]) => (
            <Box key={orgId}>
              <OrgList orgId={orgId} dbs={dbs} />

            </Box>
          ))
          }
        </Box>
      </Box>

    </>
  );
}
WorkspaceCombined.propTypes = {
  dbs: PropTypes.string

}