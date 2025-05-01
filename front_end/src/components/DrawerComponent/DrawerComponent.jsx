import React from 'react';
import { Modal } from 'react-bootstrap';
import './DrawerComponentStyle.css';

const DrawerComponent = ({ title, isOpen, onClose, children, ...rest }) => {
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      dialogClassName="drawer-modal"
      backdropClassName="drawer-backdrop"
      {...rest}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>

    </Modal>
  );
};

export default DrawerComponent;
