import { styled } from "@linaria/react";
// import styled from 'styled-components';
import React from 'react'
import { useLayer } from "react-laag";
import PropTypes from "prop-types";

  const SimpleMenu = styled.div(`
    width: 175px;
    padding: 8px 0;
    border-radius: 6px;
    box-shadow: 0px 0px 1px rgba(62, 65, 86, 0.7), 0px 6px 12px rgba(62, 65, 86, 0.35);
    
    display: flex;
    flex-direction: column;
    
    background-color: white;
    font-size: 13px;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    
    .danger {
      color: rgba(255, 40, 40, 0.8);
      &:hover {
        color: rgba(255, 40, 40, 1);
      }
    }
    
    > div {
      padding: 6px 8px;
      color: rgba(0, 0, 0, 0.7);
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: rgba(0, 0, 0, 0.9);
      }
      transition: background-color 100ms;
      cursor: pointer;
    }
  `);


export default function Headermenu(props) {


  // Usage
  
const isOpen = props?.menu !== undefined;

const { layerProps, renderLayer } = useLayer({
  isOpen,
  auto: true,
  placement: "bottom-end",
  triggerOffset: 2,
  onOutsideClick: () => props?.setMenu(undefined),
  trigger: {
    getBounds: () => ({
      left: props?.menu ? props?.menu.bounds?.x : 0,
      // top: props?.menu ? props?.menu.bounds?.y : 0,
      width: props?.menu ? props?.menu.bounds?.width : 0,
      height: props?.menu ? props?.menu.bounds?.height : 0,
      right: (props?.menu ? props?.menu.bounds?.x : 0) + (props?.menu ? props?.menu.bounds?.width : 0),
      bottom: (props?.menu ? props?.menu.bounds?.y : 0) + (props?.menu ? props?.menu.bounds?.height : 0),
    }),
  },
});
  return (
<>
   {isOpen &&
    renderLayer(
      <SimpleMenu {...layerProps}>
        <div onClick={() => props?.setMenu(undefined)}>These do nothing</div>
        <div onClick={() => props?.setMenu(undefined)}>Add column right</div>
        <div onClick={() => props?.setMenu(undefined)}>Add column left</div>
        <div className="danger" onClick={() => props?.setMenu(undefined)}>
          Delete
        </div>
      </SimpleMenu>
   )}
   
   </>
 );
}

Headermenu.propTypes = {
 menu: PropTypes.any,
 setMenu: PropTypes.any,
};
