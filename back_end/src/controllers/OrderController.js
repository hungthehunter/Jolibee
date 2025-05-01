const orderService = require("../services/OrderService");
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      paymentMethod,
      itemPrice,
      shippingPrice = 0,
      taxPrice = 0,
      totalPrice,
      shippingAddress,
      user,
    } = req.body;

    if (
      !orderItems?.length ||
      !shippingAddress?.fullname ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.country ||
      !shippingAddress?.phone ||
      !paymentMethod ||
      !itemPrice ||
      shippingPrice == null ||
      !taxPrice ||
      !totalPrice ||
      !user
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
        missing: {
          orderItems: !orderItems?.length,
          fullname: !shippingAddress?.fullname,
          address: !shippingAddress?.address,
          city: !shippingAddress?.city,
          country: !shippingAddress?.country,
          phone: !shippingAddress?.phone,
          paymentMethod: !paymentMethod,
          itemPrice: !itemPrice,
          shippingPrice: !shippingPrice,
          taxPrice: !taxPrice,
          totalPrice: !totalPrice,
          user: !user,
        },
      });
    }

    const orderData = req.body;
    const createdOrder = await orderService.createOrder(orderData);
    return res.status(200).json(createdOrder);
    // return res.status(200).json({
    //   status: "OK",
    //   message: 'OK nè',
    // });
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: error.message || "Internal server error",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const response = await orderService.getOrderDetails(orderId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      status: "ERR",
      message: error,
    });
  }
};


const getAllOrderByUserId = async (req, res) => {
  try {
    const orderId = req.params.id;
    const response = await orderService.getAllOrderByOrderId(orderId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      status: "ERR",
      message: error,
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const response = await orderService.getAllOrder();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      status: "ERR",
      message: error,
    });
  }
};

const cancelOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { orderItems } = req.body;
    const response = await orderService.cancelOrderDetails(orderId,orderItems);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      status: "ERR",
      message: error,
    });
  }
};


const updateOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const { isPaid,isDelivered } = req.body;

    const oldOrder = await orderService.getOrderDetails(id);
    if (!oldOrder) {
      return res.status(404).json({
        status: "ERR",
        message: "Order not found",
      });
    }

    const data = {
    isPaid,
    isDelivered
    };

    await orderService.updateOrder(id, data);
    return res.status(200).json({
      status: "OK",
      message: "Update order successfully",

    });
  } catch (error) {
    return res.status(400).json({
      status: "ERR",
      message: "Update order failed",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrderDetails,
  getAllOrder,
  cancelOrderDetails,
  getAllOrderByUserId,
  updateOrder
};
