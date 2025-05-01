import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import * as Message from '../../components/MessageComponent/MessageComponent';
import * as OrderService from "../../services/OrderService";
import "../../styles/MenuStyle.css";
const MyOrderPage = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(
      user?.id,
      user?.access_token
    );
    return res.data;
  };

  const cancelMutation = useMutation({
    mutationFn: ({ id, items }) =>
      OrderService.cancelOrder(id, user?.access_token, items),
    onSuccess: () => {
      Message.toastSuccess("xóa thành công")
      queryClient.invalidateQueries(["my-orders", user?.id]); // refetch
    },
    onError: (error) => {
      Message.toastError("xóa thất bại")
    },
    onSettled: () => {
      queryClient.invalidateQueries(["my-orders", user?.id]); // refetch dù thành công hay thất bại
    },
  });

  const handleCancelOrder = (orderId, orderItems) => {
    if (window.confirm("❗Bạn chắc chắn muốn hủy đơn hàng này?")) {
      cancelMutation.mutate({ id: orderId, items: orderItems });
    }
  };

  const {
    isPending,
    data: orders = [],
    isError,
    error,
  } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: fetchMyOrder,
    enabled: !!user?.id && !!user?.access_token,
  });

  const handleViewDetails = (order) => {
    navigate(`/order-detail/${order._id}`);
  };

  return (
    <section className="hero_section">
      <section className="menu_section">
        <Container className="py-5">
          <h3 className="mb-4">📜 Danh sách đơn hàng của bạn</h3>

          {isPending ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Đang tải đơn hàng...</p>
            </div>
          ) : isError ? (
            <p className="text-danger">Lỗi khi tải đơn hàng: {error.message}</p>
          ) : orders.length === 0 ? (
            <p>🕵️‍♂️ Không có đơn hàng nào.</p>
          ) : (
            orders.map((order) => (
              <Card key={order._id} className="mb-4 p-3 shadow-sm">
                <h5 className="mb-3 text-primary">Mã đơn hàng: {order._id}</h5>
                <p>
                  <strong>Người nhận:</strong> {order.shippingAddress.fullname}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
                <p>
                  <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{" "}
                  {order.totalPrice.toLocaleString()}₫
                </p>
                <p>
                  <strong>Trạng thái giao hàng:</strong>{" "}
                  {order.isDelivered ? (
                    <span className="text-success">Đã giao</span>
                  ) : (
                    <span className="text-warning">Chưa giao</span>
                  )}
                </p>
                <p>
                  <strong>Trạng thái thanh toán:</strong>{" "}
                  {order.isPaid ? (
                    <span className="text-success">Đã thanh toán</span>
                  ) : (
                    <span className="text-danger">Chưa thanh toán</span>
                  )}
                </p>

                <div className="mb-3">
                  <strong>Sản phẩm:</strong>
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center my-2 p-2 border rounded"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          marginRight: "12px",
                        }}
                      />
                      <div>
                        <div>
                          <strong>{item.name}</strong>
                        </div>
                        <div>Giá: {item.price.toLocaleString()}</div>
                        <div>Số lượng: {item.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Row className="mt-3">
                  <Col xs="auto">
                    <Button
                      variant="danger"
                      onClick={() =>
                        handleCancelOrder(order._id, order.orderItems)
                      }
                      disabled={cancelMutation.isPending}
                    >
                      {cancelMutation.isPending
                        ? "Đang hủy..."
                        : "Hủy đơn hàng"}
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="info"
                      onClick={() => handleViewDetails(order)}
                    >
                      Xem chi tiết
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))
          )}
        </Container>
      </section>
    </section>
  );
};

export default MyOrderPage;
