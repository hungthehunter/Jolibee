import { useState } from "react";
import { Accordion, Button, Card, Col, Container, Offcanvas, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminGenerateQR from "../../components/Admin/AdminGenerateQR/AdminGenerateQR";
import AdminOrder from "../../components/Admin/AdminOrder/AdminOrder";
import AdminProduct from "../../components/Admin/AdminProduct/AdminProduct";
import AdminUser from "../../components/Admin/AdminUser/AdminUser";
const AdminPage = () => {
  const [activeContent, setActiveContent] = useState("dashboard");
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

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

  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <Container fluid>
      <Row>
        {/* Toggle button for mobile */}
        <Button
          variant="secondary"
          className="d-md-none my-2 ms-3"
          onClick={() => setShowSidebar(true)}
        >
          ☰ Menu
        </Button>

        {/* Sidebar Offcanvas for mobile */}
        <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} className="d-md-none">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Admin Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <SidebarContent setActiveContent={setActiveContent} handleNavigateHome={handleNavigateHome} />
          </Offcanvas.Body>
        </Offcanvas>

        {/* Sidebar for desktop */}
        <Col md={3} className="bg-light p-3 d-none d-md-block" style={{ minHeight: "100vh" }}>
          <SidebarContent setActiveContent={setActiveContent} handleNavigateHome={handleNavigateHome} />
        </Col>

        {/* Main content */}
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

// Sidebar content extracted to keep code DRY
const SidebarContent = ({ setActiveContent, handleNavigateHome }) => (
  <>
    <Container className="mb-4">
      <div className="d-flex align-items-center">
        <span className="me-2">
          <i
            onClick={handleNavigateHome}
            className="bi bi-arrow-left"
            style={{ fontSize: "24px", cursor: "pointer" }}
          ></i>
        </span>
        <h4 className="mb-0" onClick={handleNavigateHome} style={{ cursor: "pointer" }}>
          Back To Home
        </h4>
      </div>
    </Container>

    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>User</Accordion.Header>
        <Accordion.Body>
          <Button variant="link" className="d-block text-start" onClick={() => setActiveContent("user")}>
            <i className="bi bi-person-vcard me-2"></i> Manage Users
          </Button>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Product</Accordion.Header>
        <Accordion.Body>
          <Button variant="link" className="d-block text-start" onClick={() => setActiveContent("product")}>
            <i className="bi bi-cart4 me-2"></i> Manage Products
          </Button>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Order</Accordion.Header>
        <Accordion.Body>
          <Button variant="link" className="d-block text-start" onClick={() => setActiveContent("order")}>
            <i className="bi bi-bag-check-fill me-2"></i> Manage Orders
          </Button>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header>Table</Accordion.Header>
        <Accordion.Body>
          <Button variant="link" className="d-block text-start" onClick={() => setActiveContent("tableQR")}>
            <i className="bi bi-qr-code me-2"></i> Manage Table
          </Button>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>
);

export default AdminPage;
