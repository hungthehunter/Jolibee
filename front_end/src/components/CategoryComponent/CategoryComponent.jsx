import { Col, Nav, Row } from "react-bootstrap";
import "./CategoryComponentStyle.css";

function CategoryComponent({ categories }) {
  return (
    <Row>
      <Col>
        <Nav className="justify-content-center category-row">
          {categories.map((category, index) => {
            return (
              <Nav.Item key={index} className="category-item">
                <img
                  title={category.title}
                  alt={category.title}
                  src={category.image}
                />
                <p>{category.title}</p>
              </Nav.Item>
            );
          })}
        </Nav>
      </Col>
    </Row>
  );
}

export default CategoryComponent;
