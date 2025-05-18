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
        <Modal.Title>🎉 Detail order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="p-3 shadow-sm">
          <h5 className="mb-3">📦 Shipping information:</h5>
          <p>
            <strong>Recipient:</strong> {shippingAddress?.fullname}
          </p>
          <p>
            <strong>Address:</strong> {shippingAddress?.address},{" "}
            {shippingAddress?.city}, {shippingAddress?.country}
          </p>
          <p>
            <strong>Phone number:</strong> {shippingAddress?.phone}
          </p>
          <p>
            <strong>Payment method:</strong> {paymentMethod}
          </p>
          <p>
            <strong>Shipping fee:</strong>{" "}
            {shippingPrice.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
          <p>
            <strong>Delivery:</strong>{" "}
            {isDelivered ? (
              <span className="text-success">Delivered</span>
            ) : (
              <span className="text-warning">Not Delivered</span>
            )}
          </p>
          <p>
            <strong>Payment:</strong>{" "}
            {isPaid ? (
              <span className="text-success">Paid</span>
            ) : (
              <span className="text-danger">Not Paid</span>
            )}
          </p>

          <hr />

          <h5 className="mt-4">🛒 Product Buyed:</h5>
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
                      Discount: <span className="text-danger">{discount}%</span>
                    </div>
                    <div>
                      Price after discount:{" "}
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
                    Total :{" "}
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
            Total amount:{" "}
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
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailModal;
