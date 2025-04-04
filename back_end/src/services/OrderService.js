const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const EmailService = require("./EmailService");
const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
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
      email, // dùng cho send Email
    } = newOrder;

    try {
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount,
            },
          },
          { new: true }
        );
        if (productData) {
          const createdOrder = Order.create({
            orderItems,
            shippingAddress: {
              fullName,
              address,
              city,
              phone,
            },
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user: user,
          });
          if (createdOrder) {
            await EmailService.sendEmailCreateOrder(email, orderItems);
            resolve({
              status: "OK",
              message: "Order created successfully",
            });
          }
        } else {
          resolve({
            status: "ERR",
            message: "Failed to create order",
            data: order.product,
          });
        }
      });
      const result = await Promise.all(promises);
      const newData = result && result.filter((item) => item.data);
      if (newData.length) {
        resolve({
          status: "OK",
          message: `Product with id: ${newData.join(
            ","
          )} is not enough in stock`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findOne({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find();
      if (order === null) {
        resolve({
          status: "ERR",
          message: "Failed to get all order",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const cancelOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    const order = Order.findByIdAndUpdate({ _id: id });
    if (order === null) {
      resolve({
        status: "ERR",
        message: " Failed to cancel order details",
      });
    }

    resolve({
      status: "OK",
      message: "SUCCESS",
      data: order,
    });
  });
};

module.exports = {
  createOrder,
  getOrderDetails,
  getAllOrder,
  cancelOrderDetails,
};
