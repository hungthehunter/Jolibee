import {
    Button,
    Card,
    Col,
    Modal,
    Row,
    Spinner,
} from "react-bootstrap";

const OrderDetailModal = ({ show, onHide, orderData, isLoading }) => {
  if (isLoading) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Body className="text-center py-5">
          <Spinner animation="border" />
          <p>Đang tải chi tiết đơn hàng...</p>
        </Modal.Body>
      </Modal>
    );
  }

  if (!orderData) {
    return null;
  }

  const {
    shippingAddress,
    orderItems,
    totalPrice,
    paymentMethod,
    shippingPrice,
    isDelivered,
    isPaid,
  } = orderData;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>🎉 Chi tiết đơn hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="p-3 shadow-sm">
          <h5 className="mb-3">📦 Thông tin giao hàng:</h5>
          <p>
            <strong>Người nhận:</strong> {shippingAddress?.fullname}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {shippingAddress?.address},{" "}
            {shippingAddress?.city}, {shippingAddress?.country}
          </p>
          <p>
            <strong>SĐT:</strong> {shippingAddress?.phone}
          </p>
          <p>
            <strong>Phương thức thanh toán:</strong> {paymentMethod}
          </p>
          <p>
            <strong>Phí vận chuyển:</strong>{" "}
            {shippingPrice.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
          <p>
            <strong>Giao hàng:</strong>{" "}
            {isDelivered ? (
              <span className="text-success">Đã giao</span>
            ) : (
              <span className="text-warning">Chưa giao</span>
            )}
          </p>
          <p>
            <strong>Thanh toán:</strong>{" "}
            {isPaid ? (
              <span className="text-success">Đã thanh toán</span>
            ) : (
              <span className="text-danger">Chưa thanh toán</span>
            )}
          </p>

          <hr />

          <h5 className="mt-4">🛒 Sản phẩm đã mua:</h5>
          {orderItems?.map((item, idx) => {
            const originalPrice = item.price;
            const discount = item?.product?.discount || 0;
            const discountedPrice =
              originalPrice - (originalPrice * discount) / 100;
            const totalItemPrice = discountedPrice * item.amount;

            return (
              <div key={idx} className="mb-3 border-bottom pb-2">
                <Row>
                  <Col md={2}>
                    <img
                      src={item?.image}
                      alt={item?.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Col>
                  <Col md={6}>
                    <strong>{item?.name}</strong>
                    <div>
                      Giá gốc:{" "}
                      <s>
                        {originalPrice.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </s>
                    </div>
                    <div>
                      Giảm giá: <span className="text-danger">{discount}%</span>
                    </div>
                    <div>
                      Giá sau giảm:{" "}
                      <span className="text-success">
                        {discountedPrice.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </span>
                    </div>
                  </Col>
                  <Col md={2}>SL: {item?.amount}</Col>
                  <Col md={2}>
                    Tổng:{" "}
                    <strong>
                      {totalItemPrice.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </strong>
                  </Col>
                </Row>
              </div>
            );
          })}

          <h5 className="text-end mt-4">
            Tổng tiền:{" "}
            <strong>
              {totalPrice?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </strong>
          </h5>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailModal;
