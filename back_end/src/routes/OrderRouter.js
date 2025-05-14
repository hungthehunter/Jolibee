// src/routes/OrderRouter.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');
const { authMiddleware,authUserMiddleware } = require('../middleware/AuthMiddleware');

// Routes
router.post('/create/:id', authUserMiddleware, orderController.createOrder);
router.get('/get-details-order/:id', orderController.getOrderDetails);
router.get('/get-all-order-user-id/:id',authUserMiddleware, orderController.getAllOrderByUserId);
router.delete('/cancel-order/:id',authUserMiddleware,orderController.cancelOrderDetails)
router.get('/get-all-order',orderController.getAllOrder)
router.put('/update-order/:id',authUserMiddleware,orderController.updateOrder)

module.exports = router;
