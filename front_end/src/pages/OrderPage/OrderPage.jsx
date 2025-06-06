import { useMutation } from "@tanstack/react-query";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  useCallback,
  useEffect, useMemo, useRef,
  useState
} from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Message from "../../components/MessageComponent/MessageComponent";
import ModalShippingInfo from "../../components/ModalComponent/ModalShippingInfo/ModalShippingInfo";
import ShippingProgressBar from "../../components/ShippingProgressBar/ShippingProgressBar";
import {
  clearOrder,
  decreaseAmount,
  increaseAmount,
  removeOrderProduct,
  removeSelectedOrders,
  selectAllOrders,
  selectedOrder,
} from "../../redux/slices/orderSlice";
import { updateUser } from "../../redux/slices/userSlice";
import * as OrderService from "../../services/OrderService";
import * as UserService from "../../services/UserService";
import "../../styles/MenuStyle.css";
import { OrderContext } from "../../utils";
const OrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);

  const [showShippingModal, setShowShippingModal] = useState(false);
  const isMounted = useRef(true);


const handleShowShippingModal = () => {
  if(user === null){
    Message.toastWarning("Vui lòng đăng nhập để đặt hàng");
    navigate("/login");
    return;
  }
    setShowShippingModal(true);
}

  const mutationAddOrder = useMutation({
    mutationFn: async (input) => {
      try {
        const res = await OrderService.createOrder(input.data, input.access_token);
        return res?.data; // Ensure res.data exists
      } catch (error) {
        console.error("🛑 Error calling createOrder:", error);
        throw error; // Throw the error for proper handling
      }
    },
    onSuccess: (data) => {
      if (data) {
        Message.toastSuccess("Đặt hàng thành công");
const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    if (table) {
      localStorage.removeItem(`order_data_table_${table}`);
    }
dispatch(clearOrder())
        navigate("/order-success", { state: { orderData: data } });
      } else {
        Message.toastError("❌ Lỗi: Không có dữ liệu đơn hàng");
        console.error("🛑 No data received in onSuccess");
      }
    },
    onError: (error) => {
      const resData = error?.response?.data;
      const missing = resData?.missing;
      const message = resData?.message || error.message;
  
      if (resData?.missing) {
        const missingFields = Object.entries(missing)
          .filter(([_, isMissing]) => isMissing)
          .map(([key]) => key)
          .join(", ");
        Message.toastError(`❌ ${message} (Thiếu: ${missingFields})`);
      } else {
        Message.toastError(`❌ Lỗi: ${message}`);
      }
  
      console.error("🛑 Lỗi tạo đơn hàng:", {
        status: error?.response?.status,
        message,
        missing,
        full: error,
      });
    },
  });

