import { makeStyles, withStyles } from '@mui/styles';
import variables from '../assets/styling.scss';
import { Switch } from '@mui/material';

export const HeaderMenuStyles= makeStyles(() => ({
  simpleMenu: {
    width: '175px',
    padding: '8px 0',
    borderRadius: '6px',
    boxShadow: '0px 0px 1px rgba(62, 65, 86, 0.7), 0px 6px 12px rgba(62, 65, 86, 0.35)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    fontSize: variables.headermenufontsize,
    fontWeight: 600,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
  },
  danger: {
    color: 'rgba(255, 40, 40, 0.8)',
    '&:hover': {
      color: 'rgba(255, 40, 40, 1)',
    },
  },
  menuItem: {
    padding: '6px 8px',
    color: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      color: 'rgba(0, 0, 0, 0.9)',
    },
    transition: 'background-color 100ms',
    cursor: 'pointer',
  },
  centeredText: {
    display: 'block',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
}));
export  const SelectBoxStyles = makeStyles(() => ({
    formControl: {
      "& .MuiInputLabel-root": {
        color: `${variables.basictextcolor}`, // Change the label color here
      },
      "& .MuiSelect-icon": {
        color: `${variables.basictextcolor}`, // Change the icon color here
      },
      "& .MuiSelect-root": {
        borderColor: `${variables.basictextcolor}`, // Change the border color here
        borderRadius: 0,
        height: "36px",
        color: `${variables.basictextcolor}`,
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "black", // Change the border color here
        },
      },
    },
    selectEmpty: {
      marginTop: 2,
    },
  }));

  export const navbarApiselectbox=makeStyles(()=>({
    formControl: {

        margin: 1,
        marginLeft: 0,
        marginTop: 7,
        marginRight: 3,
        minWidth: 120,
    }

  }));
  
  export const selectFilePopupStyles = makeStyles({
    input: {
      display: "none", // hides the default file input
    },
    label: {
      backgroundColor: "blue",
      color: "white",
      padding: "10px",
      borderRadius: "4px",
      cursor: "pointer",
    },
  });
  
 
  const switchStyle = {
    root: {
      width: 40,
      height: 20,
      padding: 0,
      display: 'flex',
      backgroundColor: 'transparent',
    },
    switchBase: {
      padding: 2,
      '&$checked': {
        transform: 'translateX(20px)',
        color: '#fff',
        '& + $track': {
          opacity: 0.7,
          backgroundColor: '006400',
        },
      },
    },
    thumb: {
      width: 16,
      height: 16,
      boxShadow: 'none',
    },
    track: {
      width: '100%',
      height: 17,
      borderRadius: 10,
      borderColor: 'black',
      opacity: 0.7,
      backgroundColor: '#000',
    },
    checked: {},
  };
  export const CustomSwitch = withStyles(switchStyle)(Switch);