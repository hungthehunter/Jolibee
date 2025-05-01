import React, { useState } from "react";
import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import AdminGenerateQR from "../../components/Admin/AdminGenerateQR/AdminGenerateQR";
import AdminOrder from "../../components/Admin/AdminOrder/AdminOrder";
import AdminProduct from "../../components/Admin/AdminProduct/AdminProduct";
import AdminUser from "../../components/Admin/AdminUser/AdminUser";

const AdminPage = () => {
  const [activeContent, setActiveContent] = useState("dashboard");

  const renderContent = () => {
    switch (activeContent) {
      case "user":
        return <AdminUser />;
      case "product":
        return <AdminProduct />;
      case "order":
        return <AdminOrder />;
      case "tableQR":
        return <AdminGenerateQR />;
      default:
        return <div>Welcome to Admin Dashboard</div>;
    }
  };

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={3} className="bg-light p-3" style={{ minHeight: "100vh" }}>
          <h4 className="mb-4">Admin Menu</h4>
          <Accordion defaultActiveKey="0">
            {/* User Options */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>User</Accordion.Header>
              <Accordion.Body>
                <Button
                  variant="link"
                  className="d-block text-start"
                  onClick={() => setActiveContent("user")}
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontSize: "bold",
                  }}
                >
                  <i
                    class="bi bi-person-vcard"
                    style={{ display: "inline-block", paddingRight: "5px" }}
                  ></i>
                  Manage Users
                </Button>
              </Accordion.Body>
            </Accordion.Item>

            {/* Product Options */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>Product</Accordion.Header>
              <Accordion.Body>
                <Button
                  variant="link"
                  className="d-block text-start"
                  onClick={() => setActiveContent("product")}
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontSize: "bold",
                  }}
                >
                  <i
                    class="bi bi-cart4"
                    style={{ display: "inline-block", paddingRight: "5px" }}
                  ></i>
                  Manage Products
                </Button>
              </Accordion.Body>
            </Accordion.Item>

            {/* Order Options */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>Order</Accordion.Header>
              <Accordion.Body>
                <Button
                  variant="link"
                  className="d-block text-start"
                  onClick={() => setActiveContent("order")}
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontSize: "bold",
                  }}
                >
                  <i
                    class="bi bi-bag-check-fill"
                    style={{ display: "inline-block", paddingRight: "5px" }}
                  ></i>
                  Manage Order
                </Button>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Table</Accordion.Header>
              <Accordion.Body>
                <Button
                  variant="link"
                  className="d-block text-start"
                  onClick={() => setActiveContent("tableQR")}
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontSize: "bold",
                  }}
                >
                  <i
                    class="bi bi-qr-code"
                    style={{ display: "inline-block", paddingRight: "5px" }}
                  ></i>
                  Manage Table
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>

        {/* Main Content */}
        <Col md={9} className="p-4">
          <h3 className="mb-4">Dashboard</h3>
          <Card>
            <Card.Body>{renderContent()}</Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
