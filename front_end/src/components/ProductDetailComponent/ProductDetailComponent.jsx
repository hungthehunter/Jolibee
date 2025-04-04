import React from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import "./ProductDetailComponentStyle.css";
function ProductDetailComponent({ product, show, onHide }) {
  if (!product) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Body className="product-modal">
        <Row className="modal-content-wrapper">
          <Col md={5} className="modal-image-container">
            <img
              src={product.image}
              alt={product.title}
              className="modal-image"
            />
          </Col>
          <Col md={7} className="modal-info">
            <h4 className="modal-title">{product.title}</h4>
            <p className="modal-description">{product.paragraph}</p>
            <h4 className="modal-price">${product.price}</h4>
            <Button variant="warning" className="modal-order-btn">
              GỌI ĐẶT HÀNG - 19006960
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default ProductDetailComponent;
