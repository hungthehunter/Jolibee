import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as Message from "../../components/MessageComponent/MessageComponent";
import { addOrderProduct } from "../../redux/slices/orderSlice";
import * as ProductService from "../../services/ProductService";
import "./ProductDetailComponentStyle.css";
function ProductDetailComponent({ product, show, onHide }) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const orderItems = useSelector((state) => state.order.orderItems);
  const navigate = useNavigate();
  const location = useLocation();
  const idProduct = product?._id;

  const fetchGetDetailProduct = async (id) => {
    const res = await ProductService.getDetailsProduct(id);
    return res.data;
  };

  const { isPending, data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: () => fetchGetDetailProduct(idProduct),
    enabled: !!idProduct,
  });

  if (!product || isPending) return null;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else {
      Message.toastWarning("Số lượng tối thiểu là 1");
    }
  };

  const handleIncrease = () => {
    const existingItem = orderItems.find(
      (item) => item.product === productDetails?._id
    );

    const currentAmountInCart = existingItem ? existingItem.amount : 0;
    const totalNext = quantity + currentAmountInCart;

    if (totalNext < productDetails?.countInStock) {
      setQuantity((prev) => prev + 1);
    } else if (totalNext === productDetails?.countInStock) {
      setQuantity((prev) => prev + 1);
      Message.toastWarning("Không còn sản phẩm trong kho");
    } else {
      Message.toastWarning("Vượt quá số lượng trong kho");
    }
  };



  const handleAddOrderProduct = () => {
    if (!user?.id) {
      Message.toastError("Vui lòng đăng nhập trước khi thêm vào giỏ hàng");
      navigate("/sign-in", { state: location?.pathname });
      return;
    }

    const existingItem = orderItems.find(
      (item) => item.product === productDetails?._id
    );

    const totalAmount = existingItem
      ? existingItem.amount + quantity
      : quantity;

    if (productDetails?.countInStock === 0) {
      Message.toastError("Sản phẩm đã hết hàng");
    } else if (totalAmount > productDetails?.countInStock) {
      Message.toastWarning("Vượt quá số lượng có sẵn trong kho");
    } else {
      dispatch(
        addOrderProduct({
          orderItem: {
            name: productDetails?.name,
            amount: quantity,
            image: productDetails?.image,
            price: productDetails?.price,
            discount: productDetails?.discount,
            product: productDetails?._id,
            countInStock: productDetails?.countInStock,
          },
        })
      );
      Message.toastSuccess("Thêm sản phẩm vào giỏ hàng thành công");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Body className="product-modal">
        <Row className="modal-content-wrapper">
          <Col md={5} className="modal-image-container">
            <img
              src={product.image}
              alt={product.name}
              className="modal-image"
            />
          </Col>
          <Col md={7} className="modal-info">
            <h4 className="modal-title">{product.name}</h4>
            <p className="modal-description">{product.description}</p>
            <h4 className="modal-price">${product.price}</h4>

            <div className="quantity-wrapper">
              <label className="quantity-label">Số lượng</label>
              <div className="quantity-control">
                <button className="quantity-btn" onClick={handleDecrease}>
                  −
                </button>
                <input
                  type="text"
                  className="quantity-input"
                  value={quantity}
                  readOnly
                />
                <button className="quantity-btn" onClick={handleIncrease}>
                  +
                </button>
              </div>
            </div>

            <Button
              variant="warning"
              className="modal-order-btn"
              onClick={handleAddOrderProduct}
            >
              Add to shopping cart
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default ProductDetailComponent;
