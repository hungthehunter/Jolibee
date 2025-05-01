import React, { useState } from "react";
import { Col, Nav, Row } from "react-bootstrap";
import TypeProduct from '../TypeProduct/TypeProduct'; // Đường dẫn đúng tùy vào cấu trúc thư mục của bạn
import "./CategoryComponentStyle.css";

function CategoryComponent({ categories }) {
  const [selectedType, setSelectedType] = useState(null);

  const handleSelectType = (name) => {
    setSelectedType(name);
  };

  return (
    <Row>
      <Col>
        <Nav className="justify-content-center category-row">
          {categories.map((category, index) => (
            <Nav.Item key={index} className="category-item">
              <img
                title={category.name}
                alt={category.name}
                src={category.image}
              />
              <TypeProduct
                name={category.name}
                selectedType={selectedType}
                onClick={handleSelectType}
              />
            </Nav.Item>
          ))}
        </Nav>
      </Col>
    </Row>
  );
}

export default CategoryComponent;
