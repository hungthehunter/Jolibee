// PopoverComponent.jsx
import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

const PopoverComponent = ({ content, children }) => {
  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      overlay={
        <Popover
        id="popover-basic"
        style={{
          zIndex: 9999,
          position: "relative",
          backgroundColor: "white",
          border: "1px solid #ccc",
        }}
      >
        <Popover.Body>{content()}</Popover.Body>
      </Popover>  
    }
      rootClose
    >

      <span style={{ display: "inline-block" }}>{children}</span>
    </OverlayTrigger>
  );
};

export default PopoverComponent;
