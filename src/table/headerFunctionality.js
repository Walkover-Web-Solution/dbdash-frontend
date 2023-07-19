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



export function getPropertyIcon(data_type) {
  let propertyIcon;

  switch (data_type) {
    case "singlelinetext":
      propertyIcon = <TextFormatIcon  fontSize={variables.iconfontsize1}  />;
      break;
    case "formula":
      propertyIcon = <FunctionsIcon  fontSize={variables.iconfontsize1}  />;
      break;
    case "datetime":
      propertyIcon = <DateRangeIcon  fontSize={variables.iconfontsize1}  />;
      break;
    case "checkbox":
      propertyIcon = <CheckIcon  fontSize={variables.iconfontsize1}  />;
      break;
    case "numeric":
      propertyIcon = <TagIcon  fontSize={variables.iconfontsize1}  />
      break;
    case "longtext":
      propertyIcon = <NotesIcon  fontSize={variables.iconfontsize1}  />
      break;
    case "singleselect":
      propertyIcon = <ArrowDropDownCircleIcon  fontSize={variables.iconfontsize1}  />;
      break;
    // case "multiselect":
    //   propertyIcon = <DoneAllIcon  fontSize={variables.iconfontsize1}  />;
    //   break;
    case "createdby":
      propertyIcon = <PersonPinIcon  fontSize={variables.iconfontsize1}  />;
      break;
    case "createdat":
      propertyIcon = <MoreTimeIcon  fontSize={variables.iconfontsize1}  />;
      break;
      case "updatedat":
        propertyIcon = <MoreTimeIcon  fontSize={variables.iconfontsize1}  />;
        break;
    case "attachment":
      propertyIcon = <InsertDriveFileIcon  fontSize={variables.iconfontsize1}  />;
      break;
    case "link":
      propertyIcon = <ArrowForwardIcon   fontSize={variables.iconfontsize1} />
      break;
    case "lookup":
      propertyIcon = <ManageSearchOutlinedIcon  fontSize={variables.iconfontsize1}  />;
      break;
    case "rowid":
      propertyIcon = <KeyIcon  fontSize={variables.iconfontsize1}  />;
      break;
    case "email":
      propertyIcon = <EmailIcon  fontSize={variables.iconfontsize1}  />;
      break;
    case "phone":
      propertyIcon = <LocalPhoneIcon  fontSize={variables.iconfontsize1}  />;
      break;
    case "multipleselect":
      propertyIcon = <DoneAllIcon  fontSize={variables.iconfontsize1}  />;
      break;
    case "autonumber":
      propertyIcon = <PinIcon  fontSize={variables.iconfontsize1}  />;
      break;
      case "updatedby":
        propertyIcon = <PersonIcon  fontSize={variables.iconfontsize1}  />;
        break;
    default:
      propertyIcon = <MultiIcon  fontSize={variables.iconfontsize1} />;
      break;
  }

  return propertyIcon;
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