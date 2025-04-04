const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const {authMiddleware} = require('../middleware/AuthMiddleware')

router.post('/createProduct',productController.createProduct);
router.get('/getProduct',productController.getDetailProduct);
router.put('/updateProduct/:id',authMiddleware,productController.updateProduct);
router.delete('/deleteProduct/:id',authMiddleware,productController.deleteProduct);
router.get('/get-details/:id',productController.getDetailProduct);
router.get('/get-all',productController.getAllProduct);
router.post('/delete-many',authMiddleware,productController.deleteManyProduct);
router.post('/get-all-type',productController.getAllType);


module.exports = router;