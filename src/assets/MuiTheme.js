import { createTheme } from "@mui/material";
const root = document.documentElement;
const smallWidth = getComputedStyle(root).getPropertyValue('--width-small');
const mediumWidth = getComputedStyle(root).getPropertyValue('--width-medium');
const largeWidth = getComputedStyle(root).getPropertyValue('--width-large');
const primaryColor= getComputedStyle(root).getPropertyValue('--col-primary');
const secondaryColor= getComputedStyle(root).getPropertyValue('--col-secondary');
const errorColor= getComputedStyle(root).getPropertyValue('--col-error');
const warningColor= getComputedStyle(root).getPropertyValue('--col-warning');
const infoColor= getComputedStyle(root).getPropertyValue('--col-info');
const successColor= getComputedStyle(root).getPropertyValue('--col-success');
const textPrimaryColor= getComputedStyle(root).getPropertyValue('--col-text-primary');
const textSecondaryColor= getComputedStyle(root).getPropertyValue('--col-text-secondary');
const textDisabledColor= getComputedStyle(root).getPropertyValue('--col-text-disabled');
const textHintColor= getComputedStyle(root).getPropertyValue('--col-text-hint');
const borderRadius=getComputedStyle(root).getPropertyValue('--border-radius-mui');
const selectedTabColor=getComputedStyle(root).getPropertyValue('--col-selected-tab');