const handleAddOrder = (shippingInfo) => {
  const missingFields = [];

  if (!user?.access_token) missingFields.push("token người dùng");
  if (!user?.id) missingFields.push("ID người dùng");
  if (!user?.name) missingFields.push("họ tên");
  if (!user?.address && !shippingInfo?.address) missingFields.push("địa chỉ");
  if (!user?.phone && !shippingInfo?.phone) missingFields.push("số điện thoại");
  if (!user?.city && !shippingInfo?.city) missingFields.push("thành phố");
  if (!order?.orderItems?.length) missingFields.push("sản phẩm đã chọn");

  // 👉 Tính toán giá đơn hàng
  let subtotal = 0;
  let totalDiscount = 0;

  order?.orderItems?.forEach(item => {
    const pct = Math.min(Math.max(item.discount || 0, 0), 100) / 100;
    const before = item.price * item.amount;
    const after  = item.price * (1 - pct) * item.amount;

    subtotal      += after;
    totalDiscount += (before - after);
  });

  // 👉 Miễn phí vận chuyển nếu tổng > 100 hoặc phương thức là "EAT_IN"
  const isEatIn = shippingInfo?.paymentMethod === "EAT_IN";
  const shippingPrice = subtotal > 100 || isEatIn ? 0 : 20;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingPrice + tax;

  // Kiểm tra giá trị sau tính
  if (!total) missingFields.push("tổng tiền");
  if (shippingPrice === undefined || shippingPrice === null) missingFields.push("giá vận chuyển");
  if (subtotal === undefined || subtotal === null) missingFields.push("giá sản phẩm");

  if (missingFields.length > 0) {
    Message.toastWarning(
      `Vui lòng cung cấp các thông tin sau: ${missingFields.join(", ")}`
    );
    return;
  }

  const access_token = user?.access_token;

  const shippingAddress = {
    fullname: user.name,
    address: shippingInfo?.address || user.address,
    city: shippingInfo?.city || user.city,
    country: "Việt Nam",
    phone: shippingInfo?.phone || user.phone,
  };

  const orderData = {
    orderItems: order.orderItems,
    shippingAddress,
    paymentMethod: shippingInfo?.paymentMethod || "Thanh toán khi nhận hàng",
    itemPrice: parseFloat(subtotal.toFixed(2)),
    shippingPrice: parseFloat(shippingPrice.toFixed(2)),
    taxPrice: parseFloat(tax.toFixed(2)),
    totalPrice: parseFloat(total.toFixed(2)),
    user: user.id,
    isPaid: shippingInfo?.isPaid || false,
  };

// Lưu thông tin đơn hàng vào localStorage
const params = new URLSearchParams(window.location.search);
  const table = params.get("table");
  if (table) {
    const key = `order_data_table_${table}`;
    localStorage.setItem(key, JSON.stringify({ user, order: orderData }));
  }


  mutationAddOrder.mutate({ data: orderData, access_token });
};

  const handleGetDetailUser = async (id, token) => {
    try {
      const res = await UserService.getDetailUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (error) {
      console.error("Failed to fetch user info", error);
    }
  };

  useEffect(() => {
    if (user?.id && user?.access_token) {
      handleGetDetailUser(user.id, user.access_token);
    }

const params = new URLSearchParams(location.search);
  const table = params.get("table");
  if (table) {
    const key = `order_data_table_${table}`;
    const storedData = localStorage.getItem(key);
    if (storedData) {
      const { user, order } = JSON.parse(storedData);
      dispatch(updateUser(user));

    }
  }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleCheckAllOrders = () => dispatch(selectAllOrders());

  const handleSelectedOrder = useCallback(
    (id) => dispatch(selectedOrder({ productId: id })),
    [dispatch]
  );

  const handleDeleteSelectedOrders = () => dispatch(removeSelectedOrders());

  const handleIncrease = useCallback(
    (id) =>{

    dispatch(increaseAmount({ idProduct: id }))
} ,
    [dispatch]
  );

  const handleDecrease = useCallback(
    (item) => {
      if (item?.amount > 1) {
        dispatch(decreaseAmount({ idProduct: item?.product }));
      } else {
Message.toastWarning('At least 1 product available')
      }
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (id) => dispatch(removeOrderProduct({ idProduct: id })),
    [dispatch]
  );

const summary = useMemo(() => {
  let subtotal = 0;      
  let totalDiscount = 0; 

  order?.orderItems?.forEach(item => {
    const pct = Math.min(Math.max(item.discount || 0, 0), 100) / 100;
    const before = item.price * item.amount;
    const after  = item.price * (1 - pct) * item.amount;

    subtotal       += after;
    totalDiscount  += (before - after);
  });

  // phí vận chuyển: miễn phí nếu > 100, còn lại $20
  // const shippingPrice = subtotal > 100 ? 0 : 20;

  // thuế 10%
  const tax = subtotal * 0.1;

  const total = subtotal + tax;

  // + shippingPrice;

  return {
    itemPrice:     parseFloat(subtotal.toFixed(2)),
    discount:      parseFloat(totalDiscount.toFixed(2)),
    // shippingPrice: parseFloat(shippingPrice.toFixed(2)),
    tax:           parseFloat(tax.toFixed(2)),
    total:         parseFloat(total.toFixed(2)),
  };
}, [order?.orderItems]);


  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <section className="hero_section">
        <section className="menu_section">
          <Container className="py-5">
            <Row>
              <Col md={9}>
                <div className="border p-4 rounded bg-white shadow-sm mb-3">
                  <ShippingProgressBar itemPrice={summary.itemPrice} />
                </div>
              </Col>

              <Col md={9}>
                <div className="border p-4 rounded bg-white shadow-sm mb-3">
                  <h4 className="mb-4 fw-bold">Shopping Cart</h4>
                  <Row className="align-items-center fw-semibold text-secondary border-bottom pb-2 mb-3">
                    <Col xs={6}>
                      <Form.Check
                        type="checkbox"
                        label={`Total (${order?.orderItems?.length} products)`}
                        onChange={handleCheckAllOrders}
                        checked={
                          order?.selectedItemOrders?.length > 0 &&
                          order?.selectedItemOrders?.length ===
                            order?.orderItems?.length
                        }
                      />
                    </Col>
                    <Col className="text-center">Unit Price</Col>
                    <Col className="text-center">Quantity</Col>
                    <Col className="text-center">Total Amount</Col>
                    <Col className="text-center">Discount</Col>
                    <Col className="text-center">
                      {order?.selectedItemOrders?.length > 0 && (
                        <Button
                          variant="danger"
                          onClick={handleDeleteSelectedOrders}
                          className="ms-3"
                        >
                          <i className="bi bi-trash3"></i> Deleted selected
                        </Button>
                      )}
                    </Col>
                  </Row>

                  {order?.orderItems?.map((item, idx) => {
                    const discount = item.discount || 0;
                    const priceAfterDiscount =
                      item.price * (1 - discount / 100);
                    const subtotal = priceAfterDiscount * item.amount;

                    return (
                      <div
                        key={idx}
                        className="border p-3 rounded position-relative mb-2 bg-light hover-shadow"
                      >
                        <Row className="align-items-center">
                          <Col xs={1}>
                            <Form.Check
                              type="checkbox"
                              checked={order?.selectedItemOrders?.includes(
                                item?.product
                              )}
                              onChange={() =>
                                handleSelectedOrder(item?.product)
                              }
                            />
                          </Col>
                          <Col xs={2}>
                            <Image
                              src={
                                item?.image ||
                                "https://res.cloudinary.com/demo/image/upload/v1695374769/no-image.jpg"
                              }
                              thumbnail
                            />
                          </Col>
                          <Col xs={2} className="text-truncate fw-medium">
                            {item?.name}
                          </Col>
                          <Col
                            xs={2}
                            className="text-center text-primary fw-semibold"
                          >
                            {item?.price?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </Col>

                          <Col xs={2}>
                            <InputGroup size="sm">
                              <Button
                                variant="outline-primary"
                                onClick={() => handleDecrease(item)}
                              >
                                -
                              </Button>
                              <Form.Control
                                value={item?.amount}
                                readOnly
                                className="text-center fw-bold"
                              />
                              <Button
                                variant="outline-primary"
                                onClick={() => handleIncrease(item?.product)}
                              >
                                +
                              </Button>
                            </InputGroup>
                          </Col>
                          <Col
                            xs={1}
                            className="text-danger text-center fw-semibold"
                          >
                            {subtotal.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </Col>

                          <Col xs={1} className="text-truncate fw-medium">
                            {item?.discount}%
                          </Col>

                          <Col xs={1} className="text-center text-muted">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Delete product</Tooltip>}
                            >
                              <i
                                className="bi bi-trash fs-5 hover-opacity"
                                onClick={() => handleRemove(item?.product)}
                                role="button"
                              ></i>
                            </OverlayTrigger>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                </div>
              </Col>

              <Col md={3}>
                <div className="border p-4 rounded bg-white shadow w-100">
                  <h6 className="fw-bold mb-3">Order summary </h6>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Temporary calculation</span>
                    <span>
                      {summary?.itemPrice?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Discount</span>
                    <span>
                      {summary?.discount?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      }) || "$0.00"}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax</span>
                    <span>
                      {summary?.tax?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                     <span>Shipping fee (the default price is 20$ if you eat in it would be 0$)</span>
{/*                     <span>
                      {summary?.shippingPrice?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span> */}
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="m-0">Total amount</h5>
                    <h4 className="text-danger m-0">
                      {summary?.total?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h4>
                  </div>

                  <div className="text-muted small mt-1 mb-3">
                    (Include VAT if available)
                  </div>

                  <Button
                    className="w-100 mt-2 fw-bold"
                    variant="danger"
                    onClick={() => handleShowShippingModal()}
                  >
                    Buy now
                  </Button>
                </div>
              </Col>
            </Row>
<OrderContext.Provider value={{ totalPrice: summary.total}} >
            <ModalShippingInfo
              show={showShippingModal}
              handleClose={() => setShowShippingModal(false)}
              userInfo={user}
              mutationUpdate={{
                mutate: handleAddOrder,
              }}
              isPending={false}
            />
</OrderContext.Provider >
          </Container>
        </section>
      </section>
    </div>
  );
};

export default OrderPage;

