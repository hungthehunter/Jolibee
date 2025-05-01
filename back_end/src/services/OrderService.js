const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const EmailService = require("./EmailService");
const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemPrice,
      shippingPrice = 0,
      totalPrice,
      shippingAddress,
      order,
      user,
      email,
      isPaid,
      taxPrice = 0,
    } = newOrder;

    try {
      // Kiểm tra và cập nhật stock cho từng sản phẩm
      const updatedItems = [];
      for (const order of orderItems) {
        // Đảm bảo amount không âm
        if (order.amount <= 0) {
          return resolve({
            status: "ERR",
            message: `Invalid quantity for product ${order.product}`,
          });
        }

        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: order.amount,
            },
          },
          { new: true }
        );

        if (!productData) {
          return resolve({
            status: "ERR",
            message: `Product with id ${order.product} is not enough in stock`,
          });
        }

        updatedItems.push(order);
      }

      // Sau khi update stock thành công hết thì tạo đơn hàng
      const createdOrder = await Order.create({
        orderItems: updatedItems,
        shippingAddress: {
          fullname: shippingAddress.fullname,
          address: shippingAddress.address,
          city: shippingAddress.city,
          phone: shippingAddress.phone,
          country: shippingAddress.country || "Việt Nam",
        },
        paymentMethod,
        itemPrice: Math.max(itemPrice, 0),
        shippingPrice: Math.max(shippingPrice, 0),
        taxPrice: Math.max(taxPrice, 0),
        totalPrice: Math.max(totalPrice, 0),
        user,
        isPaid,
        order,
      });

      if (createdOrder) {
        await EmailService.sendEmailCreateOrder(email, orderItems);
        resolve({
          status: "OK",
          message: "Order created successfully",
          data: createdOrder,
        });
      } else {
        resolve({
          status: "ERR",
          message: "Failed to create order",
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
      const order = await Order.findById({
        _id: id,
      }).populate("orderItems.product");
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

const getAllOrderByOrderId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({ user: id })
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

const cancelOrderDetails = (id, orderItems) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await Promise.all(
        orderItems.map(async (order) => {
          const productData = await Product.findOneAndUpdate(
            {
              _id: order.product,
              selled: { $gte: order.amount },
            },
            {
              $inc: {
                countInStock: order.amount,
                selled: -order.amount,
              },
            },
            { new: true }
          );

          if (!productData) {
            return `Product with id ${order.product} does not exist or cannot be updated`;
          }
        })
      );

      const errorMessages = results.filter((result) => result);
      if (errorMessages.length) {
        return resolve({
          status: "ERR",
          message: errorMessages.join(", "),
        });
      }

      const order = await Order.findByIdAndDelete(id);
      if (!order) {
        return resolve({
          status: "ERR",
          message: "The order is not found",
        });
      }

      resolve({
        status: "OK",
        message: "Order has been successfully canceled",
        data: order,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateOrder = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const checkOrder = await Order.findById(id);

      // if (!checkOrder) {
      //   return resolve({
      //     status: "OK",
      //     message: "The order is not defined",
      //   });
      // }

      const updatedOrder = await Order.findByIdAndUpdate(id, data, {
        new: true,
      });

      return resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedOrder,
      });
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = {
  createOrder,
  getOrderDetails,
  getAllOrder,
  cancelOrderDetails,
  getAllOrderByOrderId,
  updateOrder,
};