export const theme=createTheme({
    
        "breakpoints": {
          "keys": [
            "xs",
            "sm",
            "md",
            "lg",
            "xl"
          ],
          "values": {
            "xs": 0,
            "sm": 600,
            "md": 900,
            "lg": 1200,
            "xl": 1536
          }
        },
        "direction": "ltr",
        "mixins": {
          "toolbar": {
            "minHeight": 56,
            "@media (min-width:0px) and (orientation: landscape)": {
              "minHeight": 48
            },
            "@media (min-width:600px)": {
              "minHeight": 64
            }
          }
        },
        "overrides": {},
        "palette": {
          "common": {
            "black": "#000",
            "white": "#fff"
          },
          "mode": "light",
          "primary": {
            "main": primaryColor,
            
          },
          "secondary": {
            "main": secondaryColor,
          },
          "error": {
            "main": errorColor,
          },
          "warning":{
            "main":warningColor
          },
          "info":{
            "main":infoColor
          },
          "success":{
            "main":successColor
          },
          
          "grey": {
            "50": "#fafafa",
            "100": "#f5f5f5",
            "200": "#eeeeee",
            "300": "#e0e0e0",
            "400": "#bdbdbd",
            "500": "#9e9e9e",
            "600": "#757575",
            "700": "#616161",
            "800": "#424242",
            "900": "#212121",
            "A100": "#d5d5d5",
            "A200": "#aaaaaa",
            "A400": "#303030",
            "A700": "#616161"
          },
          "contrastThreshold": 3,
          
          "tonalOffset": 0.2,
          "text": {
            "primary": textPrimaryColor,
            "secondary": textSecondaryColor,
            "disabled": textDisabledColor,
            "hint": textHintColor
          },
          "divider": "rgba(0, 0, 0, 0.12)",
          "background": {
            "paper": "#fff",
            "default": "#fff"
          },
          "action": {
            "active": "rgba(0, 0, 0, 0.54)",
            "hover": "rgba(0, 0, 0, 0.04)",
            "hoverOpacity": 0.04,
            "selected": "rgba(0, 0, 0, 0.08)",
            "selectedOpacity":0.08,

            "disabled": "rgba(0, 0, 0, 0.26)",
            "disabledBackground": "rgba(0, 0, 0, 0.12)",
            "disabledOpacity":0.38,
            "focus":"rgba(0,0,0,0.12)",
            "focusOpacity":0.12,
            "activatedOpacity":0.12
          }
        },
        "props": {},
        "shape":{
            "borderRadius":borderRadius
        },
        "shadows": [
          "none",
          "0px 1px 3px 0px rgba(0, 0, 0, 0.2),0px 1px 1px 0px rgba(0, 0, 0, 0.14),0px 2px 1px -1px rgba(0, 0, 0, 0.12)",
          "0px 1px 5px 0px rgba(0, 0, 0, 0.2),0px 2px 2px 0px rgba(0, 0, 0, 0.14),0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
          "0px 1px 8px 0px rgba(0, 0, 0, 0.2),0px 3px 4px 0px rgba(0, 0, 0, 0.14),0px 3px 3px -2px rgba(0, 0, 0, 0.12)",
          "0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
          "0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)",
          "0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 6px 10px 0px rgba(0, 0, 0, 0.14),0px 1px 18px 0px rgba(0, 0, 0, 0.12)",
          "0px 4px 5px -2px rgba(0, 0, 0, 0.2),0px 7px 10px 1px rgba(0, 0, 0, 0.14),0px 2px 16px 1px rgba(0, 0, 0, 0.12)",
          "0px 5px 5px -3px rgba(0, 0, 0, 0.2),0px 8px 10px 1px rgba(0, 0, 0, 0.14),0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
          "0px 5px 6px -3px rgba(0, 0, 0, 0.2),0px 9px 12px 1px rgba(0, 0, 0, 0.14),0px 3px 16px 2px rgba(0, 0, 0, 0.12)",
          "0px 6px 6px -3px rgba(0, 0, 0, 0.2),0px 10px 14px 1px rgba(0, 0, 0, 0.14),0px 4px 18px 3px rgba(0, 0, 0, 0.12)",
          "0px 6px 7px -4px rgba(0, 0, 0, 0.2),0px 11px 15px 1px rgba(0, 0, 0, 0.14),0px 4px 20px 3px rgba(0, 0, 0, 0.12)",
          "0px 7px 8px -4px rgba(0, 0, 0, 0.2),0px 12px 17px 2px rgba(0, 0, 0, 0.14),0px 5px 22px 4px rgba(0, 0, 0, 0.12)",
          "0px 7px 8px -4px rgba(0, 0, 0, 0.2),0px 13px 19px 2px rgba(0, 0, 0, 0.14),0px 5px 24px 4px rgba(0, 0, 0, 0.12)",
          "0px 7px 9px -4px rgba(0, 0, 0, 0.2),0px 14px 21px 2px rgba(0, 0, 0, 0.14),0px 5px 26px 4px rgba(0, 0, 0, 0.12)",
          "0px 8px 9px -5px rgba(0, 0, 0, 0.2),0px 15px 22px 2px rgba(0, 0, 0, 0.14),0px 6px 28px 5px rgba(0, 0, 0, 0.12)",
          "0px 8px 10px -5px rgba(0, 0, 0, 0.2),0px 16px 24px 2px rgba(0, 0, 0, 0.14),0px 6px 30px 5px rgba(0, 0, 0, 0.12)",
          "0px 8px 11px -5px rgba(0, 0, 0, 0.2),0px 17px 26px 2px rgba(0, 0, 0, 0.14),0px 6px 32px 5px rgba(0, 0, 0, 0.12)",
          "0px 9px 11px -5px rgba(0, 0, 0, 0.2),0px 18px 28px 2px rgba(0, 0, 0, 0.14),0px 7px 34px 6px rgba(0, 0, 0, 0.12)",
          "0px 9px 12px -6px rgba(0, 0, 0, 0.2),0px 19px 29px 2px rgba(0, 0, 0, 0.14),0px 7px 36px 6px rgba(0, 0, 0, 0.12)",
          "0px 10px 13px -6px rgba(0, 0, 0, 0.2),0px 20px 31px 3px rgba(0, 0, 0, 0.14),0px 8px 38px 7px rgba(0, 0, 0, 0.12)",
          "0px 10px 13px -6px rgba(0, 0, 0, 0.2),0px 21px 33px 3px rgba(0, 0, 0, 0.14),0px 8px 40px 7px rgba(0, 0, 0, 0.12)",
          "0px 10px 14px -6px rgba(0, 0, 0, 0.2),0px 22px 35px 3px rgba(0, 0, 0, 0.14),0px 8px 42px 7px rgba(0, 0, 0, 0.12)",
          "0px 11px 14px -7px rgba(0, 0, 0, 0.2),0px 23px 36px 3px rgba(0, 0, 0, 0.14),0px 9px 44px 8px rgba(0, 0, 0, 0.12)",
          "0px 11px 15px -7px rgba(0, 0, 0, 0.2),0px 24px 38px 3px rgba(0, 0, 0, 0.14),0px 9px 46px 8px rgba(0, 0, 0, 0.12)"
        ],
        
        "components":{
            "MuiAccordionSummary":{
                "styleOverrides":{
                    "root":{
                        "flexDirection":"row-reverse",
                    }
                }
            },
           
          "MuiButton":{
            "styleOverrides":{
"root":{
    "alignItems":"center"
}
            },
           "defaultProps":{
            "disableElevation":"true"
           }
        },
        "MuiDialog":{
          "styleOverrides":{
              "paper":{
             "maxWidth":"none",
              "width":'60vw'
}
}
          
      },
          "MuiTab":{
            "styleOverrides":{
              "root":{
                "&.MuiTab-root": {
                  "border": 0,
                  "borderBottom": "none",
                  "&:hover": {
                    "border": 0,
                    "borderBottom": "none",
                  },
                },
                "&.Mui-selected": {
                  "backgroundColor": selectedTabColor,
                  "borderBottom": "none",
                  "borderColor": selectedTabColor,
                }
                
              
              },
            
              
            }
          },
          "MuiFormControl":{
            "styleOverrides":{
              "root":{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    "borderColor": "#000", // Change the border color here
                  },
                }
              }
            }
          },
            "MuiAccordion":{
                "styleOverrides":{
                    "root":{
                    "width":'18vw',
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        "transform": 'rotate(90deg)',
                      },
                    },
                }
            },
        
            "MuiTextField":{
              "styleOverrides":{
                "root": ({ ownerState }) => ({
                  ...(ownerState.width === "small" && {
                    width: smallWidth
                  }),
                  ...(ownerState.width === "medium" && {
                    width: mediumWidth
                  }),
                  ...(ownerState.width === "large" && {
                    width: largeWidth
                  })
                })
              }
            }
            ,
            "MuiSelect":{
              "styleOverrides":{
                "root": ({ ownerState }) => ({
                  ...(ownerState.width === "small" && {
                    width: smallWidth
                  }),
                  ...(ownerState.width === "medium" && {
                    width: mediumWidth
                  }),
                  ...(ownerState.width === "large" && {
                    width: largeWidth
                  }),
                  "color":"#000",
                  "borderColor":"#000",
                  "borderRadius":0,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      "borderColor": "#000", // Change the border color here
                    },
                  }
                })
              }
            },
            "MuiAutocomplete":{
              "styleOverrides":{
                "root": ({ ownerState }) => ({
                  ...(ownerState.width === "small" && {
                    width: smallWidth
                  }),
                  ...(ownerState.width === "medium" && {
                    width: mediumWidth
                  }),
                  ...(ownerState.width === "large" && {
                    width: largeWidth
                  })
                })
              }
            },
            "MuiList":{
              "styleOverrides":{
                "root": ({ ownerState }) => ({
                  ...(ownerState.width === "small" && {
                    width: smallWidth
                  }),
                  ...(ownerState.width === "medium" && {
                    width: mediumWidth
                  }),
                  ...(ownerState.width === "large" && {
                    width: largeWidth
                  })
                })
              }
            }
           ,
            "MuiInputBase":{
              "styleOverrides": {
                "root": {
                  "color": "inherit",
                  "width":"100%",
                  "& .MuiInputBase-input": {
                    "transition": "width 200ms ease", // You can adjust the transition properties as needed
                  },
                },
              }
            }
        }
        ,
        "typography": {
          "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
          "fontSize": 14,
          "fontWeightLight": 300,
          "fontWeightRegular": 400,
          "fontWeightMedium": 500,
        
          "headline": {
            "fontSize": "1.5rem",
            "fontWeight": 400,
            "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
            "lineHeight": "1.35417em",
            "color": "rgba(0, 0, 0, 0.87)"
          },
          "title": {
            "fontSize": "1.3125rem",
            "fontWeight": 'bold',
            "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
            "lineHeight": "1.16667em",
            "color": "rgba(0, 0, 0, 0.87)"
          },
          "subheading": {
            "fontSize": "1rem",
            "fontWeight": 400,
            "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
            "lineHeight": "1.5em",
            "color": "rgba(0, 0, 0, 0.87)"
          },
          "body2": {
            "fontSize": "0.875rem",
            "fontWeight": 500,
            "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
            "lineHeight": "1.71429em",
            "color": "rgba(0, 0, 0, 0.87)"
          },
          "body1": {
            "fontSize": "1rem",
            "fontWeight": 400,
            "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
            "lineHeight": "1.46429em",
            "color": "rgba(0, 0, 0, 0.87)"
          },
          "caption": {
            "fontSize": "0.75rem",
            "fontWeight": 400,
            "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
            "lineHeight": "1.375em",
            "color": "rgba(0, 0, 0, 0.54)"
          },
          "button": {
            "fontSize": "0.875rem",
            "textTransform": "none",
            "fontWeight": 500,
            "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
            "color": "rgba(0, 0, 0, 0.87)",
            "width":"fit-content", 
          }
        },
        "transitions": {
          "easing": {
            "easeInOut": "cubic-bezier(0.4, 0, 0.2, 1)",
            "easeOut": "cubic-bezier(0.0, 0, 0.2, 1)",
            "easeIn": "cubic-bezier(0.4, 0, 1, 1)",
            "sharp": "cubic-bezier(0.4, 0, 0.6, 1)"
          },
          "duration": {
            "shortest": 150,
            "shorter": 200,
            "short": 250,
            "standard": 300,
            "complex": 375,
            "enteringScreen": 225,
            "leavingScreen": 195
          }
        }
       
})