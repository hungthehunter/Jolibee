import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/MenuStyle.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData; 

  if (!orderData) {
    return (
      <section className="hero_section">
        <section className="menu_section">
          <Container className="py-5">
            <h4>Không tìm thấy thông tin đơn hàng.</h4>
            <Button onClick={() => navigate("/")}>Về trang chủ</Button>
          </Container>
        </section>
      </section>
    );
  }

  const { shippingAddress, orderItems, totalPrice, paymentMethod } = orderData;

  return (
    <section className="hero_section">
      <section className="menu_section">
        <Container className="py-5">
          <Card className="p-4 shadow-sm">
            <h3 className="mb-4 text-success">🎉 Đặt hàng thành công!</h3>
            <h5 className="mb-3">📦 Chi tiết đơn hàng:</h5>

            <p>
              <strong>Người nhận:</strong> {shippingAddress.fullname}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {shippingAddress.address},{" "}
              {shippingAddress.city}, {shippingAddress.country}
            </p>
            <p>
              <strong>SĐT:</strong> {shippingAddress.phone}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong> {paymentMethod}
            </p>

            <hr />

            <h5 className="mt-4">🛒 Sản phẩm đã mua:</h5>
            {orderItems.map((item, idx) => (
              <div key={idx} className="mb-3 border-bottom pb-2">
                <Row>
                  <Col md={2}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Col>
                  <Col md={8}>
                    <strong>{item.name}</strong>
                  </Col>
                  <Col md={2}>SL: {item.amount}</Col>
                  <Col md={2}>Giá: {item.price}₫</Col>
                </Row>
              </div>
            ))}

            <h5 className="text-end mt-4">
              Tổng tiền: <strong>{totalPrice.toLocaleString()}₫</strong>
            </h5>

            <div className="text-end mt-4" >
              <Button variant="danger" onClick={() => navigate("/my-order")} style={{marginRight:'15px'}}>
                Về danh sách Order của bạn
              </Button>

              <Button variant="primary"  onClick={() => navigate("/menu")}>
                Tiếp tục mua sắm
              </Button>
            </div>
            
          </Card>
        </Container>
      </section>
    </section>
  );
};

export default OrderSuccess;
