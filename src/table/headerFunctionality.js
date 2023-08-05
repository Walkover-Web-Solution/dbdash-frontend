import React from 'react';
import MultiIcon from "./img/Multi";
import TagIcon from '@mui/icons-material/Tag';
// import PlusOneIcon from '@mui/icons-material/PlusOne';
import CheckIcon from '@mui/icons-material/Check';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FunctionsIcon from '@mui/icons-material/Functions';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import NotesIcon from '@mui/icons-material/Notes';
import variables from '../assets/styling.scss';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import PersonPinIcon from '@mui/icons-material/PersonPin';
// import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
// import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
// import QueueOutlinedIcon from '@mui/icons-material/QueueOutlined';
import { addColumnrightandleft, updateColumnHeaders } from '../store/table/tableThunk';
// import FontDownloadIcon from '@mui/icons-material/FontDownload';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PinIcon from '@mui/icons-material/Pin';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';



const iconMap = {
  singlelinetext: <TextFormatIcon fontSize={variables.iconfontsize1} />,
  formula: <FunctionsIcon fontSize={variables.iconfontsize1} />,
  datetime: <DateRangeIcon fontSize={variables.iconfontsize1} />,
  checkbox: <CheckIcon fontSize={variables.iconfontsize1} />,
  numeric: <TagIcon fontSize={variables.iconfontsize1} />,
  longtext: <NotesIcon fontSize={variables.iconfontsize1} />,
  singleselect: <ArrowDropDownCircleIcon fontSize={variables.iconfontsize1} />,
  createdby: <PersonPinIcon fontSize={variables.iconfontsize1} />,
  createdat: <MoreTimeIcon fontSize={variables.iconfontsize1} />,
  updatedat: <MoreTimeIcon fontSize={variables.iconfontsize1} />,
  attachment: <InsertDriveFileIcon fontSize={variables.iconfontsize1} />,
  link: <ArrowForwardIcon fontSize={variables.iconfontsize1} />,
  lookup: <ManageSearchOutlinedIcon fontSize={variables.iconfontsize1} />,
  rowid: <KeyIcon fontSize={variables.iconfontsize1} />,
  email: <EmailIcon fontSize={variables.iconfontsize1} />,
  phone: <LocalPhoneIcon fontSize={variables.iconfontsize1} />,
  multipleselect: <DoneAllIcon fontSize={variables.iconfontsize1} />,
  autonumber: <PinIcon fontSize={variables.iconfontsize1} />,
  updatedby: <PersonIcon fontSize={variables.iconfontsize1} />,
};
export function getPropertyIcon(data_type) {
  return iconMap[data_type] || <MultiIcon fontSize={variables.iconfontsize1} />;
}

export function handleRenameColumn(props, header, params, dispatch) {
    dispatch(updateColumnHeaders({
      columnId: props?.fields[props?.menu?.col]?.id,
      tableName: params?.tableName,
      dbId: params?.dbId,
      label: header
    }));
}

export const createDuplicateColumn = (params, props, dispatch,duplicateField) => {
  dispatch(addColumnrightandleft({
    dbId: params?.dbId,
    direction: "right",
    position: props?.fields[props?.menu?.col]?.id,
    duplicateField: `${duplicateField}`,
    tableId: params?.tableName,
  }));
};


export const hideColumns = async (dispatch, params, props,metaData) => {
  dispatch(
    updateColumnHeaders({
      dbId: params?.dbId,
      tableName: params?.tableName,
      columnId: props?.fields[props?.menu.col].id,
      metaData: metaData,
    })
  );
};