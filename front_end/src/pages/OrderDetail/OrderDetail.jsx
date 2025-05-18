import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import "../../styles/MenuStyle.css";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const user = useSelector((state) => state.user);

  const fetchOrderUserId = async (id, access_token) => {
    const res = await OrderService.getOrderById(id, access_token);
    return res.data;
  };

  const {
    data: orderData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["order-detail", orderId],
    queryFn: () => fetchOrderUserId(orderId, user?.access_token),
    enabled: !!orderId && !!user?.access_token,
  });

  if (isPending) {
    return (
      <section className="hero_section">
        <section className="menu_section">
          <Container className="py-5 text-center">
            <Spinner animation="border" />
            <p>Đang tải chi tiết đơn hàng...</p>
          </Container>
        </section>
      </section>
    );
  }

  if (isError || !orderData) {
    return (
      <section className="hero_section">
        <section className="menu_section">
          <Container className="py-5 text-center">
            <h4 className="text-danger">
              Lỗi khi tải đơn hàng:{" "}
              {error?.message || "Không tìm thấy đơn hàng."}
            </h4>
            <Button onClick={() => navigate("/")}>Về trang chủ</Button>
          </Container>
        </section>
      </section>
    );
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
    <section className="hero_section">
      <section className="menu_section">
        <Container className="py-5">
          <Card className="p-4 shadow-sm">
            <h3 className="mb-4 text-success">🎉 Detail Cart!</h3>
            <h5 className="mb-3">📦 More information about detail cart:</h5>

            <p>
              <strong>Recipient:</strong> {shippingAddress?.fullname}
            </p>
            <p>
              <strong>Address:</strong> {shippingAddress?.address},{" "}
              {shippingAddress?.city}, {shippingAddress?.country}
            </p>
            <p>
              <strong>Phone Number:</strong> {shippingAddress?.phone}
            </p>
            <p>
              <strong>Payment Method:</strong> {paymentMethod}
            </p>
            <p>
              <strong>Shipping fee:</strong>{" "}
              {shippingPrice.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
            <p>
              <strong>Delivery status:</strong>{" "}
              {isDelivered ? (
                <span className="text-success">Đã giao</span>
              ) : (
                <span className="text-warning">Chưa giao</span>
              )}
            </p>
            <p>
              <strong>Payment status</strong>{" "}
              {isPaid ? (
                <span className="text-success">Paid</span>
              ) : (
                <span className="text-danger">Not paid</span>
              )}
            </p>

            <hr />

            <h5 className="mt-4">🛒 Purchased product:</h5>
            {orderItems?.map((item, idx) => {
              const originalPrice = item.price;
              const discount = item?.product?.discount || 0;
              console.log("discount:", item?.product?.discount);
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
                        Original price:{" "}
                        <s>
                          {originalPrice.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </s>
                      </div>
                      <div>
                        Discount price:{" "}
                        <span className="text-danger">{discount}%</span>
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
                      Total:{" "}
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

            <div className="text-end mt-4">
              <Button
                variant="danger"
                onClick={() => navigate("/my-order")}
                style={{ marginRight: "15px" }}
              >
                Regarding your Order list
              </Button>
              <Button variant="primary" onClick={() => navigate("/menu")}>
                Continue shopping
              </Button>
            </div>
          </Card>
        </Container>
      </section>
    </section>
  );
};

export default OrderDetail;
