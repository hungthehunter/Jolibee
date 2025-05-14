import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { FaRegFileAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import * as OrderService from "../../../services/OrderService";
import DrawerComponent from "../../DrawerComponent/DrawerComponent";
import LoadingComponent from "../../LoadingComponent/LoadingComponent";
import {
  toastError,
  toastSuccess,
} from "../../MessageComponent/MessageComponent";
import ModalConfirmDelete from "../../ModalComponent/ModalConfirmDelete/ModalConfirmDelete";
import NumericFilter from "../../NumericFilter/NumericFilter";
import OrderDetailModal from "../../OrderDetailModal/OrderDetailModal";
import OrderRevenueChart from "../../OrderRevenueChart/OrderRevenueChart";
import TableComponent from "../../TableComponent/TableComponent";
const AdminOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [rowSelected, setRowSelected] = useState(null);
  const [numericFilters, setNumericFilters] = useState({});
  const [isShowDrawer, setIsShowDrawer] = useState(false);
  const [formData, setFormData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const user = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders, isPending } = useQuery({
    queryKey: ["orders"],
    queryFn: () => OrderService.getAllOrder(),
  });

  const { data: detailOrder } = useQuery({
    queryKey: ["order-details", rowSelected],
    queryFn: () => OrderService.getOrderDetails(rowSelected),
    enabled: !!rowSelected,
  });

  useEffect(() => {
    if (detailOrder?.data) {
      setFormData(detailOrder.data);
    }
  }, [detailOrder]);

  const handleViewDetail = async (orderId) => {
    const res = await OrderService.getOrderById(orderId, user.access_token);
    setSelectedOrder(res.data);
    setShowModal(true);
  };

  useEffect(() => {
    if (orders?.data) {
      let filtered = [...orders.data];
      if (searchTerm) {
        filtered = filtered.filter(
          (o) =>
            o.shippingAddress?.fullname
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            o.status?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      for (const field in numericFilters) {
        const { min, max } = numericFilters[field] || {};
        if (min !== "") {
          filtered = filtered.filter((o) => o[field] >= parseFloat(min));
        }
        if (max !== "") {
          filtered = filtered.filter((o) => o[field] <= parseFloat(max));
        }
      }
      setFilteredOrders(filtered);
    }
  }, [orders, searchTerm, numericFilters]);

  const mutationUpdate = useMutation({
    mutationFn: ({ id, formData, access_token }) =>
      OrderService.updateOrder(id, formData, access_token),
    onSuccess: () => {
      toastSuccess("Cập nhật đơn hàng thành công!");
      setIsShowDrawer(false);
    },
    onError: (error) =>
      toastError("Cập nhật đơn hàng thất bại!", error.message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const mutationDelete = useMutation({
    mutationFn: ({ id, access_token, orderItems }) => {
      console.log("Deleting order with data:", {
        id,
        access_token,
        orderItems,
      });
      return OrderService.cancelOrder(id, access_token, orderItems);
    },
    onSuccess: () => {
      toastSuccess("Xoá đơn hàng thành công!");
      setShowDeleteModal(false);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => toastError("Xoá đơn hàng thất bại!"),
  });

  const handleNumericFilter = (field) => (filter) => {
    setNumericFilters((prev) => ({
      ...prev,
      [field]: filter,
    }));
  };

  const confirmDelete = () => {
    mutationDelete.mutate({
      id: orderToDelete?._id,
      access_token: user?.access_token,
      orderItems: orderToDelete?.orderItems,
    });
  };

  const columns = [
    { title: "Order ID", dataIndex: "_id", exportTitle: "Order ID" },
    {
      title: "Customer",
      dataIndex: ["shippingAddress", "fullname"],
      render: (_, order) => order.shippingAddress?.fullname,
      exportTitle: "Customer",
    },
    {
      title: (
        <div className="d-flex align-items-center gap-2">
          <span>Total Price</span>
          <NumericFilter
            label="Total"
            onFilter={handleNumericFilter("totalPrice")}
          />
        </div>
      ),
      dataIndex: "totalPrice",
      render: (price) => `$${price}`,
      exportTitle: "Total Price",
    },
    {
      title: "Paid",
      dataIndex: "isPaid",
      render: (val) => (val ? "Yes" : "No"),
      exportTitle: "Paid",
    },
    {
      title: "Delivered",
      dataIndex: "isDelivered",
      render: (val) => (val ? "Yes" : "No"),
      exportTitle: "Delivered",
    },
  ];

  const renderAction = (order) => (
    <>
      <Button
        size="sm"
        variant="success"
        className="me-2"
        disabled={isPending}
        onClick={() => {
          handleViewDetail(order._id);
        }}
      >
        <FaRegFileAlt />
      </Button>

      <Button
        size="sm"
        variant="warning"
        className="me-2"
        disabled={isPending}
        onClick={() => {
          setRowSelected(order._id);
          setIsShowDrawer(true);
        }}
      >
        <BsPencilSquare />
      </Button>
      <Button
        size="sm"
        variant="danger"
        className="me-2"
        disabled={isPending}
        onClick={() => {
          setOrderToDelete(order);
          setShowDeleteModal(true);
        }}
      >
        <BsTrash />
      </Button>
    </>
  );

  return (
    <div>
      <h4>Order Management</h4>
      <Form.Control
        type="text"
        placeholder="Search by customer or status"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />

      <OrderRevenueChart orders={filteredOrders} />

      <TableComponent
        products={filteredOrders}
        isPending={isPending}
        columns={columns}
        rowSelected={rowSelected}
        setRowSelected={setRowSelected}
        action={renderAction}
      />

      <DrawerComponent
        title="Update Order"
        isOpen={isShowDrawer}
        onClose={() => setIsShowDrawer(false)}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Paid"
              name="isPaid"
              checked={formData.isPaid || false}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isPaid: e.target.checked,
                }))
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Delivered"
              name="isDelivered"
              checked={formData.isDelivered || false}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isDelivered: e.target.checked,
                }))
              }
            />
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsShowDrawer(false)}>
              Close
            </Button>
            <LoadingComponent isPending={false} />
            <Button
              variant="primary"
              onClick={() =>
                mutationUpdate.mutate({
                  id: rowSelected,
                  formData,
                  access_token: user?.access_token,
                })
              }
            >
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </DrawerComponent>

      <ModalConfirmDelete
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      <OrderDetailModal
        show={showModal}
        onHide={() => setShowModal(false)}
        orderData={selectedOrder}
        isLoading={!selectedOrder}
      />
    </div>
  );
};

export default AdminOrder;
