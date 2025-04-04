const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const {authMiddleware} = require('../middleware/AuthMiddleware')

router.post('/create',authMiddleware,OrderController.createOrder);
router.get('/get-details/:id',authMiddleware,OrderController.getOrderDetails);
router.get('/get-all-order',authMiddleware,OrderController.getAllOrder);
router.delete('/cancel-order/:id',authMiddleware,OrderController.cancelOrderDetails);