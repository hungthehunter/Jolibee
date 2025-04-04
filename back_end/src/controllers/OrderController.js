const orderService = require("../services/OrderService");
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
    } = req.body;
    if (
      !orderItems ||
      !paymentMethod ||
      !itemsPrice ||
      !shippingPrice ||
      !totalPrice ||
      !fullName ||
      !address ||
      !city ||
      !phone ||
      !user
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "Please fill all fields",
      });
    }

    const createdOrder = await orderService.createOrder(req.body);
    return res.status(200).json(createdOrder);
  } catch (error) {
    return res.status(400).json({
      status: "ERR",
      message: error,
    });
  }
};

const getOrderDetails = async (req,res) => {
  try {
    const orderId = req.params.id;
    const response = await orderService.getOrderDetails(orderId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      status: "ERR",
      message: error
    })
  }
}

const getAllOrder = async (req,res) =>{
  try {
    const response = await orderService.getAllOrder();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      status: 'ERR',
      message: error
    })
  }
}

const cancelOrderDetails = async(req,res) =>{
  try {
    const orderId = req.params.id;
    const response = await orderService.cancelOrderDetails(orderId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      status: 'ERR',
      message: error
    })
}
}

module.exports = {
  createOrder,
  getOrderDetails,
  getAllOrder
};
