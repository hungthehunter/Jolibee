const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const {authMiddleware} = require('../middleware/AuthMiddleware')


router.post('/sign-up',userController.createUser)
router.post('/sign-in',userController.loginUser)
router.post('/log-out',userController.logoutUser)
router.put('/update-user/:id',authMiddleware,userController.updateUser)
router.delete('/delete-user/:id',authMiddleware,userController.deleteUser)
router.get('/getAll',authMiddleware,userController.getAllUser);
router.get('/get-details/:id',authMiddleware,userController.getDetailUser);
router.post('/refresh-token/',userController.refreshToken);

module.exports = router;